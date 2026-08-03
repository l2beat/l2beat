/**
 * Computes the "anonymity set vs. holding duration" curves rendered by the
 * Anonymity sets section on the privacy project pages.
 *
 * For every holding duration `x` between 7 and 365 days, a curve value is the
 * number of unique addresses that made a qualifying deposit in the trailing
 * window `[NOW - x days, NOW]`. This is the same metric as
 * `computeAnonymitySets.ts` (see that file for the full list of caveats),
 * generalized from the fixed 30 day window to an arbitrary one: if you deposit
 * and withdraw within `x` days, the depositors of that window are the crowd you
 * blend into.
 *
 * Every protocol gets three curves at the 0.1 / 1 / 10 ETH scale, so the charts
 * can be read against each other:
 * - Tornado Cash has fixed denominations, so a curve is one ETH pool.
 * - Railgun and Privacy Pools take arbitrary amounts, so a curve counts
 *   addresses that deposited *at least* that much WETH/ETH - the same "at
 *   least" filter `computeAnonymitySets.ts` applies at 0.1.
 *
 * ASSUMPTIONS / SHORTCUTS specific to this script (on top of the ones listed in
 * `computeAnonymitySets.ts`, all of which still apply):
 *
 * 1. `NOW` is pinned to 2026-07-29, the date the input CSVs were exported.
 *    The data does not grow on its own, so a moving `now` would silently
 *    truncate the most recent window.
 *
 * 2. The input data has block numbers but no timestamps. Instead of resolving a
 *    cutoff block per data point (~360 binary searches), this script fetches
 *    real timestamps for ~60 evenly spaced anchor blocks and linearly
 *    interpolates between them. Post-merge block times are stable enough that
 *    the error inside a ~7 day anchor gap stays well under an hour, which is
 *    invisible at day granularity. As a consequence the 30 day values here can
 *    differ by a few addresses from `anonymity_sets.json`, which used an exact
 *    cutoff block.
 *
 * 3. The metric is backward looking and deposit-side only: it counts deposits
 *    that already happened before `NOW`, including from addresses that have
 *    since withdrawn. A depositor's real anonymity also depends on deposits
 *    arriving after theirs, which is not observable here.
 *
 * 4. Non-ETH denominated activity is ignored everywhere. Railgun's and Privacy
 *    Pools' stablecoin pools are not scanned, so these curves describe the ETH
 *    slice of each protocol, not the protocol as a whole.
 */

import dotenv from 'dotenv'
import { providers } from 'ethers'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

dotenv.config()

const DATA_DIR =
  process.env.PRIVACY_DASHBOARD_DATA_DIR ??
  join(
    __dirname,
    '../../../../l2beat-privacy-dashboard-prototype/packages/frontend/data',
  )

const TRXS_WITH_AMOUNTS_FILE = join(
  DATA_DIR,
  'PrivacyFlowTrxs_with_amounts.csv',
)
const PRIVACY_POOLS_FILE = join(DATA_DIR, 'privacy_pools_privacy_flow.csv')

const OUTPUT_FILE = join(
  __dirname,
  '../../frontend/src/server/features/privacy/anonymitySetCurves.json',
)

/** Export date of the input CSVs - see assumption #1. */
const NOW_ISO = '2026-07-29T00:00:00.000Z'
const NOW_SECONDS = Math.floor(new Date(NOW_ISO).getTime() / 1000)

const MIN_DAYS = 7
const MAX_DAYS = 365
const DAY_SECONDS = 24 * 60 * 60
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

/** ~7 days of Ethereum blocks at 12s per block. */
const ANCHOR_STEP_BLOCKS = 50_400
/** Enough anchors to reach ~400 days back, leaving margin over MAX_DAYS. */
const ANCHOR_COUNT = 58

const ETHER = 10n ** 18n

/** The 0.1 / 1 / 10 ETH scale shared by every protocol. */
const TIERS = [
  { suffix: '0.1', minimumRaw: ETHER / 10n },
  { suffix: '1', minimumRaw: ETHER },
  { suffix: '10', minimumRaw: ETHER * 10n },
]

/** A single line on the chart. */
interface Series {
  id: string
  label: string
}

/** A qualifying deposit, already assigned to the series it belongs to. */
interface Entry {
  seriesId: string
  blockNum: number
  sender: string
}

interface Anchor {
  blockNumber: number
  timestamp: number
}

interface TrxRow {
  protocol: string
  bucket: string
  blockNum: number
  sender: string
  amountRaw: bigint
}

interface PrivacyPoolsRow {
  action: string
  address: string
  amountRaw: bigint
  token: string
  blockNumber: number
}

function getEthereumRpcUrl(): string {
  const rpcUrl = process.env.ETHEREUM_RPC_URL
  if (!rpcUrl) {
    throw new Error('ETHEREUM_RPC_URL not found in environment/.env file')
  }
  return rpcUrl
}

