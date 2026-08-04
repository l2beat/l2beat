/**
 * Computes the two charts rendered by the Anonymity sets section on the privacy
 * project pages. Both count the same thing - unique qualifying depositors in a
 * trailing window - and differ only in which end of the window moves.
 *
 * CURVES ("anonymity set vs. holding duration"). For every holding duration `x`
 * between 7 and 365 days, a curve value is the number of unique addresses that
 * made a qualifying deposit in the trailing window `[NOW - x days, NOW]`. This
 * is the same metric as `computeAnonymitySets.ts` (see that file for the full
 * list of caveats), generalized from the fixed 30 day window to an arbitrary
 * one: if you deposit and withdraw within `x` days, the depositors of that
 * window are the crowd you blend into.
 *
 * HISTORY ("trailing 30 day anonymity set over time"). The window length is
 * pinned back to 30 days and its end slides across the last HISTORY_DAYS days:
 * the value at date `d` is the number of unique addresses that deposited in the
 * 30 calendar days ending on `d`. It answers "how much of a crowd would I have
 * had, had I withdrawn on this day after holding for up to a month", and shows
 * whether a pool's anonymity is growing, flat or collapsing. The last point of
 * the history equals the 30 day point of the curve by construction.
 *
 * What counts as "qualifying" depends on how the protocol accepts deposits:
 * - Tornado Cash has fixed denominations, so every tracked pool is one curve.
 * - Railgun and Privacy Pools take arbitrary amounts, so every tracked token
 *   gets two curves at "at least 0.1 ETH worth" and "at least 10 ETH worth" -
 *   the same "at least" filter `computeAnonymitySets.ts` applies at 0.1, at two
 *   sizes that line up with Tornado's ladder.
 *
 * ASSUMPTIONS / SHORTCUTS specific to this script (on top of the ones listed in
 * `computeAnonymitySets.ts`, all of which still apply):
 *
 * 1. `NOW` is pinned to 2026-07-29, the date the input CSVs were exported.
 *    The data does not grow on its own, so a moving `now` would silently
 *    truncate the most recent window.
 *
 * 2. The input data has block numbers but no timestamps. Instead of resolving a
 *    cutoff block per data point (~360 binary searches), it linearly
 *    interpolates between the ~60 evenly spaced anchor blocks in BLOCK_ANCHORS,
 *    whose real timestamps are frozen below. Post-merge block times are stable
 *    enough that
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
 * 4. The ETH-equivalent thresholds are priced with the frozen PRICES_USD table
 *    below and rounded to one significant digit, then applied to the whole year
 *    of history. A token that moved sharply against ETH during the window
 *    therefore gets a threshold that was worth more or less than 0.1/10 ETH at
 *    the time of the older deposits. The tiers are meant as order-of-magnitude
 *    buckets, not exact valuations. Prices used are recorded in the output.
 *
 * 5. Tracked buckets with no deposits at all in the source CSVs still produce a
 *    (flat zero) curve, and the script prints a coverage report so gaps between
 *    what the config tracks and what the snapshot contains stay visible.
 *
 * 5b. The history buckets deposits by UTC calendar day, so its oldest point
 *    needs data from `HISTORY_DAYS + HISTORY_WINDOW_DAYS` days before `NOW` -
 *    further back than the curves ever reach. BLOCK_ANCHORS is sized for that
 *    longer reach, and the script asserts the coverage rather than silently
 *    dropping the deposits that fall off the end.
 *
 * 6. The script makes no network calls. Block timestamps and token prices are
 *    frozen tables captured once (see each table for provenance), because the
 *    input CSVs are a frozen snapshot: reading live prices or a live chain tip
 *    would silently change every curve on a re-run without any new data. To
 *    refresh them you need a new CSV export anyway.
 */

import dotenv from 'dotenv'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { privacyPools } from '../src/projects/privacy-pools/privacy-pools'
import { railgun } from '../src/projects/railgun/railgun'
import { tornadoCash } from '../src/projects/tornado-cash/tornado-cash'

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

/** Days of history the sliding-window chart covers, ending on `NOW`. */
const HISTORY_DAYS = 365
/** Length of the window whose end slides across those days. */
const HISTORY_WINDOW_DAYS = 30

