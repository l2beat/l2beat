import type { CoverageResult, CoverageRow, CoverageStatus } from './model'
import { tokenKey } from './model'

export interface VaultAsset {
  address: string
  symbol: string | undefined
}

export type ChainCall =
  | { type: 'totalSupply'; token: string }
  | { type: 'balanceOf'; token: string; holder: string }
  | { type: 'vaultAsset'; token: string }

export type ChainCallResult = bigint | VaultAsset | undefined

export interface ChainReader {
  read(chain: string, calls: ChainCall[]): Promise<ChainCallResult[]>
}

export interface MarketData {
  priceUsd: number | undefined
  circulatingSupply: number | undefined
}

export interface PriceSource {
  getMarketData(coingeckoIds: string[]): Promise<Map<string, MarketData>>
}

export interface RowValue {
  amount: number | undefined
  cappedByCirculatingSupply: boolean
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

interface PendingRow {
  row: CoverageRow
  amountCalls: number[]
  vaultCall: number | undefined
}

export async function estimateValues(
  coverage: CoverageResult,
  reader: ChainReader,
  prices: PriceSource,
): Promise<{ values: Map<string, RowValue>; warnings: string[] }> {
  const rows = coverage.rows.filter(
    (row) => ESTIMATED_STATUSES.has(row.status) && isReadable(row.address),
  )
  const warnings: string[] = []

  const byChain = new Map<string, CoverageRow[]>()
  for (const row of rows) {
    const chainRows = byChain.get(row.chain) ?? []
    chainRows.push(row)
    byChain.set(row.chain, chainRows)
  }

  const [results, marketData] = await Promise.all([
    Promise.all(
      Array.from(byChain, async ([chain, chainRows]) => {
        const calls: ChainCall[] = []
        const pending = chainRows.map((row) => planCalls(row, calls, coverage))
        try {
          const callResults = await reader.read(chain, calls)
          return { pending, callResults }
        } catch (error) {
          warnings.push(`Reading ${chain} failed: ${errorMessage(error)}`)
          return { pending, callResults: calls.map(() => undefined) }
        }
      }),
    ),
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
  for (const { pending, callResults } of results) {
    for (const { row, amountCalls, vaultCall } of pending) {
      const market = row.pricing
        ? marketData.get(row.pricing.coingeckoId)
        : undefined
      values.set(
        rowKey(row),
        toValue(row, amountCalls, vaultCall, callResults, market, coverage),
      )
    }
  }

  return { values, warnings }
}

function planCalls(
  row: CoverageRow,
  calls: ChainCall[],
  coverage: CoverageResult,
): PendingRow {
  const push = (call: ChainCall) => calls.push(call) - 1

  if (row.side === 'escrow') {
    return {
      row,
      amountCalls: coverage
        .escrowAddresses(row.projectId, row.chain)
        .map((holder) =>
          push({ type: 'balanceOf', token: row.address, holder }),
        ),
      vaultCall: undefined,
    }
  }

  if (row.address === 'native') {
    return { row, amountCalls: [], vaultCall: undefined }
  }

  return {
    row,
    amountCalls: [push({ type: 'totalSupply', token: row.address })],
    vaultCall: push({ type: 'vaultAsset', token: row.address }),
  }
}

function toValue(
  row: CoverageRow,
  amountCalls: number[],
  vaultCall: number | undefined,
  results: ChainCallResult[],
  market: MarketData | undefined,
  coverage: CoverageResult,
): RowValue {
  const raw = sumAmounts(amountCalls.map((index) => results[index]))
  const decimals = row.decimals ?? (row.address === 'native' ? 18 : undefined)
  const onchainAmount =
    raw === undefined || decimals === undefined
      ? undefined
      : Number(raw) / 10 ** decimals

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

  const vault = vaultCall === undefined ? undefined : results[vaultCall]
  return {
    amount,
    cappedByCirculatingSupply,
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
