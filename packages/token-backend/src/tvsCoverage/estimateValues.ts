import { getErrorMessage, UnixTime } from '@l2beat/shared-pure'
import type {
  Coverage,
  CoverageRow,
  CoverageStatus,
  MintedCopy,
} from './coverage'
import type { NetMinted, SupplyChange, TokenSupply } from './supplyChange'
import { tokenKey } from './tokens'

export interface VaultAsset {
  address: string
  symbol: string | undefined
}

export type ChainCall =
  | { type: 'totalSupply'; token: string }
  | { type: 'balanceOf'; token: string; holder: string }
  | { type: 'decimals'; token: string }
  | { type: 'vaultAsset'; token: string }

export type ChainCallResult = bigint | number | VaultAsset | undefined

export interface ChainReader {
  /**
   * Results line up with `calls`, and a call that fails yields `undefined`.
   * Calls that fail because of the RPC, not the contract, are reported in
   * `warnings`. Throws when the chain cannot be read at all. With `before`,
   * reads the state at the last block before that time.
   */
  read(
    chain: string,
    calls: ChainCall[],
    warnings: string[],
    before?: UnixTime,
  ): Promise<ChainCallResult[]>
}

export class MissingRpcError extends Error {
  constructor(chain: string) {
    super('No RPC in the token DB', { cause: { chain } })
  }
}

export interface MarketData {
  priceUsd: number | undefined
  circulatingSupply: number | undefined
  // CoinGecko gave no circulating supply: it does not know one, does not list
  // the coin, or could not be read.
  circulatingSupplyUnknown: boolean
}

export interface PriceSource {
  getMarketData(
    coingeckoIds: string[],
    warnings: string[],
  ): Promise<Map<string, MarketData>>
}

export type AmountGap =
  | 'nonEvm'
  | 'nativeSupply'
  | 'noEscrows'
  | 'noRpc'
  | 'readFailed'

export type AmountSource =
  | 'totalSupply'
  | 'circulatingSupply'
  | 'escrowBalance'
  | 'mintedSupply'

export interface RowValue {
  amount: number | undefined
  amountSource: AmountSource | undefined
  amountGap: AmountGap | undefined
  // The amount is the total supply because CoinGecko has no circulating
  // supply to cap it with, e.g. a native token's premint or treasury.
  circulatingSupplyUnknown: boolean
  escrowBalance: number | undefined
  mintedCopy: (MintedCopy & { supply: number | undefined }) | undefined
  priceUsd: number | undefined
  valueUsd: number | undefined
  vaultAsset: (VaultAsset & { counted: boolean }) | undefined
  supplyChange: SupplyChange | undefined
}

export interface ValueEstimates {
  values: Map<string, RowValue>
  warnings: string[]
  stats: {
    rows: number
    chainCalls: number
    pastSupplyCalls: number
    coingeckoIds: number
    supplyChanges: number
  }
}

const ESTIMATED_STATUSES = new Set<CoverageStatus>([
  'missing',
  'sameAssetOnly',
  'scheduled',
])

const EVM_ADDRESS = /^0x[0-9a-f]{40}$/

export function rowKey(
  row: Pick<CoverageRow, 'projectId' | 'chain' | 'address'>,
) {
  return `${row.projectId}:${tokenKey(row)}`
}

export async function estimateValues(
  coverage: Coverage,
  reader: ChainReader,
  prices: PriceSource,
  netMinted: NetMinted,
): Promise<ValueEstimates> {
  const plans = coverage.rows
    .filter((row) => ESTIMATED_STATUSES.has(row.status))
    .map((row) => planRow(row, coverage))
  const coingeckoIds = Array.from(
    new Set(plans.flatMap((plan) => plan.row.pricing?.coingeckoId ?? [])),
  )

  const reads = new ChainReads()
  for (const plan of plans) {
    if (plan.amount) reads.addAmount(plan.amount)
    if (plan.mintedCopy?.amount) reads.addAmount(plan.mintedCopy.amount)
    if (plan.readsVault) {
      reads.add(plan.row.chain, { type: 'vaultAsset', token: plan.row.address })
    }
  }

  const warnings: string[] = []
  const [marketData] = await Promise.all([
    prices.getMarketData(coingeckoIds, warnings).catch((error: unknown) => {
      warnings.push(`Reading prices failed: ${getErrorMessage(error)}`)
      return new Map<string, MarketData>()
    }),
    reads.execute(reader, warnings),
  ])

  // The supplies that were read, as they were when the compared transfers
  // start. Read after the rest, so a chain's RPC gets one batch at a time.
  const pastSupplies = new ChainReads(netMinted.since)
  for (const plan of plans) {
    const supply = reads.readSupply(supplyRead(plan))
    if (supply) pastSupplies.add(supply.chain, totalSupplyCall(supply.address))
  }
  await pastSupplies.execute(reader, warnings)

  const values = new Map(
    plans.map((plan) => {
      const market = plan.row.pricing
        ? marketData.get(plan.row.pricing.coingeckoId)
        : undefined
      return [
        rowKey(plan.row),
        toRowValue(plan, reads, market, coverage, pastSupplies, netMinted),
      ]
    }),
  )
  return {
    values,
    warnings,
    stats: {
      rows: plans.length,
      chainCalls: reads.size,
      pastSupplyCalls: pastSupplies.size,
      coingeckoIds: coingeckoIds.length,
      supplyChanges: Array.from(values.values()).filter(
        (value) => value.supplyChange,
      ).length,
    },
  }
}

