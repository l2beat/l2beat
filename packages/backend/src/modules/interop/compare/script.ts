import {
  command,
  number,
  option,
  optional,
  positional,
  run,
  string,
} from 'cmd-ts'

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const pg = require('pg')
const Pool = pg.Pool as new (config: {
  connectionString: string
}) => PoolInstance

interface PoolInstance {
  query<T>(text: string, values?: unknown[]): Promise<{ rows: T[] }>
  end(): Promise<void>
}

function getEnvOrThrow(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

// ANSI color codes
const colors = {
  reset: '\x1B[0m',
  bold: '\x1B[1m',
  dim: '\x1B[2m',
  green: '\x1B[32m',
  yellow: '\x1B[33m',
  blue: '\x1B[34m',
  magenta: '\x1B[35m',
  cyan: '\x1B[36m',
  red: '\x1B[31m',
  bgBlue: '\x1B[44m',
  bgGreen: '\x1B[42m',
  bgYellow: '\x1B[43m',
}

const c = {
  title: (s: string) => `${colors.bold}${colors.cyan}${s}${colors.reset}`,
  header: (s: string) => `${colors.bold}${colors.magenta}${s}${colors.reset}`,
  success: (s: string) => `${colors.green}${s}${colors.reset}`,
  warning: (s: string) => `${colors.yellow}${s}${colors.reset}`,
  error: (s: string) => `${colors.red}${s}${colors.reset}`,
  info: (s: string) => `${colors.blue}${s}${colors.reset}`,
  dim: (s: string) => `${colors.dim}${s}${colors.reset}`,
  bold: (s: string) => `${colors.bold}${s}${colors.reset}`,
  num: (n: number | string) =>
    `${colors.bold}${colors.cyan}${n}${colors.reset}`,
}

interface BaseRow {
  plugin: string
  type: string
  timestamp: Date
}

interface EventRow extends BaseRow {
  eventId: string
  chain: string
  ctx: { txHash?: string } | string
  args: unknown
  matched: boolean
  unsupported: boolean
}

interface MessageRow extends BaseRow {
  messageId: string
  srcTxHash: string | null
  dstTxHash: string | null
  srcChain: string | null
  dstChain: string | null
  app: string
}

interface TransferRow extends BaseRow {
  transferId: string
  srcTxHash: string
  dstTxHash: string
  srcChain: string
  dstChain: string
  srcTokenAddress: string | null
  dstTokenAddress: string | null
  srcRawAmount: string | null
  dstRawAmount: string | null
}

interface ComparisonResult<T> {
  local: T[]
  staging: T[]
  onlyInLocal: T[]
  onlyInStaging: T[]
  common: number
  commonPairs: { local: T; staging: T }[]
}

const cmd = command({
  name: 'interop:compare',
  description:
    'Compare interop data between local and staging databases.\n\nRequired env vars: LOCAL_DB_URL, STAGING_DB_URL',
  args: {
    plugin: positional({
      type: string,
      displayName: 'plugin',
      description: 'Plugin name to compare (e.g., "ccip")',
    }),
    hours: option({
      type: optional(number),
      long: 'hours',
      short: 'h',
      description: 'Number of hours to look back from now',
    }),
    days: option({
      type: optional(number),
      long: 'days',
      short: 'd',
      description: 'Number of days to look back (default: 7)',
    }),
    from: option({
      type: optional(string),
      long: 'from',
      description: 'Start date (YYYY-MM-DD)',
    }),
    to: option({
      type: optional(string),
      long: 'to',
      description: 'End date (YYYY-MM-DD)',
    }),
    fromTs: option({
      type: optional(number),
      long: 'from-ts',
      description: 'Exact start timestamp (unix seconds) for reproducibility',
    }),
    toTs: option({
      type: optional(number),
      long: 'to-ts',
      description: 'Exact end timestamp (unix seconds) for reproducibility',
    }),
  },
  handler: async (args) => {
    const { fromDate, toDate, isRelative } = getDateRange(args)

    console.log('')
    console.log(c.title(`━━━ ${args.plugin.toUpperCase()} Comparison ━━━`))
    console.log('')
    console.log(
      `${c.dim('Time range:')} ${formatDateTime(fromDate)} ${c.dim('→')} ${formatDateTime(toDate)}`,
    )
    console.log('')

    const localPool = new Pool({
      connectionString: getEnvOrThrow('LOCAL_DB_URL'),
    })
    const stagingPool = new Pool({
      connectionString: getEnvOrThrow('STAGING_DB_URL'),
    })

    try {
      // Find overlapping time range to ensure fair comparison
      const overlap = await findOverlappingTimeRange(
        localPool,
        stagingPool,
        args.plugin,
        fromDate,
        toDate,
      )

      if (!overlap) {
        console.log(
          c.warning('No overlapping data found in the specified time range.'),
        )
        return
      }

      await compareEvents(
        localPool,
        stagingPool,
        args.plugin,
        overlap.from,
        overlap.to,
      )
      await compareMessages(
        localPool,
        stagingPool,
        args.plugin,
        overlap.from,
        overlap.to,
      )
      await compareTransfers(
        localPool,
        stagingPool,
        args.plugin,
        overlap.from,
        overlap.to,
      )

      // If using relative time (--hours or --days), output reproducible command
      if (isRelative) {
        const fromTs = Math.floor(overlap.from.getTime() / 1000)
        const toTs = Math.floor(overlap.to.getTime() / 1000)
        console.log('')
        console.log(c.dim('To re-run with same range:'))
        console.log(
          c.info(
            `  pnpm interop:compare ${args.plugin} --from-ts ${fromTs} --to-ts ${toTs}`,
          ),
        )
        console.log('')
      }
    } finally {
      await localPool.end()
      await stagingPool.end()
    }
  },
})

function getDateRange(args: {
  hours?: number
  days?: number
  from?: string
  to?: string
  fromTs?: number
  toTs?: number
}): {
  fromDate: Date
  toDate: Date
  isRelative: boolean
} {
  // Exact timestamps take priority (for reproducibility)
  if (args.fromTs !== undefined && args.toTs !== undefined) {
    return {
      fromDate: new Date(args.fromTs * 1000),
      toDate: new Date(args.toTs * 1000),
      isRelative: false,
    }
  }

  // Date strings
  if (args.from || args.to) {
    const toDate = args.to ? new Date(args.to) : new Date()
    const fromDate = args.from
      ? new Date(args.from)
      : new Date(toDate.getTime() - (args.days ?? 7) * 24 * 60 * 60 * 1000)
    return { fromDate, toDate, isRelative: false }
  }

  // Hours (relative, needs reproducible command)
  if (args.hours !== undefined) {
    const toDate = new Date()
    const fromDate = new Date(toDate.getTime() - args.hours * 60 * 60 * 1000)
    return { fromDate, toDate, isRelative: true }
  }

  // Days (relative, needs reproducible command)
  const toDate = new Date()
  const fromDate = new Date(
    toDate.getTime() - (args.days ?? 7) * 24 * 60 * 60 * 1000,
  )
  return { fromDate, toDate, isRelative: true }
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

function formatTime(date: Date): string {
  return date.toISOString().split('T')[1].slice(0, 8)
}

function formatDateTime(date: Date): string {
  return `${formatDate(date)} ${formatTime(date)}`
}

async function findOverlappingTimeRange(
  localPool: PoolInstance,
  stagingPool: PoolInstance,
  plugin: string,
  fromDate: Date,
  toDate: Date,
): Promise<{ from: Date; to: Date } | null> {
  const query = `
    SELECT MIN(timestamp) as min_ts, MAX(timestamp) as max_ts
    FROM "InteropEvent"
    WHERE plugin = $1 AND timestamp >= $2 AND timestamp <= $3
  `

  const [localResult, stagingResult] = await Promise.all([
    localPool.query<{ min_ts: Date; max_ts: Date }>(query, [
      plugin,
      fromDate,
      toDate,
    ]),
    stagingPool.query<{ min_ts: Date; max_ts: Date }>(query, [
      plugin,
      fromDate,
      toDate,
    ]),
  ])

  const localMin = localResult.rows[0]?.min_ts
  const localMax = localResult.rows[0]?.max_ts
  const stagingMin = stagingResult.rows[0]?.min_ts
  const stagingMax = stagingResult.rows[0]?.max_ts

  if (!localMin || !localMax || !stagingMin || !stagingMax) {
    return null
  }

  // Find overlapping range
  const overlapFrom = new Date(
    Math.max(localMin.getTime(), stagingMin.getTime()),
  )
  const overlapTo = new Date(Math.min(localMax.getTime(), stagingMax.getTime()))

  if (overlapFrom >= overlapTo) {
    return null
  }

  console.log(c.header('Sync State'))
  console.log(
    `  ${c.dim('Local  ')} ${formatDateTime(localMin)} ${c.dim('→')} ${formatDateTime(localMax)}`,
  )
  console.log(
    `  ${c.dim('Staging')} ${formatDateTime(stagingMin)} ${c.dim('→')} ${formatDateTime(stagingMax)}`,
  )
  console.log(
    `  ${c.success('Overlap')} ${formatDateTime(overlapFrom)} ${c.dim('→')} ${formatDateTime(overlapTo)}`,
  )
  console.log('')

  return { from: overlapFrom, to: overlapTo }
}

function compareByKey<T>(
  localItems: T[],
  stagingItems: T[],
  getKey: (item: T) => string,
): ComparisonResult<T> {
  const localMap = new Map<string, T>()
  for (const item of localItems) {
    localMap.set(getKey(item), item)
  }

  const stagingMap = new Map<string, T>()
  for (const item of stagingItems) {
    stagingMap.set(getKey(item), item)
  }

  const onlyInLocal: T[] = []
  const onlyInStaging: T[] = []
  const commonPairs: { local: T; staging: T }[] = []

  localMap.forEach((localItem, key) => {
    const stagingItem = stagingMap.get(key)
    if (stagingItem) {
      commonPairs.push({ local: localItem, staging: stagingItem })
    } else {
      onlyInLocal.push(localItem)
    }
  })

  stagingMap.forEach((item, key) => {
    if (!localMap.has(key)) {
      onlyInStaging.push(item)
    }
  })

  return {
    local: localItems,
    staging: stagingItems,
    onlyInLocal,
    onlyInStaging,
    common: commonPairs.length,
    commonPairs,
  }
}

function printSummary(name: string, result: ComparisonResult<unknown>): void {
  console.log(c.header(name))
  const stagingOnly = result.onlyInStaging.length
  const localOnly = result.onlyInLocal.length
  const allMatch = stagingOnly === 0 && localOnly === 0

  // Table-like summary
  const pad = (n: number, w: number) => String(n).padStart(w)
  const w = 5 // width for numbers
  console.log('  ┌─────────┬─────────┬─────────┐')
  console.log(
    `  │ ${c.dim('Staging')} │ ${c.dim('Local')}   │ ${c.dim('Common')}  │`,
  )
  console.log('  ├─────────┼─────────┼─────────┤')
  console.log(
    `  │ ${c.num(pad(result.staging.length, w))}   │ ${c.num(pad(result.local.length, w))}   │ ${c.num(pad(result.common, w))}   │`,
  )
  console.log('  └─────────┴─────────┴─────────┘')

  if (allMatch) {
    console.log(`  ${c.success('[OK] All match')}`)
  } else {
    const parts: string[] = []
    if (stagingOnly > 0)
      parts.push(c.warning(`[!] +${stagingOnly} staging-only`))
    if (localOnly > 0) parts.push(c.info(`[!] +${localOnly} local-only`))
    console.log(`  ${parts.join('   ')}`)
  }
}

function printItems<T>(
  label: string,
  items: T[],
  formatter: (item: T) => string,
  color: (s: string) => string = c.dim,
): void {
  if (items.length === 0) return
  console.log(`  ${c.dim(label + ':')}`)
  for (const item of items) {
    console.log(`    ${color('•')} ${color(formatter(item))}`)
  }
}

function printBreakdown<T>(
  items: T[],
  getKey: (item: T) => string,
  isLocal: boolean,
): Map<string, { local: number; staging: number }> {
  const counts = new Map<string, { local: number; staging: number }>()
  for (const item of items) {
    const key = getKey(item)
    const curr = counts.get(key) ?? { local: 0, staging: 0 }
    if (isLocal) curr.local++
    else curr.staging++
    counts.set(key, curr)
  }
  return counts
}

function mergeCounts(
  a: Map<string, { local: number; staging: number }>,
  b: Map<string, { local: number; staging: number }>,
): Map<string, { local: number; staging: number }> {
  const result = new Map(a)
  b.forEach((counts, key) => {
    const curr = result.get(key) ?? { local: 0, staging: 0 }
    curr.local += counts.local
    curr.staging += counts.staging
    result.set(key, curr)
  })
  return result
}

function printCombinedBreakdown<T>(
  onlyInLocal: T[],
  onlyInStaging: T[],
  getKey: (item: T) => string,
  _label: string,
): void {
  if (onlyInLocal.length === 0 && onlyInStaging.length === 0) {
    return
  }

  const localCounts = printBreakdown(onlyInLocal, getKey, true)
  const stagingCounts = printBreakdown(onlyInStaging, getKey, false)
  const combined = mergeCounts(localCounts, stagingCounts)

  const sorted = Array.from(combined.entries()).sort((a, b) =>
    a[0].localeCompare(b[0]),
  )

  // Find max key length for alignment
  const maxKeyLen = Math.max(...sorted.map(([k]) => k.length), 10)

  console.log(`  ${c.dim('Breakdown:')}`)
  for (const [key, counts] of sorted) {
    const localStr =
      counts.local > 0 ? c.info(String(counts.local).padStart(3)) : c.dim('  -')
    const stagingStr =
      counts.staging > 0
        ? c.warning(String(counts.staging).padStart(3))
        : c.dim('  -')
    console.log(
      `    ${key.padEnd(maxKeyLen)}  ${c.dim('L')}${localStr}  ${c.dim('S')}${stagingStr}`,
    )
  }
}

async function compareEvents(
  localPool: PoolInstance,
  stagingPool: PoolInstance,
  plugin: string,
  fromDate: Date,
  toDate: Date,
): Promise<void> {
  const query = `
    SELECT "eventId", plugin, type, timestamp, chain, ctx, args, matched, unsupported
    FROM "InteropEvent"
    WHERE plugin = $1 AND timestamp >= $2 AND timestamp <= $3
    ORDER BY timestamp DESC
  `

  const [localResult, stagingResult] = await Promise.all([
    localPool.query<EventRow>(query, [plugin, fromDate, toDate]),
    stagingPool.query<EventRow>(query, [plugin, fromDate, toDate]),
  ])

  const getKey = (e: EventRow): string => {
    const ctx = typeof e.ctx === 'string' ? JSON.parse(e.ctx) : e.ctx
    return `${ctx?.txHash ?? 'unknown'}:${e.type}:${e.chain}`
  }

  const result = compareByKey(localResult.rows, stagingResult.rows, getKey)

  printSummary('Events', result)

  // Check for matched status differences in common events
  const matchedDiffs = result.commonPairs.filter(
    ({ local, staging }) => local.matched !== staging.matched,
  )
  if (matchedDiffs.length > 0) {
    console.log(
      `  ${c.error(`[!] ${matchedDiffs.length} events have different matched status:`)}`,
    )
    for (const { local, staging } of matchedDiffs) {
      const ctx = typeof local.ctx === 'string' ? JSON.parse(local.ctx) : local.ctx
      const localStatus = local.matched ? c.success('matched') : c.warning('unmatched')
      const stagingStatus = staging.matched ? c.success('matched') : c.warning('unmatched')
      console.log(
        `    ${c.dim('•')} ${local.chain} ${local.type.split('.')[1]} ${ctx?.txHash ?? 'unknown'}`,
      )
      console.log(`      ${c.dim('local:')} ${localStatus}  ${c.dim('staging:')} ${stagingStatus}`)
    }
  } else if (result.common > 0) {
    console.log(`  ${c.success('[OK] All common events have same matched status')}`)
  }

  // Show matched status for staging-only events
  const stagingOnlyMatched = result.onlyInStaging.filter((e) => e.matched).length
  const stagingOnlyUnmatched = result.onlyInStaging.length - stagingOnlyMatched
  if (result.onlyInStaging.length > 0) {
    console.log(
      `  ${c.dim('Staging-only:')} ${c.success(`${stagingOnlyMatched} matched`)} / ${c.warning(`${stagingOnlyUnmatched} unmatched`)}`,
    )
  }
  printItems(
    'Staging-only (unmatched)',
    result.onlyInStaging.filter((e) => !e.matched),
    (e) => {
      const ctx = typeof e.ctx === 'string' ? JSON.parse(e.ctx) : e.ctx
      return `${e.chain} ${e.type.split('.')[1]} ${ctx?.txHash ?? 'unknown'}`
    },
    c.warning,
  )

  // Show matched status for local-only events
  const localOnlyMatched = result.onlyInLocal.filter((e) => e.matched).length
  const localOnlyUnmatched = result.onlyInLocal.length - localOnlyMatched
  if (result.onlyInLocal.length > 0) {
    console.log(
      `  ${c.dim('Local-only:')} ${c.success(`${localOnlyMatched} matched`)} / ${c.warning(`${localOnlyUnmatched} unmatched`)}`,
    )
  }
  printItems(
    'Local-only (unmatched)',
    result.onlyInLocal.filter((e) => !e.matched),
    (e) => {
      const ctx = typeof e.ctx === 'string' ? JSON.parse(e.ctx) : e.ctx
      return `${e.chain} ${e.type.split('.')[1]} ${ctx?.txHash ?? 'unknown'}`
    },
    c.info,
  )

  printCombinedBreakdown(
    result.onlyInLocal,
    result.onlyInStaging,
    (e) => e.chain,
    'Chain',
  )
  console.log('')
}

async function compareMessages(
  localPool: PoolInstance,
  stagingPool: PoolInstance,
  plugin: string,
  fromDate: Date,
  toDate: Date,
): Promise<void> {
  const query = `
    SELECT "messageId", plugin, type, timestamp, "srcTxHash", "dstTxHash", "srcChain", "dstChain", app
    FROM "InteropMessage"
    WHERE plugin = $1 AND timestamp >= $2 AND timestamp <= $3
    ORDER BY timestamp DESC
  `

  const [localResult, stagingResult] = await Promise.all([
    localPool.query<MessageRow>(query, [plugin, fromDate, toDate]),
    stagingPool.query<MessageRow>(query, [plugin, fromDate, toDate]),
  ])

  const getKey = (m: MessageRow): string =>
    `${m.srcTxHash ?? 'unknown'}:${m.type}`

  const result = compareByKey(localResult.rows, stagingResult.rows, getKey)

  printSummary('Messages', result)
  printItems(
    'Staging-only',
    result.onlyInStaging,
    (m) => `${m.srcChain} → ${m.dstChain} ${m.srcTxHash}`,
    c.warning,
  )
  printItems(
    'Local-only',
    result.onlyInLocal,
    (m) => `${m.srcChain} → ${m.dstChain} ${m.srcTxHash}`,
    c.info,
  )
  printCombinedBreakdown(
    result.onlyInLocal,
    result.onlyInStaging,
    (m) => `${m.srcChain ?? '?'} → ${m.dstChain ?? '?'}`,
    'Chain pair',
  )
  console.log('')
}

async function compareTransfers(
  localPool: PoolInstance,
  stagingPool: PoolInstance,
  plugin: string,
  fromDate: Date,
  toDate: Date,
): Promise<void> {
  const query = `
    SELECT "transferId", plugin, type, timestamp, "srcTxHash", "dstTxHash",
           "srcChain", "dstChain", "srcTokenAddress", "dstTokenAddress",
           "srcRawAmount"::text, "dstRawAmount"::text
    FROM "InteropTransfer"
    WHERE plugin = $1 AND timestamp >= $2 AND timestamp <= $3
    ORDER BY timestamp DESC
  `

  const [localResult, stagingResult] = await Promise.all([
    localPool.query<TransferRow>(query, [plugin, fromDate, toDate]),
    stagingPool.query<TransferRow>(query, [plugin, fromDate, toDate]),
  ])

  const getKey = (t: TransferRow): string => `${t.srcTxHash}:${t.type}`

  const result = compareByKey(localResult.rows, stagingResult.rows, getKey)

  printSummary('Transfers', result)
  printItems(
    'Staging-only',
    result.onlyInStaging,
    (t) => `${t.srcChain} → ${t.dstChain} ${t.srcTxHash}`,
    c.warning,
  )
  printItems(
    'Local-only',
    result.onlyInLocal,
    (t) => `${t.srcChain} → ${t.dstChain} ${t.srcTxHash}`,
    c.info,
  )
  printCombinedBreakdown(
    result.onlyInLocal,
    result.onlyInStaging,
    (t) => `${t.srcChain} → ${t.dstChain}`,
    'Chain pair',
  )
  console.log('')
}

run(cmd, process.argv.slice(2))
