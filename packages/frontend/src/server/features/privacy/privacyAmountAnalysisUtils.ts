import {
  getPrivacyAmountBucket,
  PRIVACY_AMOUNT_BUCKETS,
} from './privacyAmountBuckets'
import { amountToUsd, tryGetPrivacyTokenInfo } from './privacyUtils'

export type PrivacyAmountDirection = 'deposit' | 'withdrawal'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

/**
 * Addresses that are protocol infrastructure (relayers / entrypoint contracts),
 * not distinct end-user entities. They aggregate the activity of many users
 * into a single address, so leaving them in would massively distort the
 * withdrawal distribution. They are excluded from the withdrawal analysis only.
 * All entries must be lowercase.
 */
export const EXCLUDED_RAILGUN_WITHDRAWAL_ADDRESSES = new Set<string>([
  // Railgun Relay Adapter contracts. Unshields are routed to/through these
  // adapters on behalf of many users, so they are not separate entities.
  '0x4025ee6512dbbda97049bcf5aa5d38c54af6be8a',
  '0xac9f360ae85469b27aeddeafc579ef2d052ad405',
])

export const EXCLUDED_PRIVACY_POOLS_WITHDRAWAL_ADDRESSES = new Set<string>([
  // Privacy Pools depositor/entrypoint contract that processes withdrawals on
  // behalf of users, not a distinct end user.
  '0x6818809eefce719e480a7526d76bd3e561526b46',
])

/** Accessor over a single CSV row keyed by column name. */
export type CsvFieldGetter = (column: string) => string | undefined

/**
 * A single normalized, token-resolved contribution to one address' total in a
 * given direction. Produced by the repo before aggregation.
 */
export interface PrivacyAmountRecord {
  /** Lowercased address. */
  address: string
  /** Stable per-token key (the resolved ticker) used for subtotalling. */
  tokenKey: string
  decimals: number
  priceUsd: number | null
  rawAmount: bigint
}

export interface PrivacyAmountAnalysisBucket {
  key: string
  label: string
  minUsd: number | null
  maxUsd: number | null
  count: number
}

export interface PrivacyAmountAnalysisDirectionData {
  addressCount: number
  totalUsd: number
  /** Address counts per log-spaced USD bucket. */
  buckets: PrivacyAmountAnalysisBucket[]
}

/**
 * Converts a decimal-string denomination (e.g. "0.1", "10000") into raw token
 * units using the token decimals, without floating point error.
 */
export function parseDecimalToRaw(decimal: string, decimals: number): bigint {
  const trimmed = decimal.trim()
  const negative = trimmed.startsWith('-')
  const unsigned = negative ? trimmed.slice(1) : trimmed
  const [intPart = '0', fracPart = ''] = unsigned.split('.')

  const fraction = fracPart.slice(0, decimals).padEnd(decimals, '0')
  const combined = `${intPart}${fraction}`.replace(/^0+(?=\d)/, '')
  const value = BigInt(combined === '' ? '0' : combined)
  return negative ? -value : value
}

const BUCKET_PREFIXES = ['privacy-pools-', 'tornado-', 'railgun-']

/**
 * Extracts the ticker segment from a bucket id, accounting for the multi-word
 * `privacy-pools-` prefix. Examples:
 * - `tornado-ETH-0.1` -> `ETH`
 * - `railgun-USDC` -> `USDC`
 * - `privacy-pools-WOETH-0xabc...` -> `WOETH`
 */
export function parseBucketTicker(bucket: string): string | undefined {
  const prefix = BUCKET_PREFIXES.find((p) => bucket.startsWith(p))
  if (!prefix) return undefined
  const segment = bucket.slice(prefix.length).split('-')[0]
  return segment === '' ? undefined : segment
}

/**
 * Parses a Tornado bucket id (`tornado-<TICKER>-<DENOMINATION>`) into its
 * ticker and fixed denomination. The denomination is the source of truth for
 * Tornado deposit/withdrawal amounts.
 */
export function parseTornadoBucket(
  bucket: string,
): { ticker: string; denomination: string } | undefined {
  if (!bucket.startsWith('tornado-')) return undefined
  const parts = bucket.slice('tornado-'.length).split('-')
  if (parts.length < 2) return undefined
  const [ticker, denomination] = parts
  if (!ticker || !denomination) return undefined
  return { ticker, denomination }
}