// An amount on one chain: the sum of `calls`, scaled by the token decimals.
interface AmountRead {
  chain: string
  token: string
  decimals: number | undefined
  calls: ChainCall[]
}

interface AmountResult {
  amount: number | undefined
  gap: AmountGap | undefined
}

interface RowPlan {
  row: CoverageRow
  // Why the amount cannot be read, when that is known before reading.
  gap: AmountGap | undefined
  // A chain row reads the total supply, an escrow row its escrow balances.
  amount: AmountRead | undefined
  mintedCopy: (MintedCopy & { amount: AmountRead | undefined }) | undefined
  readsVault: boolean
}

function planRow(row: CoverageRow, coverage: Coverage): RowPlan {
  const plan: RowPlan = {
    row,
    gap: undefined,
    amount: undefined,
    mintedCopy: undefined,
    readsVault: false,
  }
  if (!isReadable(row.address)) return { ...plan, gap: 'nonEvm' }

  if (row.side === 'chain') {
    if (row.address === 'native') return { ...plan, gap: 'nativeSupply' }
    return {
      ...plan,
      amount: totalSupply(row.chain, row.address, row.decimals),
      readsVault: true,
    }
  }

  const holders = coverage.escrowAddresses(row.projectId, row.chain)
  const copy = coverage.mintedCopy(row.projectId, row)
  return {
    ...plan,
    gap: holders.length === 0 ? 'noEscrows' : undefined,
    amount:
      holders.length === 0
        ? undefined
        : amountRead(
            row.chain,
            row.address,
            row.decimals,
            holders.map((holder) => ({
              type: 'balanceOf',
              token: row.address,
              holder,
            })),
          ),
    mintedCopy: copy && {
      ...copy,
      amount: EVM_ADDRESS.test(copy.address)
        ? totalSupply(copy.chain, copy.address, copy.decimals)
        : undefined,
    },
  }
}

// The total supply read for a row: its own, or its minted copy's.
function supplyRead(plan: RowPlan): AmountRead | undefined {
  return plan.row.side === 'chain' ? plan.amount : plan.mintedCopy?.amount
}

function totalSupply(
  chain: string,
  token: string,
  decimals: number | undefined,
): AmountRead {
  return amountRead(chain, token, decimals, [totalSupplyCall(token)])
}

function totalSupplyCall(token: string): ChainCall {
  return { type: 'totalSupply', token }
}

function amountRead(
  chain: string,
  token: string,
  decimals: number | undefined,
  calls: ChainCall[],
): AmountRead {
  return {
    chain,
    token,
    decimals: decimals ?? (token === 'native' ? 18 : undefined),
    calls,
  }
}

// Collects calls per chain without duplicates, reads every chain once, and
// looks results up by call.
class ChainReads {
  private readonly calls = new Map<string, Map<string, ChainCall>>()
  private readonly results = new Map<string, Map<string, ChainCallResult>>()
  private readonly failures = new Map<string, AmountGap>()

  constructor(private readonly before?: UnixTime) {}

  get size() {
    let size = 0
    for (const calls of this.calls.values()) size += calls.size
    return size
  }

  add(chain: string, call: ChainCall) {
    const calls = this.calls.get(chain) ?? new Map<string, ChainCall>()
    calls.set(callKey(call), call)
    this.calls.set(chain, calls)
  }

  addAmount(amount: AmountRead) {
    for (const call of amount.calls) this.add(amount.chain, call)
    if (amount.decimals === undefined) {
      this.add(amount.chain, { type: 'decimals', token: amount.token })
    }
  }

  async execute(reader: ChainReader, warnings: string[]) {
    await Promise.all(
      Array.from(this.calls, async ([chain, byKey]) => {
        const calls = Array.from(byKey.values())
        try {
          const results = await reader.read(chain, calls, warnings, this.before)
          this.results.set(
            chain,
            new Map(calls.map((call, i) => [callKey(call), results[i]])),
          )
        } catch (error) {
          const at =
            this.before === undefined
              ? ''
              : ` before ${UnixTime.toDate(this.before).toISOString()}`
          warnings.push(
            `Reading ${chain}${at} failed: ${getErrorMessage(error)}`,
          )
          this.failures.set(
            chain,
            error instanceof MissingRpcError ? 'noRpc' : 'readFailed',
          )
        }
      }),
    )
  }

  get(chain: string, call: ChainCall): ChainCallResult {
    return this.results.get(chain)?.get(callKey(call))
  }

