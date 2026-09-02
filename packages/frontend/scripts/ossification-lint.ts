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
 * The timestamp audit re-derives every tx-anchored criticalEvent date from its
 * transaction receipt. A hand-curated entry that carries a neighbouring row's
 * timestamp is invisible to every other check but silently misdates the clock
 * and the change rate, so it is verified against the chain.
 *
 * Usage: npx tsx scripts/ossification-lint.ts <projectId> [<projectId> ...]
 *          [--no-timestamps]   skip the onchain timestamp audit (offline runs)
 */
import type {
  DiscoveryChangelog,
  DiscoveryChangelogEntry,
  DiscoveryChangelogField,
} from '@l2beat/shared'
import { formatSeconds } from '@l2beat/shared-pure'
import { existsSync, readFileSync } from 'fs'
import path from 'path'
import {
  appendedUpgradeTimestamp,
  canonicalDiffField,
  isImplementationChangeField,
  isRepresentationOnly,
} from '~/server/features/projects/ossification/changelogFields'
import {
  collectEscrowSeeds,
  type DiscoveredEntryLite,
  deriveOssificationPerimeter,
  getTrackedTxSeeds,
} from '~/server/features/projects/ossification/getOssificationPerimeter'
import { ps } from '~/server/projects'
import {
  getRpcUrl,
  getRpcUrlForChain,
  getTransactionTimestamps,
} from './ossificationRpc'

