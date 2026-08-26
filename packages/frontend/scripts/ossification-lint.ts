/**
 * Perimeter and severity-history lint for the ossification factor. The source
 * of truth is the `critical` flag and field severities curated in discovery
 * (template.jsonc / config.jsonc); this tool derives a candidate perimeter
 * from the value graph, and audits committed diff history against current
 * severities, reporting discrepancies for researchers to resolve.
 *
 * The severity audit lists every field on a critical contract that carries
 * annotated-HIGH history but is not HIGH today. Those changes no longer count
 * (current judgment is authoritative) — each row needs a reviewer to either
 * confirm the downgrade or, if the field was renamed rather than re-judged,
 * backfill the events under the new name via criticalEvents.
 *
 * Usage: npx tsx scripts/ossification-lint.ts <projectId> [<projectId> ...]
 */
import { existsSync, readFileSync } from 'fs'
import path from 'path'
import { getDiscoveryUpdates } from '~/server/features/projects/recent-changes/getDiscoveryUpdates'
import {
  collectEscrowSeeds,
  type DiscoveredEntryLite,
  deriveOssificationPerimeter,
  getTrackedTxSeeds,
} from '~/server/features/projects/ossification/getOssificationPerimeter'
import { ps } from '~/server/projects'
import {
  extractDiffBlockAddress,
  extractDiffBlockFieldChanges,
  extractDiffBlockSpans,
  isImplementationChangeDiffBody,
} from '~/utils/diffHistory/diffHistoryMarkdown'

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
    auditSeverityHistory(id)
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

interface SilencedFieldHistory {
  contract: string
  name: string
  field: string
  /** 'downgraded' = field still annotated, no longer HIGH; 'absent' = no
   *  current metadata at all (possible rename). */
  status: 'downgraded' | 'absent'
  count: number
  first: number
  last: number
}

/** Annotated-HIGH history on current critical contracts that current
 *  severities silence. Reviewed exceptions live in criticalEvents; everything
 *  else here needs a confirm-or-backfill decision. */