/**
 * Aggregates normalized records for one (project, direction) into chart-ready
 * data: per-token subtotals are summed in raw units, converted to USD, then
 * summed per address. Addresses with a non-positive total are dropped. The
 * resulting per-address totals are counted into both the log-spaced and the
 * linearly-spaced bucket sets.
 */
export function aggregateAmountRecords(
  records: PrivacyAmountRecord[],
): PrivacyAmountAnalysisDirectionData {
  // address -> tokenKey -> { rawAmount, decimals, priceUsd }
  const perAddress = new Map<
    string,
    Map<
      string,
      { rawAmount: bigint; decimals: number; priceUsd: number | null }
    >
  >()

  for (const record of records) {
    let tokens = perAddress.get(record.address)
    if (!tokens) {
      tokens = new Map()
      perAddress.set(record.address, tokens)
    }
    const existing = tokens.get(record.tokenKey)
    if (existing) {
      existing.rawAmount += record.rawAmount
    } else {
      tokens.set(record.tokenKey, {
        rawAmount: record.rawAmount,
        decimals: record.decimals,
        priceUsd: record.priceUsd,
      })
    }
  }

  const totals: number[] = []
  for (const tokens of perAddress.values()) {
    let totalUsd = 0
    for (const token of tokens.values()) {
      totalUsd += amountToUsd(token.rawAmount, token.decimals, token.priceUsd)
    }
    if (totalUsd > 0) {
      totals.push(totalUsd)
    }
  }

  const bucketCounts = new Map<string, number>()
  for (const total of totals) {
    const bucket = getPrivacyAmountBucket(total)
    if (!bucket) continue
    bucketCounts.set(bucket.key, (bucketCounts.get(bucket.key) ?? 0) + 1)
  }

  return {
    addressCount: totals.length,
    totalUsd: totals.reduce((sum, value) => sum + value, 0),
    buckets: PRIVACY_AMOUNT_BUCKETS.map((bucket) => ({
      key: bucket.key,
      label: bucket.label,
      minUsd: bucket.minUsd,
      maxUsd: bucket.maxUsd,
      count: bucketCounts.get(bucket.key) ?? 0,
    })),
  }
}

export interface PrivacyAmountOverlap {
  depositorCount: number
  withdrawerCount: number
  bothCount: number
  /** Share of withdrawers that are also depositors, expressed as 0-100. */
  withdrawersAlsoDepositorsPct: number
}

/**
 * Counts addresses appearing on both sides (self-mixing): the same address
 * deposited and later withdrew. Addresses are already lowercased in records, so
 * the comparison is case-insensitive.
 */
export function computeAddressOverlap(
  deposits: PrivacyAmountRecord[],
  withdrawals: PrivacyAmountRecord[],
): PrivacyAmountOverlap {
  const depositors = new Set(deposits.map((record) => record.address))
  const withdrawers = new Set(withdrawals.map((record) => record.address))

  let bothCount = 0
  for (const address of withdrawers) {
    if (depositors.has(address)) bothCount++
  }

  return {
    depositorCount: depositors.size,
    withdrawerCount: withdrawers.size,
    bothCount,
    withdrawersAlsoDepositorsPct:
      withdrawers.size === 0 ? 0 : (bothCount / withdrawers.size) * 100,
  }
}

export interface NormalizedAmountRow {
  projectId: string
  direction: PrivacyAmountDirection
  record: PrivacyAmountRecord
}

/** Parses a raw (integer) token amount string, rejecting non-numeric values. */
export function tryParseRawAmount(
  value: string | undefined,
): bigint | undefined {
  if (value === undefined) return undefined
  const trimmed = value.trim()
  if (trimmed === '' || !/^\d+$/.test(trimmed)) return undefined
  return BigInt(trimmed)
}

/**
 * Tornado & Railgun deposits from PrivacyFlowTrxs_with_amounts.csv. Address is
 * the tx sender. Tornado amount is the fixed bucket denomination; Railgun
 * amount is the row's `amount` (no Relay Adapter filtering).
 */