/** ~7 days of Ethereum blocks at 12s per block. */
const ANCHOR_STEP_BLOCKS = 50_400

/**
 * `[blockNumber, unixTimestamp]` pairs used to date a deposit - see assumptions
 * #2 and #6. Evenly spaced by ANCHOR_STEP_BLOCKS and newest first, starting at
 * the highest block present in the CSV snapshots and reaching ~440 days back -
 * comfortably past both MAX_DAYS and the longer reach the history needs (see
 * assumption #5b), which `assertAnchorReach` checks on every run.
 *
 * Captured once from an Ethereum RPC node on 2026-08-04. Block timestamps are
 * immutable, so these never need refreshing unless the CSV snapshot is
 * re-exported with newer blocks - in which case re-capture from the new highest
 * block, stepping back by ANCHOR_STEP_BLOCKS.
 */
const BLOCK_ANCHORS: [block: number, timestamp: number][] = [
  [25638016, 1785322403],
  [25587616, 1784715359],
  [25537216, 1784108399],
  [25486816, 1783501247],
  [25436416, 1782893843],
  [25386016, 1782286499],
  [25335616, 1781679419],
  [25285216, 1781072435],
  [25234816, 1780465019],
  [25184416, 1779857711],
  [25134016, 1779250847],
  [25083616, 1778644007],
  [25033216, 1778037191],
  [24982816, 1777430471],
  [24932416, 1776824135],
  [24882016, 1776217667],
  [24831616, 1775610755],
  [24781216, 1775003879],
  [24730816, 1774396511],
  [24680416, 1773789203],
  [24630016, 1773181307],
  [24579616, 1772573291],
  [24529216, 1771965695],
  [24478816, 1771358591],
  [24428416, 1770751163],
  [24378016, 1770142067],
  [24327616, 1769534327],
  [24277216, 1768926863],
  [24226816, 1768319711],
  [24176416, 1767711923],
  [24126016, 1767104567],
  [24075616, 1766496563],
  [24025216, 1765888679],
  [23974816, 1765278407],
  [23924416, 1764661979],
  [23874016, 1764051839],
  [23823616, 1763439923],
  [23773216, 1762830479],
  [23722816, 1762221407],
  [23672416, 1761612083],
  [23622016, 1761002123],
  [23571616, 1760392655],
  [23521216, 1759783775],
  [23470816, 1759175051],
  [23420416, 1758566435],
  [23370016, 1757957903],
  [23319616, 1757349503],
  [23269216, 1756740947],
  [23218816, 1756133267],
  [23168416, 1755525827],
  [23118016, 1754917823],
  [23067616, 1754309483],
  [23017216, 1753700519],
  [22966816, 1753091855],
  [22916416, 1752483995],
  [22866016, 1751875571],
  [22815616, 1751267027],
  [22765216, 1750658567],
  [22714816, 1750049483],
  [22664416, 1749440651],
  [22614016, 1748831279],
  [22563616, 1748221871],
  [22513216, 1747611743],
  [22462816, 1746999587],
]

/**
 * Spot prices in USD, used only to size the ETH-equivalent tiers - see
 * assumptions #4 and #6. Keyed by the Coingecko id the l2beat config assigns to
 * each token.
 *
 * Captured once on 2026-08-04. Thresholds are rounded to one significant digit,
 * so these only need updating if a price moves far enough to change that digit.
 * A tracked token missing from this table is skipped with a warning.
 */
const PRICES_USD: Record<string, number> = {
  ethereum: 1869.07,
  tether: 0.999123,
  'usd-coin': 0.999545,
  usds: 0.999906,
  'wrapped-steth': 2320.26,
  'wrapped-bitcoin': 63848,
  susds: 1.11,
  dai: 0.999895,
  weth: 1869.9,
  'usd1-wlfi': 0.999246,
  'ethena-usde': 0.999472,
  'frax-usd': 0.999773,
  instadapp: 1.26,
  railgun: 1.48,
  'f-x-protocol-fxusd': 0.999956,
  'liquity-bold-2': 1.001,
  'wrapped-oeth': 2167.75,
  'rainbow-bridged-near-ethereum': 1.75,
}