// `PrivacyFlowTrxs_with_amounts.csv` has no header row - the column order
// (id, protocol, bucket, block_num, tx_hash, sender, amount, token) is
// hardcoded, see `computeAnonymitySets.ts` assumption #2.
function parseTrxsWithAmounts(path: string): TrxRow[] {
  const lines = readFileSync(path, 'utf-8').split('\n')
  const rows: TrxRow[] = []
  for (const line of lines) {
    if (!line) continue
    const [, protocol, bucket, blockNum, , sender, amount] = line.split(',')
    if (!protocol || !bucket || !blockNum || !sender || !amount) continue
    const lowercasedSender = sender.toLowerCase()
    if (lowercasedSender === ZERO_ADDRESS) continue

    rows.push({
      protocol,
      bucket,
      blockNum: Number(blockNum),
      sender: lowercasedSender,
      amountRaw: BigInt(amount),
    })
  }
  return rows
}

function parsePrivacyPoolsCsv(path: string): PrivacyPoolsRow[] {
  const lines = readFileSync(path, 'utf-8').split('\n').filter(Boolean)
  const [, ...dataLines] = lines // first line is a header
  const rows: PrivacyPoolsRow[] = []
  for (const line of dataLines) {
    const [, action, , address, amountRaw, token, , blockNumber] =
      line.split(',')
    if (!action || !address || !amountRaw || !blockNumber) continue
    const lowercasedAddress = address.toLowerCase()
    if (lowercasedAddress === ZERO_ADDRESS) continue

    rows.push({
      action,
      address: lowercasedAddress,
      amountRaw: BigInt(amountRaw),
      token: token ?? '',
      blockNumber: Number(blockNumber),
    })
  }
  return rows
}

/** Tornado Cash: one curve per fixed ETH denomination. */
function tornadoCash(rows: TrxRow[]) {
  const series = TIERS.map((tier) => ({
    id: `tornado-ETH-${tier.suffix}`,
    label: `${tier.suffix} ETH`,
  }))
  const seriesIds = new Set(series.map((s) => s.id))

  const entries: Entry[] = []
  for (const row of rows) {
    if (row.protocol !== 'tornado-cash') continue
    if (!seriesIds.has(row.bucket)) continue
    entries.push({
      seriesId: row.bucket,
      blockNum: row.blockNum,
      sender: row.sender,
    })
  }

  return {
    slug: 'tornado-cash',
    description:
      'Each line is one of the fixed-denomination ETH pools, counting the addresses that deposited into it.',
    series,
    entries,
  }
}

/** Railgun: one curve per minimum WETH deposit size. */
function railgun(rows: TrxRow[]) {
  return fromThresholds({
    slug: 'railgun',
    symbol: 'WETH',
    description:
      'Railgun deposits are arbitrary amounts, so each line counts the addresses that deposited at least that much WETH.',
    deposits: rows
      .filter(
        (row) => row.protocol === 'railgun' && row.bucket === 'railgun-WETH',
      )
      .map((row) => ({
        blockNum: row.blockNum,
        sender: row.sender,
        amountRaw: row.amountRaw,
      })),
  })
}

/** Privacy Pools: one curve per minimum ETH deposit size. */
function privacyPools(rows: PrivacyPoolsRow[]) {
  return fromThresholds({
    slug: 'privacy-pools',
    symbol: 'ETH',
    description:
      'Privacy Pools deposits are arbitrary amounts, so each line counts the addresses that deposited at least that much ETH.',
    deposits: rows
      .filter((row) => row.action === 'deposit' && row.token === 'ethereum')
      .map((row) => ({
        blockNum: row.blockNumber,
        sender: row.address,
        amountRaw: row.amountRaw,
      })),
  })
}

/**
 * Turns arbitrary-amount deposits into one series per tier. Tiers are minimums,
 * not ranges: a 10 ETH deposit also covers someone hiding 0.1 ETH.
 */
function fromThresholds({
  slug,
  symbol,
  description,
  deposits,
}: {
  slug: string
  symbol: string
  description: string
  deposits: { blockNum: number; sender: string; amountRaw: bigint }[]
}) {
  const series = TIERS.map((tier) => ({
    id: `${slug}-min-${tier.suffix}`,
    label: `≥ ${tier.suffix} ${symbol}`,
  }))

  const entries: Entry[] = []
  for (const deposit of deposits) {
    TIERS.forEach((tier, index) => {
      const seriesId = series[index]?.id
      if (!seriesId) return
      if (deposit.amountRaw < tier.minimumRaw) return
      entries.push({
        seriesId,
        blockNum: deposit.blockNum,
        sender: deposit.sender,
      })
    })
  }

  return { slug, description, series, entries }
}

// Evenly spaced (block, timestamp) pairs, newest first - see assumption #2.
async function fetchAnchors(
  provider: providers.JsonRpcProvider,
  latestBlockNumber: number,
): Promise<Anchor[]> {
  const anchors: Anchor[] = []
  for (let i = 0; i < ANCHOR_COUNT; i++) {
    const blockNumber = latestBlockNumber - i * ANCHOR_STEP_BLOCKS
    if (blockNumber < 0) break
    const block = await provider.getBlock(blockNumber)
    anchors.push({ blockNumber, timestamp: block.timestamp })
  }
  return anchors
}

