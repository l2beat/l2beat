import type {
  CoverageResult,
  CoverageRow,
  CoverageStatus,
  MintedCopy,
} from './model'
import { tokenKey } from './model'

export interface VaultAsset {
  address: string
  symbol: string | undefined
}

export type ChainCall =
  | { type: 'totalSupply'; token: string }
  | { type: 'balanceOf'; token: string; holder: string }
  | { type: 'decimals'; token: string }
  | { type: 'vaultAsset'; token: string }

export type ChainCallResult = bigint | VaultAsset | undefined

export interface ChainReader {
  read(chain: string, calls: ChainCall[]): Promise<ChainCallResult[]>
}

export class MissingRpcError extends Error {
  constructor(chain: string) {
    super(`No RPC for ${chain} in the token DB`)
  }
}

export interface MarketData {
  priceUsd: number | undefined
  circulatingSupply: number | undefined
}

export interface PriceSource {
  getMarketData(coingeckoIds: string[]): Promise<Map<string, MarketData>>
}

export type AmountGap =
  | 'nonEvm'
  | 'nativeSupply'
  | 'noEscrows'
  | 'noRpc'
  | 'readFailed'

export interface RowValue {
  amount: number | undefined
  amountGap: AmountGap | undefined
  cappedByCirculatingSupply: boolean
  escrowBalance: number | undefined
  mintedCopy: (MintedCopy & { supply: number | undefined }) | undefined
  priceUsd: number | undefined
  valueUsd: number | undefined
  vaultAsset: (VaultAsset & { counted: boolean }) | undefined
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
  return `${row.projectId}:${tokenKey(row.chain, row.address)}`
}

interface CallRef {
  chain: string
  index: number
}

interface Amount {
  refs: CallRef[]
  decimals: number | CallRef | undefined
}

interface PlannedRow {
  row: CoverageRow
  gap: AmountGap | undefined
  amount: Amount | undefined
  minted: (MintedCopy & { amount: Amount | undefined }) | undefined
  vault: CallRef | undefined
}

interface ChainRead {
  results: ChainCallResult[]
  gap: AmountGap | undefined
}

type ChainResults = Map<string, ChainRead>

export async function estimateValues(
  coverage: CoverageResult,
  reader: ChainReader,
  prices: PriceSource,
): Promise<{ values: Map<string, RowValue>; warnings: string[] }> {
  const rows = coverage.rows.filter((row) => ESTIMATED_STATUSES.has(row.status))
  const warnings: string[] = []

  const calls = new Map<string, ChainCall[]>()
  const push = (chain: string, call: ChainCall): CallRef => {
    const chainCalls = calls.get(chain) ?? []
    calls.set(chain, chainCalls)
    return { chain, index: chainCalls.push(call) - 1 }
  }
  const planned = rows.map((row) => planRow(row, coverage, push))

  const [chainResults, marketData] = await Promise.all([
    readChains(calls, reader, warnings),
    prices
      .getMarketData(
        Array.from(
          new Set(rows.flatMap((row) => row.pricing?.coingeckoId ?? [])),
        ),
      )
      .catch((error: unknown) => {
        warnings.push(`Reading prices failed: ${errorMessage(error)}`)
        return new Map<string, MarketData>()
      }),
  ])

  const values = new Map<string, RowValue>()
  for (const plan of planned) {
    const market = plan.row.pricing
      ? marketData.get(plan.row.pricing.coingeckoId)
      : undefined
    values.set(rowKey(plan.row), toValue(plan, chainResults, market, coverage))
  }
  return { values, warnings }
}

function planRow(
  row: CoverageRow,
  coverage: CoverageResult,
  push: (chain: string, call: ChainCall) => CallRef,
): PlannedRow {
  const empty = { amount: undefined, minted: undefined, vault: undefined }
  if (!isReadable(row.address)) return { row, gap: 'nonEvm', ...empty }

  const decimals = (chain: string, token: string, known?: number) =>
    known ??
    (token === 'native' ? 18 : push(chain, { type: 'decimals', token }))

  if (row.side === 'escrow') {
    const holders = coverage.escrowAddresses(row.projectId, row.chain)
    const copy = coverage.mintedCopy(row.projectId, row)
    const minted =
      copy && EVM_ADDRESS.test(copy.address)
        ? {
            ...copy,
            amount: {
              refs: [
                push(copy.chain, { type: 'totalSupply', token: copy.address }),
              ],
              decimals: decimals(copy.chain, copy.address, copy.decimals),
            },
          }
        : copy && { ...copy, amount: undefined }
    return {
      row,
      gap: holders.length === 0 ? 'noEscrows' : undefined,
      amount:
        holders.length === 0
          ? undefined
          : {
              refs: holders.map((holder) =>
                push(row.chain, {
                  type: 'balanceOf',
                  token: row.address,
                  holder,
                }),
              ),
              decimals: decimals(row.chain, row.address, row.decimals),
            },
      minted,
      vault: undefined,
    }
  }

  if (row.address === 'native') return { row, gap: 'nativeSupply', ...empty }

  return {
    row,
    gap: undefined,
    amount: {
      refs: [push(row.chain, { type: 'totalSupply', token: row.address })],
      decimals: decimals(row.chain, row.address, row.decimals),
    },
    minted: undefined,
    vault: push(row.chain, { type: 'vaultAsset', token: row.address }),
  }
}