/** The two ETH-equivalent sizes every arbitrary-amount token is measured at. */
const ETH_TIERS = [0.1, 10]
const ETH_PRICE_ID = 'ethereum'

/** A single line on the chart. */
interface Series {
  id: string
  label: string
  /** Token symbol - the frontend colors one hue per family. */
  family: string
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
  bucket: string
  address: string
  amountRaw: bigint
  blockNumber: number
}

/** A deposit stripped down to what every protocol has in common. */
interface Deposit {
  bucket: string
  blockNum: number
  sender: string
  amountRaw: bigint
}

interface TokenSpec {
  symbol: string
  decimals: number
  priceId: string
  buckets: { id: string; denomination: string | undefined }[]
}

/** The tokens and buckets the l2beat config actually tracks for a project. */
function getTrackedTokens(project: {
  privacyInfo?: {
    tokens: {
      token: { symbol: string; decimals: number; priceId?: string }
      buckets: { id: string; denomination?: string }[]
    }[]
  }
}): TokenSpec[] {
  return (project.privacyInfo?.tokens ?? []).map((token) => ({
    symbol: token.token.symbol,
    decimals: token.token.decimals,
    priceId: token.token.priceId ?? '',
    buckets: token.buckets.map((bucket) => ({
      id: bucket.id,
      denomination: bucket.denomination,
    })),
  }))
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
    const [, action, bucket, address, amountRaw, , , blockNumber] =
      line.split(',')
    if (!action || !bucket || !address || !amountRaw || !blockNumber) continue
    const lowercasedAddress = address.toLowerCase()
    if (lowercasedAddress === ZERO_ADDRESS) continue

    rows.push({
      action,
      bucket,
      address: lowercasedAddress,
      amountRaw: BigInt(amountRaw),
      blockNumber: Number(blockNumber),
    })
  }
  return rows
}

/** One curve per fixed-denomination pool. */
function fromDenominations(deposits: Deposit[], tokens: TokenSpec[]) {
  const series: Series[] = []
  const entries: Entry[] = []

  const byBucket = new Map<string, Deposit[]>()
  for (const deposit of deposits) {
    const existing = byBucket.get(deposit.bucket) ?? []
    existing.push(deposit)
    byBucket.set(deposit.bucket, existing)
  }

  for (const token of sortByActivity(tokens, byBucket)) {
    for (const bucket of token.buckets) {
      series.push({
        id: bucket.id,
        label: `${bucket.denomination ?? '?'} ${token.symbol}`,
        family: token.symbol,
      })
      for (const deposit of byBucket.get(bucket.id) ?? []) {
        entries.push({
          seriesId: bucket.id,
          blockNum: deposit.blockNum,
          sender: deposit.sender,
        })
      }
    }
  }

  return { series, entries }
}

/**
 * Two curves per token, at "at least 0.1 ETH worth" and "at least 10 ETH
 * worth". Tiers are minimums, not ranges: a 10 ETH deposit also covers someone
 * hiding 0.1 ETH.
 */
function fromEthEquivalentTiers(
  deposits: Deposit[],
  tokens: TokenSpec[],
  prices: Map<string, number>,
) {
  const series: Series[] = []
  const entries: Entry[] = []
  const thresholds: Record<string, string> = {}

  const byBucket = new Map<string, Deposit[]>()
  for (const deposit of deposits) {
    const existing = byBucket.get(deposit.bucket) ?? []
    existing.push(deposit)
    byBucket.set(deposit.bucket, existing)
  }

  const ethPrice = prices.get(ETH_PRICE_ID)
  if (!ethPrice) throw new Error('Missing ETH price')

  for (const token of sortByActivity(tokens, byBucket)) {
    const price = prices.get(token.priceId)
    if (!price) {
      console.warn(
        `  ! no price for ${token.symbol} (${token.priceId}), skipped`,
      )
      continue
    }

    for (const ethTier of ETH_TIERS) {
      const amount = roundToOneSignificantDigit((ethTier * ethPrice) / price)
      const minimumRaw = toRawAmount(amount, token.decimals)
      const id = `${token.symbol}-min-${ethTier}eth`

      series.push({
        id,
        label: `≥ ${formatAmount(amount)} ${token.symbol}`,
        family: token.symbol,
      })
      thresholds[id] =
        `${formatAmount(amount)} ${token.symbol} ≈ ${ethTier} ETH`

      for (const bucket of token.buckets) {
        for (const deposit of byBucket.get(bucket.id) ?? []) {
          if (deposit.amountRaw < minimumRaw) continue
          entries.push({
            seriesId: id,
            blockNum: deposit.blockNum,
            sender: deposit.sender,
          })
        }
      }
    }
  }

  return { series, entries, thresholds }
}