async function main() {
  const ids = process.argv.slice(2).filter((arg) => !arg.startsWith('--'))
  const checkTimestamps = !process.argv.includes('--no-timestamps')
  if (ids.length === 0) {
    console.error(
      'usage: ossification-lint.ts <projectId> [...] [--no-timestamps]',
    )
    process.exit(1)
  }
  const projects = await ps.getProjects({
    optional: ['trackedTxsConfig', 'chainConfig'],
  })

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
    if (checkTimestamps) {
      await auditEventTimestamps(id, project?.chainConfig?.name)
    }
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

/** Objective errors (as opposed to the advisory worklist rows) that should
 *  fail a scripted run. */
let hasHardFailure = false

interface AnchoredEvent {
  hash: string
  chain: string
  timestamp: number
  contract?: string
}

/** Re-derives every tx-anchored criticalEvent timestamp from its transaction.
 *  Nothing else in the pipeline can catch a mis-transcribed date: the runtime
 *  trusts the number, and it moves both the clock and the change rate. An
 *  attributed event is looked up on its contract's chain; a project-level one
 *  (a governance action on an excluded actor shell) on mainnet, falling back
 *  to the project's own chain, where its L2 Safes live. */
async function auditEventTimestamps(projectId: string, ownChain?: string) {
  const ossification = readJson(
    path.join(
      process.cwd(),
      '../config/src/projects',
      projectId,
      'ossification.json',
    ),
  )
  const events =
    (ossification?.criticalEvents as
      | { timestamp?: number; source?: string; contract?: string }[]
      | undefined) ?? []
  const anchored: AnchoredEvent[] = events.flatMap((event) => {
    const hash = /^tx:(0x[0-9a-fA-F]{64})$/.exec(event.source ?? '')?.[1]
    if (!hash || typeof event.timestamp !== 'number') return []
    return [
      {
        hash: hash.toLowerCase(),
        chain: event.contract?.split(':')[0] ?? 'eth',
        timestamp: event.timestamp,
        contract: event.contract,
      },
    ]
  })
  if (anchored.length === 0) {
    console.log('event timestamps: no tx-anchored events')
    return
  }

  const byChain = new Map<string, AnchoredEvent[]>()
  for (const event of anchored) {
    byChain.set(event.chain, [...(byChain.get(event.chain) ?? []), event])
  }

  const problems: string[] = []
  const unchecked: string[] = []
  let verified = 0
  const lookUp = async (
    rpcUrl: string,
    chain: string,
    chainEvents: AnchoredEvent[],
  ) => {
    try {
      return await getTransactionTimestamps(
        rpcUrl,
        chainEvents.map((event) => event.hash),
      )
    } catch (error) {
      unchecked.push(
        `${chainEvents.length} on ${chain} (RPC error: ${error instanceof Error ? error.message : String(error)})`,
      )
      return undefined
    }
  }
  for (const [chain, chainEvents] of byChain) {
    const rpcUrl = getRpcUrl(chain)
    if (!rpcUrl) {
      unchecked.push(`${chainEvents.length} on ${chain} (no RPC configured)`)
      continue
    }
    const timestamps = await lookUp(rpcUrl, chain, chainEvents)
    if (!timestamps) continue

    // Project-level events carry no chain: retry the misses where the
    // project's own governance contracts live.
    const missed = chainEvents.filter(
      (event) => !event.contract && !timestamps.get(event.hash),
    )
    const fallbackUrl = ownChain ? getRpcUrlForChain(ownChain) : undefined
    if (missed.length > 0 && ownChain && fallbackUrl) {
      const fallback = await lookUp(fallbackUrl, ownChain, missed)
      for (const [hash, timestamp] of fallback ?? []) {
        if (timestamp !== null) timestamps.set(hash, timestamp)
      }
    }

    for (const event of chainEvents) {
      const onchain = timestamps.get(event.hash)
      const label = `${event.contract ? `${event.contract} ` : ''}tx:${event.hash.slice(0, 12)}`
      if (onchain === null || onchain === undefined) {
        // Neither chain knows the hash: a wrong guess or a bad anchor, but
        // only a human can tell which, so it is reported rather than failed.
        unchecked.push(
          `${label} (not found on ${chain}${ownChain && ownChain !== chain ? ` or ${ownChain}` : ''})`,
        )
        continue
      }
      if (onchain !== event.timestamp) {
        hasHardFailure = true
        problems.push(
          `${label} declared ${day(event.timestamp)} (${event.timestamp}) but the transaction is ${day(onchain)} (${onchain}), off by ${formatSeconds(Math.abs(onchain - event.timestamp))}`,
        )
        continue
      }
      verified++
    }
  }

  if (problems.length > 0) {
    console.log('event timestamp mismatches (declared vs transaction):')
    for (const problem of problems.sort()) console.log(`  - ${problem}`)
  } else {
    console.log(
      `event timestamps: ok (${verified} tx-anchored)${
        unchecked.length > 0 ? `, ${unchecked.length} unchecked` : ''
      }`,
    )
  }
  for (const skipped of unchecked) console.log(`  ~ unchecked: ${skipped}`)
}

const day = (timestamp: number) =>
  new Date(timestamp * 1000).toISOString().slice(0, 10)

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
  const criticalEvents =
    (ossification?.criticalEvents as
      | {
          updateId?: string
          contract?: string
          historical?: boolean
          source?: string
        }[]
      | undefined) ?? []
  /** Same granularity as the runtime's getSupersededUpdates: a reviewed event
   *  replaces the mechanical diff events of its update for ONE contract, so
   *  the audit must keep looking at the update's other contracts. */
  const supersededByUpdate = new Map<string, Set<string>>()
  for (const event of criticalEvents) {
    if (!event.updateId || !event.contract) continue
    const contracts =
      supersededByUpdate.get(event.updateId) ?? new Set<string>()
    const key = event.contract.toLowerCase()
    contracts.add(key)
    const bare = key.split(':').at(-1)
    if (bare) contracts.add(bare)
    supersededByUpdate.set(event.updateId, contracts)
  }
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

  // criticalEvents integrity: an attributed event whose contract does not
  // resolve, or whose updateId matches no update, is SILENTLY inert at
  // runtime (no event, no supersession) — always a mistake worth a report.
  const knownUpdateIds = new Set<string>()
  const updatesByProject = new Map(
    projectIds.map((id) => {
      const changelog = readJson(path.join(root, id, 'changelog.json')) as
        | DiscoveryChangelog
        | undefined
      const updates: DiscoveryChangelogEntry[] = changelog?.entries ?? []
      for (const update of updates) knownUpdateIds.add(update.id)
      return [id, updates] as const
    }),
  )
  const eventIssues: string[] = []
  for (const event of criticalEvents) {
    const label = event.source ?? event.updateId ?? '?'
    if (event.contract) {
      const key = event.contract.toLowerCase()
      const resolved = event.historical
        ? historicalByAddress.has(key)
        : criticalKeys.has(key)
      if (!resolved) {
        eventIssues.push(
          `contract ${event.contract} (${label}) does not resolve to a ${
            event.historical ? 'historical' : 'current critical'
          } contract — the event is silently dropped by the runtime`,
        )
      }
    }
    if (event.updateId && !knownUpdateIds.has(event.updateId)) {
      eventIssues.push(
        `updateId ${event.updateId} (${label}) matches no discovery update — tagging and supersession silently no-op`,
      )
    }
  }
  if (eventIssues.length > 0) {
    console.log('criticalEvents integrity problems:')
    for (const issue of eventIssues.sort()) console.log(`  - ${issue}`)
  } else {
    console.log(`criticalEvents integrity: ok (${criticalEvents.length})`)
  }

  const silenced = new Map<string, SilencedFieldHistory>()
  const ledgerGaps: string[] = []
  /** The recorded severity is the judgment frozen at review time; the runtime
   *  ignores it, so a HIGH recorded then and not HIGH now is silenced. */
  const annotatedHigh = (field: DiscoveryChangelogField) =>
    field.severity === 'HIGH' && !isRepresentationOnly(field)
  for (const id of projectIds) {
    for (const update of updatesByProject.get(id) ?? []) {
      const superseded = supersededByUpdate.get(update.id)
      for (const change of update.changes) {
        const address = change.address
        if (superseded?.has(address)) continue
        const fields = change.fields ?? []

        // Historical contracts are a closed reviewed ledger: diff history is
        // inert for them, so anything counted-looking here is either
        // unconverted evidence or an unrepresented upgrade.
        const historicalContract = historicalByAddress.get(address)
        if (historicalContract) {
          const day = update.timestamp
            ? new Date(update.timestamp * 1000).toISOString().slice(0, 10)
            : '???'
          if (fields.some(isImplementationChangeField)) {
            const ledger = historicalContract.upgradeTimestamps ?? []
            // The appended $pastUpgrades entries carry exact onchain
            // timestamps; each must be represented in the closed ledger —
            // a non-empty but incomplete ledger is still a gap.
            const unrepresented = fields
              .map(appendedUpgradeTimestamp)
              .filter(
                (timestamp): timestamp is number =>
                  timestamp !== undefined && !ledger.includes(timestamp),
              )
            if (ledger.length === 0) {
              ledgerGaps.push(
                `${historicalContract.name ?? address}: implementation change ${day} (${update.id}) but upgradeTimestamps is empty — backfill the onchain upgrade history`,
              )
            } else if (unrepresented.length > 0) {
              ledgerGaps.push(
                `${historicalContract.name ?? address}: onchain upgrade(s) ${unrepresented
                  .map((timestamp) =>
                    new Date(timestamp * 1000).toISOString().slice(0, 10),
                  )
                  .join(', ')} (${update.id}) missing from upgradeTimestamps`,
              )
            }
            continue
          }
          for (const field of fields) {
            const name = canonicalDiffField(field.key)
            if (!name || !annotatedHigh(field)) continue
            if (
              reviewedDowngrades.has(
                `${historicalContract.address.toLowerCase()}#${name.toLowerCase()}`,
              )
            ) {
              continue
            }
            ledgerGaps.push(
              `${historicalContract.name ?? address}: HIGH-annotated ${name} change ${day} (${update.id}) — convert to a historical criticalEvent with its onchain anchor, or acknowledge`,
            )
          }
          continue
        }

        if (!criticalKeys.has(address)) continue
        const entry = entryByAddress.get(address)
        if (!entry) continue
        for (const field of fields) {
          const name = canonicalDiffField(field.key)
          if (!name || !annotatedHigh(field)) continue
          const meta = entry.fieldMeta?.[name]
          if (meta?.severity === 'HIGH') continue
          if (
            reviewedDowngrades.has(
              `${entry.address?.toLowerCase()}#${name.toLowerCase()}`,
            )
          ) {
            continue
          }
          const key = `${entry.address}#${name}`
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
              field: name,
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

main().then(() => {
  // advisory rows are for a human to weigh; a wrong timestamp anchor is not
  process.exit(hasHardFailure ? 1 : 0)
})
