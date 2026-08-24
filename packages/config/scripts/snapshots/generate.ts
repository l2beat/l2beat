import { execFileSync } from 'child_process'
import { existsSync, writeFileSync } from 'fs'
import { mergeSnapshots } from '../../src/snapshots/merge'
import { SNAPSHOT_DOMAINS } from '../../src/snapshots/registry'
import { readSnapshot, toStored } from '../../src/snapshots/types'

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
  const { merged: snapshot, skipped } =
    overwrite || !existsSync(domain.snapshotPath)
      ? { merged: fresh, skipped: [] }
      : mergeSnapshots(readSnapshot(domain), fresh)
  writeFileSync(
    domain.snapshotPath,
    `${JSON.stringify(toStored(snapshot), null, 2)}\n`,
  )
  execFileSync('pnpm', [
    'exec',
    'biome',
    'format',
    '--write',
    domain.snapshotPath,
  ])
  const projectCount = Object.keys(snapshot).length
  const idCount = Object.values(snapshot).flat().length
  console.log(
    `${domain.name}: wrote ${idCount} identities for ${projectCount} projects`,
  )
  if (skipped.length > 0) {
    console.log(
      `${domain.name}: left ${skipped.length} ${skipped.length === 1 ? 'project' : 'projects'} unchanged (${skipped.join(', ')}) - a committed identity disappeared there, and dropping it wipes its data. Freeze the old entry instead (the guard test prints the recipe and a paste-ready config). If you know what you are doing and do not want to preserve history, run 'pnpm snapshots:generate --overwrite'.`,
    )
  }
}
