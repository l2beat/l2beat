import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'
import { toContractValue } from '../utils/toContractValue'

export type AaveMarketAggregateTvsHandlerDefinition = v.infer<
  typeof AaveMarketAggregateTvsHandlerDefinition
>
export const AaveMarketAggregateTvsHandlerDefinition = v.strictObject({
  type: v.literal('aaveMarketAggregateTvs'),
  // Optional filter: only include reserves whose aToken contract name matches
  // (case-insensitive substring). Used to compute "RWA-only" subsets without
  // needing a separate handler. If omitted, all reserves are included.
  aTokenNameFilter: v.string().optional(),
  // Optional override of the field on `self` that returns the AaveOracle
  // address. Aave V3 PoolAddressesProvider uses `getPriceOracle`. Defaults
  // to "getPriceOracle".
  priceOracleField: v.string().optional(),
  // Optional override of the field on `self` that returns the Pool address.
  // PoolAddressesProvider uses `getPool`. Defaults to "getPool".
  poolField: v.string().optional(),
  // Optional holder address. When set, the handler sums
  // aToken.balanceOf(holder) × price across reserves instead of
  // aToken.totalSupply() × price. Used to compute a single holder's USD
  // exposure across the market — e.g. the Aave Collector's treasury size
  // for impactCap fieldRefs. Format: bare hex (0x…) or chain-prefixed
  // (eth:0x…); chain prefix is normalized to the caller's chain at runtime.
  balanceOfAddress: v.string().optional(),
})

const GET_RESERVES_LIST_ABI =
  'function getReservesList() view returns (address[])'
// Aave V3 Pool.getReserveData returns a single ReserveData struct.
// The struct's element order is invariant across markets we touch:
//   [0] configuration (tuple(uint256 data))
//   [1] liquidityIndex (uint128)
//   [2] currentLiquidityRate (uint128)
//   [3] variableBorrowIndex (uint128)
//   [4] currentVariableBorrowRate (uint128)
//   [5] currentStableBorrowRate (uint128) — kept for storage layout, ignored on v3.4+
//   [6] lastUpdateTimestamp (uint40)
//   [7] id (uint16)
//   [8] aTokenAddress (address)            ← we read this
//   [9] stableDebtTokenAddress (address)
//  [10] variableDebtTokenAddress (address)
//  [11] interestRateStrategyAddress (address)
//  [12] accruedToTreasury (uint128)
//  [13] unbacked (uint128)
//  [14] isolationModeTotalDebt (uint128)
const GET_RESERVE_DATA_ABI =
  'function getReserveData(address asset) view returns (' +
  'tuple(' +
  'tuple(uint256 data) configuration,' +
  'uint128 liquidityIndex,' +
  'uint128 currentLiquidityRate,' +
  'uint128 variableBorrowIndex,' +
  'uint128 currentVariableBorrowRate,' +
  'uint128 currentStableBorrowRate,' +
  'uint40 lastUpdateTimestamp,' +
  'uint16 id,' +
  'address aTokenAddress,' +
  'address stableDebtTokenAddress,' +
  'address variableDebtTokenAddress,' +
  'address interestRateStrategyAddress,' +
  'uint128 accruedToTreasury,' +
  'uint128 unbacked,' +
  'uint128 isolationModeTotalDebt' +
  '))'
const ATOKEN_ADDRESS_INDEX = 8
const ATOKEN_ADDRESS_KEY = 'aTokenAddress'
const TOTAL_SUPPLY_ABI = 'function totalSupply() view returns (uint256)'
const BALANCE_OF_ABI =
  'function balanceOf(address account) view returns (uint256)'
const DECIMALS_ABI = 'function decimals() view returns (uint8)'
const GET_ASSET_PRICE_ABI =
  'function getAssetPrice(address asset) view returns (uint256)'
const BASE_CURRENCY_UNIT_ABI =
  'function BASE_CURRENCY_UNIT() view returns (uint256)'
const NAME_ABI = 'function name() view returns (string)'

/**
 * Handler that aggregates total supplied USD value across an Aave V3 market.
 *
 * Walks `Pool.getReservesList()`, fetches each reserve's aToken via
 * `getReserveData`, multiplies `aToken.totalSupply()` by
 * `AaveOracle.getAssetPrice(asset)` (a USD price scaled by
 * `BASE_CURRENCY_UNIT`), divides by 10^decimals and BASE_CURRENCY_UNIT,
 * and sums into a single integer USD value.
 *
 * Configured on a PoolAddressesProvider entry: caller address is the PAP,
 * which exposes `getPool()` and `getPriceOracle()`. Resulting field is a
 * USD-denominated integer (whole dollars).
 */
export class AaveMarketAggregateTvsHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    private readonly definition: AaveMarketAggregateTvsHandlerDefinition,
    _abi: string[],
  ) {}

  getMethod(): string {
    return 'aaveMarketAggregateTvs'
  }

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    const chain = ChainSpecificAddress.chain(address)
    const poolField = this.definition.poolField ?? 'getPool'
    const oracleField = this.definition.priceOracleField ?? 'getPriceOracle'

    // Resolve Pool + AaveOracle from the PoolAddressesProvider's accessors
    const poolRaw = await provider.callMethod<string>(
      address,
      `function ${poolField}() view returns (address)`,
      [],
    )
    if (typeof poolRaw !== 'string') {
      return {
        field: this.field,
        error: `${poolField}() did not return an address on ${address}`,
      }
    }
    const oracleRaw = await provider.callMethod<string>(
      address,
      `function ${oracleField}() view returns (address)`,
      [],
    )
    if (typeof oracleRaw !== 'string') {
      return {
        field: this.field,
        error: `${oracleField}() did not return an address on ${address}`,
      }
    }

    const pool = ChainSpecificAddress(`${chain}:${poolRaw}`)
    const oracle = ChainSpecificAddress(`${chain}:${oracleRaw}`)

    // Read AaveOracle's BASE_CURRENCY_UNIT (typically 1e8 for USD-quoted markets)
    const baseUnitRaw = await provider.callMethod<unknown>(
      oracle,
      BASE_CURRENCY_UNIT_ABI,
      [],
    )
    const baseUnit = toBigInt(baseUnitRaw)
    if (baseUnit === undefined || baseUnit === 0n) {
      return {
        field: this.field,
        error: `BASE_CURRENCY_UNIT() invalid on ${oracle}`,
      }
    }

    const reserves = await provider.callMethod<unknown[]>(
      pool,
      GET_RESERVES_LIST_ABI,
      [],
    )
    if (!Array.isArray(reserves)) {
      return {
        field: this.field,
        error: `getReservesList() did not return an array on ${pool}`,
      }
    }

    const filter = this.definition.aTokenNameFilter?.toLowerCase()
    // Optional holder for balanceOf-mode aggregation. Strip any chain prefix
    // ("eth:0xAbC..." → "0xAbC...") so the bare hex string can be used as a
    // function argument; if omitted, we fall back to totalSupply() mode.
    const holderRawConfig = this.definition.balanceOfAddress
    const holderHex = holderRawConfig
      ? holderRawConfig.includes(':')
        ? holderRawConfig.split(':').slice(-1)[0]
        : holderRawConfig
      : undefined
    let totalUsd = 0n

    for (const assetRaw of reserves) {
      if (typeof assetRaw !== 'string') continue
      const asset = ChainSpecificAddress(`${chain}:${assetRaw}`)

      // Fetch reserve data → aToken address
      const rdRaw = await provider.callMethod<unknown>(
        pool,
        GET_RESERVE_DATA_ABI,
        [assetRaw],
      )
      if (rdRaw === undefined || rdRaw === null) continue
      const rd = toContractValue(rdRaw)
      const aTokenAddrStr = pickAddressByKeyOrIndex(
        rd,
        ATOKEN_ADDRESS_KEY,
        ATOKEN_ADDRESS_INDEX,
      )
      if (!aTokenAddrStr) continue

      const aToken = ChainSpecificAddress(`${chain}:${aTokenAddrStr}`)

      if (filter) {
        const nameRaw = await provider
          .callMethod<unknown>(aToken, NAME_ABI, [])
          .catch(() => undefined)
        const name = typeof nameRaw === 'string' ? nameRaw.toLowerCase() : ''
        if (!name.includes(filter)) continue
      }

      // amountUnits is the raw aToken amount we attribute to this reserve:
      // either the holder's per-reserve balance (when balanceOfAddress is
      // set) or the reserve's full totalSupply.
      let amountUnits: bigint | undefined
      if (holderHex !== undefined) {
        const balRaw = await provider
          .callMethod<unknown>(aToken, BALANCE_OF_ABI, [holderHex])
          .catch(() => undefined)
        amountUnits = toBigInt(balRaw)
      } else {
        const tsRaw = await provider.callMethod<unknown>(
          aToken,
          TOTAL_SUPPLY_ABI,
          [],
        )
        amountUnits = toBigInt(tsRaw)
      }
      if (amountUnits === undefined || amountUnits === 0n) continue
      const totalSupply = amountUnits

      const decRaw = await provider.callMethod<unknown>(
        aToken,
        DECIMALS_ABI,
        [],
      )
      const decimals = toNumber(decRaw)
      if (decimals === undefined) continue

      const priceRaw = await provider.callMethod<unknown>(
        oracle,
        GET_ASSET_PRICE_ABI,
        [assetRaw],
      )
      const price = toBigInt(priceRaw)
      if (price === undefined) continue

      // USD = totalSupply * price / (10^decimals * BASE_CURRENCY_UNIT)
      const denom = 10n ** BigInt(decimals) * baseUnit
      if (denom === 0n) continue
      const valueUsd = (totalSupply * price) / denom
      totalUsd += valueUsd
    }

    return { field: this.field, value: totalUsd.toString() }
  }
}

function toBigInt(v: unknown): bigint | undefined {
  // ethers v5 returns BigNumber objects from view calls; toContractValue
  // converts them to either number or string. Run it first so we always
  // see one of the expected primitive shapes.
  const norm = toContractValue(v as never)
  if (typeof norm === 'bigint') return norm
  if (typeof norm === 'number' && Number.isFinite(norm)) return BigInt(norm)
  if (typeof norm === 'string' && norm.length > 0) {
    try {
      return BigInt(norm)
    } catch {
      return undefined
    }
  }
  return undefined
}

function toNumber(v: unknown): number | undefined {
  const norm = toContractValue(v as never)
  if (typeof norm === 'number' && Number.isFinite(norm)) return norm
  if (typeof norm === 'bigint') return Number(norm)
  if (typeof norm === 'string' && norm.length > 0) {
    const n = Number(norm)
    return Number.isFinite(n) ? n : undefined
  }
  return undefined
}

function pickAddressByKeyOrIndex(
  value: unknown,
  key: string,
  index: number,
): string | undefined {
  if (Array.isArray(value)) {
    const v = value[index]
    return typeof v === 'string' ? v : undefined
  }
  if (typeof value === 'object' && value !== null) {
    const v = (value as Record<string, unknown>)[key]
    return typeof v === 'string' ? v : undefined
  }
  return undefined
}
