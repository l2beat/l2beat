/**
 * Perimeter lint for the ossification factor. The source of truth is the
 * `critical` flag curated in discovery (template.jsonc / config.jsonc);
 * this tool derives a candidate perimeter from the value graph and reports
 * discrepancies for researchers and classification agents to resolve.
 *
 * Usage: npx tsx scripts/ossification-lint.ts <projectId> [<projectId> ...]
 */
import { readFileSync } from 'fs'
import path from 'path'
import {
  collectEscrowSeeds,
  type DiscoveredEntryLite,
  deriveOssificationPerimeter,
  getTrackedTxSeeds,
} from '~/server/features/projects/ossification/getOssificationPerimeter'
import { ps } from '~/server/projects'

async function main() {
  const ids = process.argv.slice(2)
  if (ids.length === 0) {
    console.error('usage: ossification-lint.ts <projectId> [...]')
    process.exit(1)
  }
  const projects = await ps.getProjects({ optional: ['trackedTxsConfig'] })

  for (const id of ids) {
    const dir = path.join(process.cwd(), '../config/src/projects', id)
    let entries: DiscoveredEntryLite[]
    let tvsJson: unknown
    try {
      entries = (
        JSON.parse(
          readFileSync(path.join(dir, 'discovered.json'), 'utf-8'),
        ) as {
          entries: DiscoveredEntryLite[]
        }
      ).entries
    } catch {
      console.log(`\n=== ${id}: no discovered.json`)
      continue
    }
    try {
      tvsJson = JSON.parse(readFileSync(path.join(dir, 'tvs.json'), 'utf-8'))
    } catch {
      tvsJson = undefined
    }

    const project = projects.find((p) => p.id === id)
    const seeds = [
      ...collectEscrowSeeds(tvsJson),
      ...getTrackedTxSeeds(project?.trackedTxsConfig),
    ]
    const derived = deriveOssificationPerimeter(entries, seeds)

    const contracts = entries.filter(
      (entry) => entry.type === 'Contract' && entry.address,
    )
    const flagged = new Set(
      contracts
        .filter((entry) => entry.critical === true)
        .map((entry) => (entry.address ?? '').toLowerCase()),
    )
    const name = (key: string) =>
      contracts.find((entry) => entry.address?.toLowerCase() === key)?.name ??
      key

    console.log(`\n=== ${id}`)
    console.log(
      `flagged critical: ${flagged.size} / ${contracts.length} contracts, closure seeds: ${seeds.length}`,
    )
    if (!derived) {
      console.log('closure: no seed matched a discovered contract')
      continue
    }
    const missing = [...derived].filter((key) => !flagged.has(key))
    const extra = [...flagged].filter((key) => !derived.has(key))
    if (missing.length > 0) {
      console.log('in value-graph closure but NOT flagged critical:')
      for (const key of missing) console.log(`  - ${name(key)} (${key})`)
    }
    if (extra.length > 0) {
      console.log('flagged critical but NOT in value-graph closure (verify):')
      for (const key of extra) console.log(`  - ${name(key)} (${key})`)
    }
    if (missing.length === 0 && extra.length === 0) {
      console.log('flags and closure agree')
    }
  }
}

main()