/**
 * Timestamp of a block, linearly interpolated between the two surrounding
 * anchors. Returns undefined for blocks older than the oldest anchor - those
 * are always outside the MAX_DAYS window anyway.
 */
function interpolateTimestamp(
  anchors: Anchor[],
  blockNumber: number,
): number | undefined {
  const newest = anchors[0]
  const oldest = anchors[anchors.length - 1]
  if (!newest || !oldest) return undefined
  if (blockNumber < oldest.blockNumber) return undefined
  if (blockNumber >= newest.blockNumber) return newest.timestamp

  // Anchors are evenly spaced in block space, so the index is a direct lookup.
  const index = Math.floor(
    (newest.blockNumber - blockNumber) / ANCHOR_STEP_BLOCKS,
  )
  const upper = anchors[index]
  const lower = anchors[index + 1]
  if (!upper || !lower) return undefined

  const blockSpan = upper.blockNumber - lower.blockNumber
  const progress = (blockNumber - lower.blockNumber) / blockSpan
  return lower.timestamp + progress * (upper.timestamp - lower.timestamp)
}

/**
 * For each series, the number of unique depositors in the trailing window of
 * `days` days, for every `days` between MIN_DAYS and MAX_DAYS.
 */
function computeCurves(entries: Entry[], series: Series[], anchors: Anchor[]) {
  const bySeries = new Map<string, Map<number, string[]>>()
  for (const s of series) {
    bySeries.set(s.id, new Map())
  }

  for (const entry of entries) {
    const timestamp = interpolateTimestamp(anchors, entry.blockNum)
    if (timestamp === undefined || timestamp > NOW_SECONDS) continue
    // How many days you would have had to hold for this deposit to still be
    // inside your window. Everything at or below MIN_DAYS lands in the first
    // data point.
    const daysAgo = Math.max(
      MIN_DAYS,
      Math.ceil((NOW_SECONDS - timestamp) / DAY_SECONDS),
    )
    if (daysAgo > MAX_DAYS) continue

    const byDay = bySeries.get(entry.seriesId)
    if (!byDay) continue
    const senders = byDay.get(daysAgo) ?? []
    senders.push(entry.sender)
    byDay.set(daysAgo, senders)
  }

  // Windows are nested, so sweeping from MIN_DAYS to MAX_DAYS lets a single
  // running set of addresses produce every point.
  const curves = new Map<string, number[]>()
  for (const s of series) {
    const byDay = bySeries.get(s.id)
    const seen = new Set<string>()
    const sizes: number[] = []
    for (let days = MIN_DAYS; days <= MAX_DAYS; days++) {
      for (const sender of byDay?.get(days) ?? []) {
        seen.add(sender)
      }
      sizes.push(seen.size)
    }
    curves.set(s.id, sizes)
  }

  return curves
}

async function main() {
  const provider = new providers.JsonRpcProvider(getEthereumRpcUrl())
  const latestBlockNumber = await provider.getBlockNumber()
  const anchors = await fetchAnchors(provider, latestBlockNumber)

  const trxRows = parseTrxsWithAmounts(TRXS_WITH_AMOUNTS_FILE)
  const privacyPoolsRows = parsePrivacyPoolsCsv(PRIVACY_POOLS_FILE)

  const projects = [
    tornadoCash(trxRows),
    railgun(trxRows),
    privacyPools(privacyPoolsRows),
  ]

  const output: Record<string, unknown> = {}
  for (const project of projects) {
    const curves = computeCurves(project.entries, project.series, anchors)

    const points: number[][] = []
    for (let days = MIN_DAYS; days <= MAX_DAYS; days++) {
      const index = days - MIN_DAYS
      points.push([
        days,
        ...project.series.map((s) => curves.get(s.id)?.[index] ?? 0),
      ])
    }

    output[project.slug] = {
      description: project.description,
      buckets: project.series,
      points,
    }

    const at = (days: number) =>
      project.series
        .map((s) => `${s.label}: ${curves.get(s.id)?.[days - MIN_DAYS]}`)
        .join(', ')

    console.log(`\n${project.slug} (${project.entries.length} deposits)`)
    console.log(`    7 days -> ${at(7)}`)
    console.log(`   30 days -> ${at(30)}`)
    console.log(`  365 days -> ${at(365)}`)
  }

  const result = {
    generatedAt: new Date().toISOString(),
    asOf: NOW_ISO,
    minDays: MIN_DAYS,
    maxDays: MAX_DAYS,
    projects: output,
  }

  writeFileSync(OUTPUT_FILE, `${JSON.stringify(result, null, 2)}\n`)

  console.log(
    `\nAnchors: ${anchors.length}, latest block: ${latestBlockNumber}`,
  )
  console.log(`Wrote ${OUTPUT_FILE}`)
  console.log('Run `biome format --write` on it before committing.')
}

main().catch((e: unknown) => {
  console.error(e)
  process.exit(1)
})
