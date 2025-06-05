import '../src/dotenv'

import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import range from 'lodash/range'
import { getDb } from '~/server/database'

const BENCHMARK_ROUNDS = 10
const SEPARATOR = '================================'

const toBenchmark: Record<string, (db: Database) => Promise<unknown>> = {
  '7d': async (db) =>
    db.tvsProjectValue.getProjectValuesAtTimestamps(
      UnixTime.now() - UnixTime.DAY * 7,
      UnixTime.now(),
      ['PROJECT', 'PROJECT_WA'],
    ),
  '30d': async (db) =>
    db.tvsProjectValue.getProjectValuesAtTimestamps(
      UnixTime.now() - UnixTime.DAY * 30,
      UnixTime.now(),
      ['PROJECT', 'PROJECT_WA'],
    ),
  '180d': async (db) =>
    db.tvsProjectValue.getProjectValuesAtTimestamps(
      UnixTime.now() - UnixTime.DAY * 180,
      UnixTime.now(),
      ['PROJECT', 'PROJECT_WA'],
    ),
}

async function benchmark() {
  const result: Record<
    string,
    { min: number; max: number; mean: number; median: number }
  > = {}
  for (const [name, fn] of Object.entries(toBenchmark)) {
    const db = getDb()
    console.log(`Benchmarking ${name}`)
    const durations = []

    for (const _ of range(BENCHMARK_ROUNDS)) {
      const start = process.hrtime()
      await fn(db)
      const end = process.hrtime(start)
      durations.push(end[0] * 1e3 + end[1] / 1e6)
    }
    const min = Math.min(...durations)
    const max = Math.max(...durations)
    const mean = durations.reduce((a, b) => a + b, 0) / durations.length
    // biome-ignore lint/style/noNonNullAssertion: we know it's there
    const median = durations.sort()[Math.floor(durations.length / 2)]!

    result[name] = { min, max, mean, median }
  }

  for (const [name, { min, max, mean, median }] of Object.entries(result)) {
    logResult(name, { min, max, mean, median })
  }
}

benchmark().catch(console.error)

function logResult(name: string, values: Record<string, number>) {
  console.log(SEPARATOR)
  console.log(`${name}`)
  console.log('|')
  for (const [name, value] of Object.entries(values)) {
    console.log(`|   ${name}: ${value.toFixed(2)} ms`)
  }
  console.log('|')
  console.log(SEPARATOR)
}
