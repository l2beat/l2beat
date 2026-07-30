import { writeFileSync } from 'fs'
import { SNAPSHOT_DOMAINS } from '../../src/snapshots/registry'

const requested = process.argv.slice(2)
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
  const snapshot = domain.generate()
  writeFileSync(domain.snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`)
  const projectCount = Object.keys(snapshot).length
  const idCount = Object.values(snapshot).flat().length
  console.log(
    `${domain.name}: wrote ${idCount} identities for ${projectCount} projects`,
  )
}