function auditSeverityHistory(projectId: string) {
  const root = path.join(process.cwd(), '../config/src/projects')
  const ossification = readJson(path.join(root, projectId, 'ossification.json'))
  const projectIds = [
    projectId,
    ...((ossification?.includeProjects as string[] | undefined) ?? []),
  ]
  const coveredUpdateIds = new Set(
    ((ossification?.criticalEvents as { updateId?: string }[]) ?? [])
      .map((event) => event.updateId)
      .filter((updateId) => updateId !== undefined),
  )
  /** "<chain:address>#<field>" entries a reviewer confirmed: the downgrade is
   *  intended and the silenced history needs no backfill. */
  const reviewedDowngrades = new Set(
    ((ossification?.reviewedSeverityDowngrades as string[]) ?? []).map((key) =>
      key.toLowerCase(),
    ),
  )

  const entryByAddress = new Map<string, DiscoveredEntryLite>()
  const criticalKeys = new Set<string>()
  for (const id of projectIds) {
    const discovered = readJson(path.join(root, id, 'discovered.json'))
    for (const entry of (discovered?.entries as DiscoveredEntryLite[]) ?? []) {
      if (entry.type !== 'Contract' || !entry.address) continue
      const key = entry.address.toLowerCase()
      const bare = key.split(':').at(-1) ?? key
      for (const alias of [key, bare]) {
        if (!entryByAddress.has(alias)) entryByAddress.set(alias, entry)
      }
      if (entry.critical === true) {
        criticalKeys.add(key)
        criticalKeys.add(bare)
      }
    }
  }

  interface HistoricalLedgerContract {
    address: string
    name?: string
    critical?: boolean | null
    upgradeTimestamps?: number[]
  }
  const historicalByAddress = new Map<string, HistoricalLedgerContract>()
  for (const contract of (ossification?.historicalContracts as
    | HistoricalLedgerContract[]
    | undefined) ?? []) {
    // same filter as the runtime: reviewed non-critical entries are inert
    if (!contract.address || contract.critical !== true) continue
    const key = contract.address.toLowerCase()
    if (criticalKeys.has(key)) continue // shadowed by a live contract
    historicalByAddress.set(key, contract)
    const bare = key.split(':').at(-1)
    // a live contract sharing the bare address wins the attribution
    if (bare && !criticalKeys.has(bare)) historicalByAddress.set(bare, contract)
  }

  const silenced = new Map<string, SilencedFieldHistory>()
  const ledgerGaps: string[] = []
  for (const id of projectIds) {
    for (const update of getDiscoveryUpdates(id, Number.POSITIVE_INFINITY)) {
      if (coveredUpdateIds.has(update.id)) continue
      for (const section of update.sections) {
        if (section.kind !== 'watched-changes') continue
        for (const { content } of extractDiffBlockSpans(section.body)) {
          const address = extractDiffBlockAddress(content)
          if (!address) continue

          // Historical contracts are a closed reviewed ledger: diff history is
          // inert for them, so anything counted-looking here is either
          // unconverted evidence or an unrepresented upgrade.
          const historicalContract = historicalByAddress.get(address)
          if (historicalContract) {
            const day = update.timestamp
              ? new Date(update.timestamp * 1000).toISOString().slice(0, 10)
              : '???'
            if (isImplementationChangeDiffBody(content)) {
              if ((historicalContract.upgradeTimestamps ?? []).length === 0) {
                ledgerGaps.push(
                  `${historicalContract.name ?? address}: implementation change ${day} (${update.id}) but upgradeTimestamps is empty — backfill the onchain upgrade history`,
                )
              }
              continue
            }
            for (const change of extractDiffBlockFieldChanges(content)) {
              if (!change.annotatedHigh || change.unchanged) continue
              if (
                reviewedDowngrades.has(
                  `${historicalContract.address.toLowerCase()}#${change.field.toLowerCase()}`,
                )
              ) {
                continue
              }
              ledgerGaps.push(
                `${historicalContract.name ?? address}: HIGH-annotated ${change.field} change ${day} (${update.id}) — convert to a historical criticalEvent with its onchain anchor, or acknowledge`,
              )
            }
            continue
          }

          if (!criticalKeys.has(address)) continue
          const entry = entryByAddress.get(address)
          if (!entry) continue
          for (const change of extractDiffBlockFieldChanges(content)) {
            if (!change.annotatedHigh || change.unchanged) continue
            const meta = entry.fieldMeta?.[change.field]
            if (meta?.severity === 'HIGH') continue
            if (
              reviewedDowngrades.has(
                `${entry.address?.toLowerCase()}#${change.field.toLowerCase()}`,
              )
            ) {
              continue
            }
            const key = `${entry.address}#${change.field}`
            const existing = silenced.get(key)
            const timestamp = update.timestamp ?? 0
            if (existing) {
              existing.count++
              existing.last = Math.max(existing.last, timestamp)
              existing.first = Math.min(existing.first, timestamp)
            } else {
              silenced.set(key, {
                contract: entry.address ?? address,
                name: entry.name ?? address,
                field: change.field,
                status: meta === undefined ? 'absent' : 'downgraded',
                count: 1,
                first: timestamp,
                last: timestamp,
              })
            }
          }
        }
      }
    }
  }

  if (ledgerGaps.length > 0) {
    console.log(
      'historical ledger gaps (the reviewed ledger must be complete):',
    )
    for (const gap of ledgerGaps.sort()) console.log(`  - ${gap}`)
  } else {
    console.log('historical ledger: closed')
  }

  if (silenced.size === 0) {
    console.log(
      `severity history: no unreviewed silenced annotated-HIGH events${
        reviewedDowngrades.size > 0
          ? ` (${reviewedDowngrades.size} reviewed downgrade(s))`
          : ''
      }`,
    )
    return
  }
  console.log(
    'annotated-HIGH history silenced by current severities (confirm the downgrade, or backfill via criticalEvents if the field was renamed):',
  )
  const day = (timestamp: number) =>
    new Date(timestamp * 1000).toISOString().slice(0, 10)
  for (const row of [...silenced.values()].sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    console.log(
      `  - ${row.name} ${row.field} [${row.status}] ${row.count} event(s), ${day(row.first)} .. ${day(row.last)}`,
    )
  }
}

// biome-ignore lint/suspicious/noExplicitAny: ad-hoc JSON inspection
function readJson(file: string): Record<string, any> | undefined {
  if (!existsSync(file)) return undefined
  return JSON.parse(readFileSync(file, 'utf-8'))
}

main()