/** Busiest tokens first, so the chart hands its strongest hues to real data. */
function sortByActivity(tokens: TokenSpec[], byBucket: Map<string, Deposit[]>) {
  const depositCount = (token: TokenSpec) =>
    token.buckets.reduce(
      (sum, bucket) => sum + (byBucket.get(bucket.id)?.length ?? 0),
      0,
    )
  return [...tokens].sort((a, b) => depositCount(b) - depositCount(a))
}

function roundToOneSignificantDigit(value: number): number {
  if (value === 0) return 0
  // toPrecision keeps the result free of binary float noise, so a threshold
  // comes out as 0.3 rather than 0.30000000000000004.
  return Number(value.toPrecision(1))
}

function toRawAmount(amount: number, decimals: number): bigint {
  // Amounts are already rounded to one significant digit, so a string round
  // trip avoids float noise in the raw integer.
  const [whole, fraction = ''] = amount.toFixed(decimals).split('.')
  return BigInt(`${whole}${fraction.padEnd(decimals, '0')}`)
}

function formatAmount(amount: number): string {
  return amount >= 1 ? amount.toLocaleString('en-US') : amount.toString()
}

// Evenly spaced (block, timestamp) pairs, newest first - see assumption #2.
function getAnchors(): Anchor[] {
  return BLOCK_ANCHORS.map(([blockNumber, timestamp]) => ({
    blockNumber,
    timestamp,
  }))
}

