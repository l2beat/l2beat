import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect } from 'earl'

/**
 * Postgres sums a `real` column in `real`, which keeps about 7 digits: a
 * running total near $67bn moves in steps of $4,096, and the result depends
 * on row order. `sum(col)::double precision` casts after the damage and
 * `sum(coalesce(col, 0))` stays `real`. Only a cast on each row helps:
 * `sum(col::double precision)`.
 */
describe('real columns', () => {
  const realColumns = readRealColumns()

  it('get no new members', () => {
    // A new column should be `@db.DoublePrecision`. A `real` saves 4 bytes
    // per row and rounds every stored value to about 7 digits.
    expect(
      [...realColumns].flatMap(([model, columns]) =>
        columns.map((column) => `${model}.${column}`),
      ),
    ).toEqual(KNOWN_REAL_COLUMNS)
  })

  it('are cast to double precision before they are summed', () => {
    const offences: string[] = []
    for (const file of readdirSync(REPOSITORIES)) {
      if (!file.endsWith('.ts') || file.endsWith('.test.ts')) continue
      const source = readFileSync(join(REPOSITORIES, file), 'utf8')
      const columns = new Set(
        [...realColumns]
          .filter(([model]) => new RegExp(`['"]${model}\\b`).test(source))
          .flatMap(([, columns]) => columns),
      )
      if (columns.size === 0) continue

      for (const sum of findSums(source)) {
        if (sum.argument.includes('double precision')) continue
        const names = sum.argument.match(/[A-Za-z_]\w*/g) ?? []
        const column = names.find((name) => columns.has(name))
        if (column !== undefined) {
          offences.push(`${file}:${sum.line} sums the real column ${column}`)
        } else if (
          sum.viaKysely &&
          !/^\s*'[\w.]+',?\s*$|^\s*sql`[^`$]*`\s*$/.test(sum.argument)
        ) {
          // Anything but one column name or a plain `sql` template hides what
          // is summed: a variable, as `valueField` did in TokenValueRepository,
          // an expression such as `eb.case()` around one, or a `${}` in a
          // template.
          offences.push(
            `${file}:${sum.line} sums ${sum.argument.trim().replace(/\s+/g, ' ')}`,
          )
        }
      }
    }

    expect(offences).toEqual([])
  })
})

const REPOSITORIES = join(__dirname, 'repositories')

const KNOWN_REAL_COLUMNS = [
  'CurrentPrice.priceUsd',
  'DaBeatStats.totalStake',
  'DaBeatStats.thresholdStake',
  'AggregatedL2Cost.totalGasEth',
  'AggregatedL2Cost.totalGasUsd',
  'AggregatedL2Cost.blobsGasEth',
  'AggregatedL2Cost.blobsGasUsd',
  'AggregatedL2Cost.calldataGasEth',
  'AggregatedL2Cost.calldataGasUsd',
  'AggregatedL2Cost.computeGasEth',
  'AggregatedL2Cost.computeGasUsd',
  'AggregatedL2Cost.overheadGasEth',
  'AggregatedL2Cost.overheadGasUsd',
  'L2CostPrice.priceUsd',
  'AnomalyStats.mean',
  'AnomalyStats.stdDev',
  'TvsPrice.priceUsd',
  'TokenValue.amount',
  'TokenValue.value',
  'TokenValue.valueForProject',
  'TokenValue.valueForSummary',
  'TokenValue.priceUsd',
  'TvsEscrowValue.amount',
  'TvsEscrowValue.value',
  'PrivacyPrice.priceUsd',
  'PrivacyFlowEvent.valueUsd',
  'InteropTransfer.srcAmount',
  'InteropTransfer.srcPrice',
  'InteropTransfer.srcValueUsd',
  'InteropTransfer.dstAmount',
  'InteropTransfer.dstPrice',
  'InteropTransfer.dstValueUsd',
  'InteropRecentPrices.priceUsd',
  'AggregatedInteropTransfer.srcValueUsd',
  'AggregatedInteropTransfer.dstValueUsd',
  'AggregatedInteropTransfer.minTransferValueUsd',
  'AggregatedInteropTransfer.maxTransferValueUsd',
  'AggregatedInteropTransfer.avgValueInFlight',
  'AggregatedInteropTransfer.mintedValueUsd',
  'AggregatedInteropTransfer.burnedValueUsd',
  'AggregatedInteropToken.mintedValueUsd',
  'AggregatedInteropToken.burnedValueUsd',
  'AggregatedInteropToken.volume',
  'AggregatedInteropToken.minTransferValueUsd',
  'AggregatedInteropToken.maxTransferValueUsd',
  'AggregatedInteropDeployedToken.mintedValueUsd',
  'AggregatedInteropDeployedToken.burnedValueUsd',
  'AggregatedInteropDeployedToken.volume',
  'AggregatedInteropDeployedToken.minTransferValueUsd',
  'AggregatedInteropDeployedToken.maxTransferValueUsd',
  'AggregatedInteropTokensPair.volume',
  'AggregatedInteropTokensPair.minTransferValueUsd',
  'AggregatedInteropTokensPair.maxTransferValueUsd',
]

/** The `@db.Real` columns of each model, in schema order. */
function readRealColumns(): Map<string, string[]> {
  const schema = readFileSync(
    join(__dirname, '../prisma/schema.prisma'),
    'utf8',
  )
  const result = new Map<string, string[]>()
  let model = ''
  for (const line of schema.split('\n')) {
    model = line.match(/^model (\w+)/)?.[1] ?? model
    if (!line.includes('@db.Real')) continue
    const column = line.trim().split(/\s+/)[0]
    if (column) result.set(model, [...(result.get(model) ?? []), column])
  }
  return result
}

/** Every `sum(...)` call in the source, in SQL or kysely, with its argument. */
function findSums(source: string) {
  const sums: { line: number; argument: string; viaKysely: boolean }[] = []
  for (const match of source.matchAll(/\bsum(?:<[^>]*>)?\s*\(/gi)) {
    const start = match.index + match[0].length
    let depth = 1
    let end = start
    while (depth > 0 && end < source.length) {
      if (source[end] === '(') depth++
      if (source[end] === ')') depth--
      end++
    }
    sums.push({
      line: source.slice(0, match.index).split('\n').length,
      argument: source.slice(start, end - 1),
      viaKysely: source[match.index - 1] === '.',
    })
  }
  return sums
}
