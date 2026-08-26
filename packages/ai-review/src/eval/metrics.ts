import { createHash } from 'node:crypto'
import { appendFileSync } from 'node:fs'
import type { Dataset, MetricsRow } from './types.js'

export function datasetHash(dataset: Dataset): string {
  const pinned = dataset.entries.map((e) => [
    e.pr,
    e.headSha,
    e.baseSha,
    e.humanComments.map((c) => c.id),
    e.codexFindings.map((c) => c.id),
    e.linear?.snapshotAt ?? null,
  ])
  return createHash('sha256')
    .update(JSON.stringify(pinned))
    .digest('hex')
    .slice(0, 12)
}

export function appendMetricsRow(path: string, row: MetricsRow) {
  appendFileSync(path, `${JSON.stringify(row)}\n`)
}