function getPrices(): Map<string, number> {
  return new Map(Object.entries(PRICES_USD))
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

/**
 * For each series, the number of unique depositors in the HISTORY_WINDOW_DAYS
 * long window ending at each of the last HISTORY_DAYS daily timestamps.
 *
 * A point sits at UTC midnight of its day and looks strictly backwards, exactly
 * like `computeCurves` does at `NOW`: the point at day `d` covers the
 * HISTORY_WINDOW_DAYS whole days `[d - 30, d - 1]`, the ones that had already
 * finished when the window closed. Anchoring both to an instant rather than to
 * a calendar day is what makes the last history point equal the 30 day point of
 * the curve.
 */
function computeHistory(entries: Entry[], series: Series[], anchors: Anchor[]) {
  const lastDay = Math.floor(NOW_SECONDS / DAY_SECONDS)
  const firstDay = lastDay - (HISTORY_DAYS - 1)
  // The oldest window reaches back past the oldest point it produces.
  const oldestDay = firstDay - HISTORY_WINDOW_DAYS

  const bySeries = new Map<string, Map<number, string[]>>()
  for (const s of series) {
    bySeries.set(s.id, new Map())
  }

  for (const entry of entries) {
    const timestamp = interpolateTimestamp(anchors, entry.blockNum)
    if (timestamp === undefined || timestamp > NOW_SECONDS) continue
    const day = Math.floor(timestamp / DAY_SECONDS)
    if (day < oldestDay || day > lastDay) continue

    const byDay = bySeries.get(entry.seriesId)
    if (!byDay) continue
    const senders = byDay.get(day) ?? []
    senders.push(entry.sender)
    byDay.set(day, senders)
  }

  // Consecutive windows overlap in all but two days, so one multiset of
  // addresses is carried across the sweep, adding the day that enters the
  // window and dropping the one that leaves it. Its size is the answer.
  const histories = new Map<string, number[]>()
  for (const s of series) {
    const byDay = bySeries.get(s.id)
    const counts = new Map<string, number>()

    const add = (day: number) => {
      for (const sender of byDay?.get(day) ?? []) {
        counts.set(sender, (counts.get(sender) ?? 0) + 1)
      }
    }
    const remove = (day: number) => {
      for (const sender of byDay?.get(day) ?? []) {
        const count = (counts.get(sender) ?? 0) - 1
        if (count > 0) counts.set(sender, count)
        else counts.delete(sender)
      }
    }

    // Seed the window of the first point: days [firstDay - 30, firstDay - 1].
    for (let day = oldestDay; day < firstDay; day++) add(day)

    const sizes = [counts.size]
    for (let day = firstDay + 1; day <= lastDay; day++) {
      add(day - 1)
      remove(day - 1 - HISTORY_WINDOW_DAYS)
      sizes.push(counts.size)
    }

    histories.set(s.id, sizes)
  }

  return { histories, firstDay, lastDay }
}

/**
 * The anchors must reach back past the oldest day any chart looks at, or
 * `interpolateTimestamp` silently drops deposits and the oldest points come out
 * too low. Cheaper to fail loudly here than to notice a sagging tail on the
 * chart.
 */
function assertAnchorReach(anchors: Anchor[]) {
  const oldest = anchors[anchors.length - 1]
  if (!oldest) throw new Error('No block anchors')

  const neededDays = Math.max(MAX_DAYS, HISTORY_DAYS + HISTORY_WINDOW_DAYS)
  const needed = NOW_SECONDS - neededDays * DAY_SECONDS
  if (oldest.timestamp > needed) {
    throw new Error(
      `BLOCK_ANCHORS only reach ${new Date(oldest.timestamp * 1000).toISOString()}, ` +
        `but the charts need ${neededDays} days of history back to ${new Date(needed * 1000).toISOString()}. ` +
        'Extend the table by stepping further back from its oldest block.',
    )
  }
}

/** Where the config and the CSV snapshot disagree about what exists. */
function reportCoverage(
  tokens: TokenSpec[],
  deposits: Deposit[],
  matchesBucket: (csvBucket: string, trackedId: string) => boolean,
) {
  const trackedIds = tokens.flatMap((token) =>
    token.buckets.map((bucket) => bucket.id),
  )
  const csvBuckets = new Set(deposits.map((deposit) => deposit.bucket))

  const empty = trackedIds.filter(
    (id) => ![...csvBuckets].some((csv) => matchesBucket(csv, id)),
  )
  const untracked = [...csvBuckets].filter(
    (csv) => !trackedIds.some((id) => matchesBucket(csv, id)),
  )

  if (empty.length > 0) {
    console.log(`  tracked but absent from snapshot: ${empty.join(', ')}`)
  }
  if (untracked.length > 0) {
    console.log(`  in snapshot but not tracked: ${untracked.join(', ')}`)
  }
  if (empty.length === 0 && untracked.length === 0) {
    console.log('  snapshot and config agree on every bucket')
  }
}

function main() {
  const tornadoTokens = getTrackedTokens(tornadoCash)
  const railgunTokens = getTrackedTokens(railgun)
  const privacyPoolsTokens = getTrackedTokens(privacyPools)

  const prices = getPrices()
  const anchors = getAnchors()
  assertAnchorReach(anchors)

  const trxRows = parseTrxsWithAmounts(TRXS_WITH_AMOUNTS_FILE)
  const ppRows = parsePrivacyPoolsCsv(PRIVACY_POOLS_FILE)

  const toDeposit = (row: TrxRow): Deposit => ({
    bucket: row.bucket,
    blockNum: row.blockNum,
    sender: row.sender,
    amountRaw: row.amountRaw,
  })

  const tornadoDeposits = trxRows
    .filter((row) => row.protocol === 'tornado-cash')
    .map(toDeposit)
  const railgunDeposits = trxRows
    .filter((row) => row.protocol === 'railgun')
    .map(toDeposit)
  // Privacy Pools bucket ids in the CSV carry a pool address suffix that the
  // config ids do not have, so they are matched by prefix.
  const ppDeposits = ppRows
    .filter((row) => row.action === 'deposit')
    .map((row) => ({
      bucket: row.bucket,
      blockNum: row.blockNumber,
      sender: row.address,
      amountRaw: row.amountRaw,
    }))

  const exact = (csv: string, tracked: string) => csv === tracked
  // Privacy Pools ids differ from the config ones in the pool address suffix
  // and, for wOETH, in capitalisation.
  const prefix = (csv: string, tracked: string) => {
    const a = csv.toLowerCase()
    const b = tracked.toLowerCase()
    return a === b || a.startsWith(`${b}-`)
  }

  console.log('\n=== coverage')
  console.log('tornado-cash')
  reportCoverage(tornadoTokens, tornadoDeposits, exact)
  console.log('railgun')
  reportCoverage(railgunTokens, railgunDeposits, exact)
  console.log('privacy-pools')
  reportCoverage(privacyPoolsTokens, ppDeposits, prefix)

  // Privacy Pools deposits are re-keyed onto the tracked bucket ids so the
  // per-token grouping below can look them up directly.
  const ppTrackedIds = privacyPoolsTokens.flatMap((token) =>
    token.buckets.map((bucket) => bucket.id),
  )
  const ppRekeyed = ppDeposits.map((deposit) => ({
    ...deposit,
    bucket:
      ppTrackedIds.find((id) => prefix(deposit.bucket, id)) ?? deposit.bucket,
  }))

  const projects = [
    {
      slug: 'tornado-cash',
      description:
        'Each line is one fixed-denomination pool, counting the addresses that deposited into it.',
      ...fromDenominations(tornadoDeposits, tornadoTokens),
      thresholds: undefined,
    },
    {
      slug: 'railgun',
      description:
        'Railgun deposits are arbitrary amounts, so each line counts the addresses that deposited at least that much of a token - two sizes per token, worth roughly 0.1 and 10 ETH.',
      ...fromEthEquivalentTiers(railgunDeposits, railgunTokens, prices),
    },
    {
      slug: 'privacy-pools',
      description:
        'Privacy Pools deposits are arbitrary amounts, so each line counts the addresses that deposited at least that much of a token - two sizes per token, worth roughly 0.1 and 10 ETH.',
      ...fromEthEquivalentTiers(ppRekeyed, privacyPoolsTokens, prices),
    },
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

    const { histories, firstDay, lastDay } = computeHistory(
      project.entries,
      project.series,
      anchors,
    )

    const historyPoints: number[][] = []
    for (let day = firstDay; day <= lastDay; day++) {
      const index = day - firstDay
      historyPoints.push([
        day * DAY_SECONDS,
        ...project.series.map((s) => histories.get(s.id)?.[index] ?? 0),
      ])
    }

    output[project.slug] = {
      description: project.description,
      buckets: project.series,
      points,
      history: historyPoints,
    }

    console.log(`\n=== ${project.slug}: ${project.series.length} series`)
    for (const s of project.series) {
      const sizes = curves.get(s.id)
      const history = histories.get(s.id) ?? []
      console.log(
        `  ${s.label.padEnd(22)} 30d: ${String(sizes?.[30 - MIN_DAYS] ?? 0).padStart(5)}   365d: ${String(sizes?.[MAX_DAYS - MIN_DAYS] ?? 0).padStart(5)}   30d a year ago: ${String(history[0] ?? 0).padStart(5)}   peak 30d: ${String(Math.max(0, ...history)).padStart(5)}`,
      )
    }
  }

  const result = {
    generatedAt: new Date().toISOString(),
    asOf: NOW_ISO,
    minDays: MIN_DAYS,
    maxDays: MAX_DAYS,
    historyDays: HISTORY_DAYS,
    historyWindowDays: HISTORY_WINDOW_DAYS,
    pricesUsd: Object.fromEntries(prices),
    projects: output,
  }

  writeFileSync(OUTPUT_FILE, `${JSON.stringify(result, null, 2)}\n`)

  console.log(
    `\nAnchors: ${anchors.length}, newest block: ${anchors[0]?.blockNumber}`,
  )
  console.log(`Wrote ${OUTPUT_FILE}`)
  console.log('Run `biome format --write` on it before committing.')
}

try {
  main()
} catch (e: unknown) {
  console.error(e)
  process.exit(1)
}
