import { existsSync, readFileSync, writeFileSync } from 'fs'
import { mergeSnapshots } from '../../src/snapshots/merge'
import { SNAPSHOT_DOMAINS } from '../../src/snapshots/registry'
import type { Snapshot } from '../../src/snapshots/types'

const args = process.argv.slice(2)
const overwrite = args.includes('--overwrite')
const requested = args.filter((a) => a !== '--overwrite')
const unknown = requested.filter(
  (name) => !SNAPSHOT_DOMAINS.some((d) => d.name === name),
)
if (unknown.length > 0) {
  console.error(
    `Unknown snapshot domain(s): ${unknown.join(', ')}. Available: ${SNAPSHOT_DOMAINS.map(
      (d) => d.name,
    ).join(', ')}`,
  )
  process.exit(1)
}

const domains =
  requested.length > 0
    ? SNAPSHOT_DOMAINS.filter((d) => requested.includes(d.name))
    : SNAPSHOT_DOMAINS

for (const domain of domains) {
  const fresh = domain.generate()
  let snapshot = fresh
  let skipped: string[] = []
  if (!overwrite && existsSync(domain.snapshotPath)) {
    const committed: Snapshot = JSON.parse(
      readFileSync(domain.snapshotPath, 'utf8'),
    )
    ;({ merged: snapshot, skipped } = mergeSnapshots(committed, fresh))
  }
  writeFileSync(domain.snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`)
  const projectCount = Object.keys(snapshot).length
  const idCount = Object.values(snapshot).flat().length
  console.log(
    `${domain.name}: wrote ${idCount} identities for ${projectCount} projects`,
  )
  if (skipped.length > 0) {
    console.log(
      `${domain.name}: left ${skipped.length} ${skipped.length === 1 ? 'project' : 'projects'} unchanged (${skipped.join(', ')}) - an identity disappeared or a range moved there, and this command only appends new configs. If you know what you are doing and do not want to preserve history, run 'pnpm snapshots:generate --overwrite'.`,
    )
  }
}
