import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'
import { toContractValue } from '../utils/toContractValue'

export type UmbrellaAggregateTvsHandlerDefinition = v.infer<
  typeof UmbrellaAggregateTvsHandlerDefinition
>
export const UmbrellaAggregateTvsHandlerDefinition = v.strictObject({
  type: v.literal('umbrellaAggregateTvs'),
  // Field on the Umbrella contract returning the AaveOracle indirectly via
  // PoolAddressesProvider. Defaults to "POOL_ADDRESSES_PROVIDER".
  poolAddressesProviderField: v.string().optional(),
  // Field on the AaveOracle returned via PoolAddressesProvider.getPriceOracle.
  // Defaults to "getPriceOracle".
  oracleField: v.string().optional(),
  // Field on the Umbrella contract returning the list of UmbrellaStakeTokens.
  // Defaults to "getStkTokens".
  stkTokensField: v.string().optional(),
})

const GET_STK_TOKENS_ABI =
  'function getStkTokens() view returns (address[])'
const TOTAL_ASSETS_ABI = 'function totalAssets() view returns (uint256)'
const ASSET_ABI = 'function asset() view returns (address)'
const DECIMALS_ABI = 'function decimals() view returns (uint8)'
const GET_ASSET_PRICE_ABI =
  'function getAssetPrice(address asset) view returns (uint256)'
const BASE_CURRENCY_UNIT_ABI =
  'function BASE_CURRENCY_UNIT() view returns (uint256)'
const GET_PRICE_ORACLE_ABI =
  'function getPriceOracle() view returns (address)'
const POOL_ADDRESSES_PROVIDER_ABI =
  'function POOL_ADDRESSES_PROVIDER() view returns (address)'

/**
 * Handler that aggregates total USD value staked across all UmbrellaStakeTokens.
 *
 * Configured on the Umbrella contract. Walks `getStkTokens()`, reads
 * `totalAssets()` + `decimals()` + `asset()` on each, prices each stake-asset
 * via AaveOracle.getAssetPrice. If the direct asset is not priced (typical for
 * StataTokenV2 wrappers like waEthUSDC), unwraps one level via the wrapper's
 * own `asset()` and tries again. Sums into a single integer USD value.
 *
 * Used as a fieldRef source for impactCap on Umbrella admin functions
 * (updateSlashingConfigs, setDeficitOffset) — it's the absolute upper bound
 * on harm an Umbrella admin can cause to stakers across all configured
 * stake tokens.
 */
export class UmbrellaAggregateTvsHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    private readonly definition: UmbrellaAggregateTvsHandlerDefinition,
    _abi: string[],
  ) {}

  getMethod(): string {
    return 'umbrellaAggregateTvs'
  }

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    const chain = ChainSpecificAddress.chain(address)
    const papField =
      this.definition.poolAddressesProviderField ?? 'POOL_ADDRESSES_PROVIDER'
    const stkField = this.definition.stkTokensField ?? 'getStkTokens'

    const papRaw = await provider.callMethod<string>(
      address,
      `function ${papField}() view returns (address)`,
      [],
    )
    if (typeof papRaw !== 'string') {
      return {
        field: this.field,
        error: `${papField}() did not return an address on ${address}`,
      }
    }
    const pap = ChainSpecificAddress(`${chain}:${papRaw}`)

    const oracleRaw = await provider.callMethod<string>(
      pap,
      GET_PRICE_ORACLE_ABI,
      [],
    )
    if (typeof oracleRaw !== 'string') {
      return {
        field: this.field,
        error: `getPriceOracle() did not return an address on ${pap}`,
      }
    }
    const oracle = ChainSpecificAddress(`${chain}:${oracleRaw}`)

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

    const stks = await provider.callMethod<unknown[]>(
      address,
      `function ${stkField}() view returns (address[])`,
      [],
    )
    if (!Array.isArray(stks)) {
      return {
        field: this.field,
        error: `${stkField}() did not return an array on ${address}`,
      }
    }

    let totalUsd = 0n

    for (const stkRaw of stks) {
      if (typeof stkRaw !== 'string') continue
      const stk = ChainSpecificAddress(`${chain}:${stkRaw}`)

      const totalAssetsRaw = await provider
        .callMethod<unknown>(stk, TOTAL_ASSETS_ABI, [])
        .catch(() => undefined)
      const totalAssets = toBigInt(totalAssetsRaw)
      if (totalAssets === undefined || totalAssets === 0n) continue

      const decRaw = await provider
        .callMethod<unknown>(stk, DECIMALS_ABI, [])
        .catch(() => undefined)
      const decimals = toNumber(decRaw)
      if (decimals === undefined) continue

      const assetRaw = await provider
        .callMethod<unknown>(stk, ASSET_ABI, [])
        .catch(() => undefined)
      if (typeof assetRaw !== 'string') continue

      // Price the stake token's underlying. AaveOracle returns 0 (or reverts)
      // for assets it doesn't know — typical for StataTokenV2 wrappers like
      // waEthUSDC. Try direct first, then unwrap one level (StataTokenV2 is
      // ERC4626 so it also exposes `asset()`).
      let price = await tryPrice(provider, oracle, assetRaw)
      if (price === undefined || price === 0n) {
        const inner = await provider
          .callMethod<unknown>(
            ChainSpecificAddress(`${chain}:${assetRaw}`),
            ASSET_ABI,
            [],
          )
          .catch(() => undefined)
        if (typeof inner === 'string') {
          price = await tryPrice(provider, oracle, inner)
          if (price === undefined || price === 0n) {
            // Some inner assets are themselves wrapped (e.g. aTokens). Try
            // one more hop.
            const inner2 = await provider
              .callMethod<unknown>(
                ChainSpecificAddress(`${chain}:${inner}`),
                ASSET_ABI,
                [],
              )
              .catch(() => undefined)
            if (typeof inner2 === 'string') {
              price = await tryPrice(provider, oracle, inner2)
            }
          }
        }
      }
      if (price === undefined || price === 0n) continue

      // USD = totalAssets * price / (10^decimals * BASE_CURRENCY_UNIT)
      const denom = 10n ** BigInt(decimals) * baseUnit
      if (denom === 0n) continue
      const valueUsd = (totalAssets * price) / denom
      totalUsd += valueUsd
    }

    return { field: this.field, value: totalUsd.toString() }
  }
}

async function tryPrice(
  provider: IProvider,
  oracle: ChainSpecificAddress,
  assetHex: string,
): Promise<bigint | undefined> {
  const priceRaw = await provider
    .callMethod<unknown>(oracle, GET_ASSET_PRICE_ABI, [assetHex])
    .catch(() => undefined)
  return toBigInt(priceRaw)
}

function toBigInt(v: unknown): bigint | undefined {
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