export function normalizeTrxsDepositRow(
  get: CsvFieldGetter,
): NormalizedAmountRow | undefined {
  const protocol = get('protocol')
  const sender = get('sender')
  const bucket = get('bucket')
  const slug = get('token')
  if (!sender || !bucket) return undefined

  if (protocol === 'tornado-cash') {
    const parsed = parseTornadoBucket(bucket)
    if (!parsed) return undefined
    const info = tryGetPrivacyTokenInfo({ ticker: parsed.ticker, slug })
    if (!info) return undefined
    return {
      projectId: 'tornado-cash',
      direction: 'deposit',
      record: {
        address: sender.toLowerCase(),
        tokenKey: info.ticker,
        decimals: info.decimals,
        priceUsd: info.price,
        rawAmount: parseDecimalToRaw(parsed.denomination, info.decimals),
      },
    }
  }

  if (protocol === 'railgun') {
    const info = tryGetPrivacyTokenInfo({
      ticker: parseBucketTicker(bucket),
      slug,
    })
    if (!info) return undefined
    const rawAmount = tryParseRawAmount(get('amount'))
    if (rawAmount === undefined) return undefined
    return {
      projectId: 'railgun',
      direction: 'deposit',
      record: {
        address: sender.toLowerCase(),
        tokenKey: info.ticker,
        decimals: info.decimals,
        priceUsd: info.price,
        rawAmount,
      },
    }
  }

  return undefined
}

/**
 * Tornado withdrawals from tornado_cash_privacy_flow.csv. Amount comes from the
 * fixed bucket denomination (not `amount_raw`). Zero-address rows are dropped.
 */
export function normalizeTornadoWithdrawalRow(
  get: CsvFieldGetter,
): NormalizedAmountRow | undefined {
  const address = get('address')
  const bucket = get('bucket')
  if (!address || !bucket) return undefined
  if (address.toLowerCase() === ZERO_ADDRESS) return undefined

  const parsed = parseTornadoBucket(bucket)
  if (!parsed) return undefined
  const info = tryGetPrivacyTokenInfo({
    address: get('token_address'),
    ticker: parsed.ticker,
    slug: get('token'),
  })
  if (!info) return undefined

  return {
    projectId: 'tornado-cash',
    direction: 'withdrawal',
    record: {
      address: address.toLowerCase(),
      tokenKey: info.ticker,
      decimals: info.decimals,
      priceUsd: info.price,
      rawAmount: parseDecimalToRaw(parsed.denomination, info.decimals),
    },
  }
}

/**
 * Railgun withdrawals from railgun_privacy_flow.csv. Amount from `amount_raw`.
 */
export function normalizeRailgunWithdrawalRow(
  get: CsvFieldGetter,
): NormalizedAmountRow | undefined {
  const address = get('address')
  const bucket = get('bucket')
  if (!address) return undefined
  // Skip Railgun Relay Adapter contracts (see exclusion set above).
  if (EXCLUDED_RAILGUN_WITHDRAWAL_ADDRESSES.has(address.toLowerCase())) {
    return undefined
  }

  const info = tryGetPrivacyTokenInfo({
    address: get('token_address'),
    ticker: bucket ? parseBucketTicker(bucket) : undefined,
    slug: get('token'),
  })
  if (!info) return undefined
  const rawAmount = tryParseRawAmount(get('amount_raw'))
  if (rawAmount === undefined) return undefined

  return {
    projectId: 'railgun',
    direction: 'withdrawal',
    record: {
      address: address.toLowerCase(),
      tokenKey: info.ticker,
      decimals: info.decimals,
      priceUsd: info.price,
      rawAmount,
    },
  }
}

/**
 * Privacy Pools deposits & withdrawals from privacy_pools_privacy_flow.csv.
 * Ragequits are already normalized to `action === "withdrawal"` in the CSV.
 */
export function normalizePrivacyPoolsRow(
  get: CsvFieldGetter,
): NormalizedAmountRow | undefined {
  const address = get('address')
  const action = get('action')
  const bucket = get('bucket')
  if (!address) return undefined
  if (action !== 'deposit' && action !== 'withdrawal') return undefined
  // Skip the Privacy Pools entrypoint/depositor contract on withdrawals (see
  // exclusion set above); it processes withdrawals for users, not a real entity.
  if (
    action === 'withdrawal' &&
    EXCLUDED_PRIVACY_POOLS_WITHDRAWAL_ADDRESSES.has(address.toLowerCase())
  ) {
    return undefined
  }

  const info = tryGetPrivacyTokenInfo({
    address: get('token_address'),
    ticker: bucket ? parseBucketTicker(bucket) : undefined,
    slug: get('token'),
  })
  if (!info) return undefined
  const rawAmount = tryParseRawAmount(get('amount_raw'))
  if (rawAmount === undefined) return undefined

  return {
    projectId: 'privacy-pools',
    direction: action,
    record: {
      address: address.toLowerCase(),
      tokenKey: info.ticker,
      decimals: info.decimals,
      priceUsd: info.price,
      rawAmount,
    },
  }
}