async function readChains(
  calls: Map<string, ChainCall[]>,
  reader: ChainReader,
  warnings: string[],
): Promise<ChainResults> {
  const entries = await Promise.all(
    Array.from(
      calls,
      async ([chain, chainCalls]): Promise<[string, ChainRead]> => {
        try {
          const results = await reader.read(chain, chainCalls)
          return [chain, { results, gap: undefined }]
        } catch (error) {
          warnings.push(`Reading ${chain} failed: ${errorMessage(error)}`)
          const gap: AmountGap =
            error instanceof MissingRpcError ? 'noRpc' : 'readFailed'
          return [chain, { results: chainCalls.map(() => undefined), gap }]
        }
      },
    ),
  )
  return new Map(entries)
}

function toValue(
  plan: PlannedRow,
  chains: ChainResults,
  market: MarketData | undefined,
  coverage: CoverageResult,
): RowValue {
  const { row } = plan
  const own = plan.amount && readAmount(plan.amount, chains)
  const minted = plan.minted && {
    chain: plan.minted.chain,
    address: plan.minted.address,
    symbol: plan.minted.symbol,
    decimals: plan.minted.decimals,
    supply: plan.minted.amount
      ? readAmount(plan.minted.amount, chains).amount
      : undefined,
  }

  // Tokens locked in escrows the TVS config does not list still back the
  // minted copy, so its supply bounds what the project's escrows should hold.
  const onchainAmount =
    row.side === 'escrow' ? max(own?.amount, minted?.supply) : own?.amount
  const amountGap =
    onchainAmount !== undefined ? undefined : (plan.gap ?? own?.gap)

  // A token's total supply on one chain cannot exceed its circulating supply
  // everywhere, so a premint that is not circulating does not inflate value.
  const circulating = market?.circulatingSupply
  const cappedByCirculatingSupply =
    row.side === 'chain' &&
    onchainAmount !== undefined &&
    circulating !== undefined &&
    circulating < onchainAmount
  const amount = cappedByCirculatingSupply ? circulating : onchainAmount
  const priceUsd = market?.priceUsd

  const vault = plan.vault && result(plan.vault, chains)
  return {
    amount,
    amountGap,
    cappedByCirculatingSupply,
    escrowBalance: row.side === 'escrow' ? own?.amount : undefined,
    mintedCopy: minted,
    priceUsd,
    valueUsd:
      amount !== undefined && priceUsd !== undefined
        ? amount * priceUsd
        : undefined,
    vaultAsset:
      vault !== undefined && typeof vault !== 'bigint'
        ? {
            ...vault,
            counted: coverage.isCounted(row.projectId, {
              chain: row.chain,
              address: vault.address,
            }),
          }
        : undefined,
  }
}

function readAmount(
  amount: Amount,
  chains: ChainResults,
): { amount: number | undefined; gap: AmountGap | undefined } {
  const chainGap = amount.refs
    .map((ref) => chains.get(ref.chain)?.gap)
    .find((gap) => gap !== undefined)
  const raw = sumAmounts(amount.refs.map((ref) => result(ref, chains)))
  const decimals =
    typeof amount.decimals === 'object'
      ? toNumber(result(amount.decimals, chains))
      : amount.decimals
  if (raw === undefined || decimals === undefined) {
    return { amount: undefined, gap: chainGap ?? 'readFailed' }
  }
  return { amount: Number(raw) / 10 ** decimals, gap: undefined }
}

function result(ref: CallRef, chains: ChainResults) {
  return chains.get(ref.chain)?.results[ref.index]
}

function toNumber(value: ChainCallResult) {
  return typeof value === 'bigint' ? Number(value) : undefined
}

function max(a: number | undefined, b: number | undefined) {
  if (a === undefined) return b
  if (b === undefined) return a
  return Math.max(a, b)
}

function sumAmounts(results: ChainCallResult[]): bigint | undefined {
  const amounts = results.filter(
    (result): result is bigint => typeof result === 'bigint',
  )
  if (amounts.length === 0) return undefined
  return amounts.reduce((sum, amount) => sum + amount, 0n)
}

function isReadable(address: string) {
  return address === 'native' || EVM_ADDRESS.test(address)
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}