  readAmount(amount: AmountRead): AmountResult {
    const failure = this.failures.get(amount.chain)
    if (failure) return { amount: undefined, gap: failure }

    const values = amount.calls.map((call) => this.get(amount.chain, call))
    const decimals = this.decimals(amount)
    // A partial sum would understate the amount, so one failed read fails it.
    if (!values.every(isBigint) || decimals === undefined) {
      return { amount: undefined, gap: 'readFailed' }
    }
    const raw = values.reduce((total, value) => total + value, 0n)
    return { amount: Number(raw) / 10 ** decimals, gap: undefined }
  }

  readSupply(read: AmountRead | undefined): TokenSupply | undefined {
    if (!read) return undefined
    const { amount } = this.readAmount(read)
    const decimals = this.decimals(read)
    if (amount === undefined || decimals === undefined) return undefined
    return { chain: read.chain, address: read.token, amount, decimals }
  }

  private decimals(amount: AmountRead): number | undefined {
    const decimals =
      amount.decimals ??
      this.get(amount.chain, { type: 'decimals', token: amount.token })
    return typeof decimals === 'number' ? decimals : undefined
  }
}

function toRowValue(
  plan: RowPlan,
  reads: ChainReads,
  market: MarketData | undefined,
  coverage: Coverage,
  pastSupplies: ChainReads,
  netMinted: NetMinted,
): RowValue {
  const { row } = plan
  const own = plan.amount && reads.readAmount(plan.amount)
  const minted =
    plan.mintedCopy?.amount && reads.readAmount(plan.mintedCopy.amount)
  const mintedCopy = plan.mintedCopy && {
    chain: plan.mintedCopy.chain,
    address: plan.mintedCopy.address,
    symbol: plan.mintedCopy.symbol,
    decimals: plan.mintedCopy.decimals,
    supply: minted?.amount,
  }
  const { amount, amountSource } =
    row.side === 'escrow'
      ? escrowAmount(own, minted)
      : supplyAmount(own?.amount, market?.circulatingSupply)
  const priceUsd = market?.priceUsd
  const vault = plan.readsVault
    ? reads.get(row.chain, { type: 'vaultAsset', token: row.address })
    : undefined
  const supply = reads.readSupply(supplyRead(plan))
  const pastSupply =
    supply && pastSupplies.get(supply.chain, totalSupplyCall(supply.address))

  return {
    amount,
    amountSource,
    amountGap:
      amount === undefined ? (own?.gap ?? minted?.gap ?? plan.gap) : undefined,
    circulatingSupplyUnknown:
      amountSource === 'totalSupply' &&
      market?.circulatingSupplyUnknown === true,
    escrowBalance: row.side === 'escrow' ? own?.amount : undefined,
    mintedCopy,
    priceUsd,
    valueUsd:
      amount !== undefined && priceUsd !== undefined
        ? amount * priceUsd
        : undefined,
    vaultAsset: isVaultAsset(vault)
      ? {
          ...vault,
          counted: coverage.isCounted(row.projectId, {
            chain: row.chain,
            address: vault.address,
          }),
        }
      : undefined,
    supplyChange:
      supply && isBigint(pastSupply)
        ? netMinted.supplyChange(
            supply,
            Number(pastSupply) / 10 ** supply.decimals,
            priceUsd,
          )
        : undefined,
  }
}

// Tokens locked in escrows the TVS config does not list still back the
// minted copy, so its supply bounds what the project's escrows hold. When
// either read fails, the larger of the two is unknown.
function escrowAmount(
  escrows: AmountResult | undefined,
  minted: AmountResult | undefined,
): { amount: number | undefined; amountSource: AmountSource | undefined } {
  if (escrows?.gap || minted?.gap) {
    return { amount: undefined, amountSource: undefined }
  }
  const escrowBalance = escrows?.amount
  const mintedSupply = minted?.amount
  if (
    mintedSupply !== undefined &&
    (escrowBalance === undefined || mintedSupply > escrowBalance)
  ) {
    return { amount: mintedSupply, amountSource: 'mintedSupply' }
  }
  if (escrowBalance !== undefined) {
    return { amount: escrowBalance, amountSource: 'escrowBalance' }
  }
  return { amount: undefined, amountSource: undefined }
}

// A token's supply on one chain cannot exceed its circulating supply
// everywhere, so a premint that is not circulating does not inflate value.
function supplyAmount(
  totalSupply: number | undefined,
  circulatingSupply: number | undefined,
): { amount: number | undefined; amountSource: AmountSource | undefined } {
  if (totalSupply === undefined) {
    return { amount: undefined, amountSource: undefined }
  }
  if (circulatingSupply !== undefined && circulatingSupply < totalSupply) {
    return { amount: circulatingSupply, amountSource: 'circulatingSupply' }
  }
  return { amount: totalSupply, amountSource: 'totalSupply' }
}

function callKey(call: ChainCall): string {
  return call.type === 'balanceOf'
    ? `${call.type}:${call.token}:${call.holder}`
    : `${call.type}:${call.token}`
}

function isReadable(address: string) {
  return address === 'native' || EVM_ADDRESS.test(address)
}

function isBigint(value: ChainCallResult): value is bigint {
  return typeof value === 'bigint'
}

function isVaultAsset(value: ChainCallResult): value is VaultAsset {
  return typeof value === 'object'
}
