import { createDaTrackingId } from '@l2beat/shared'
import { join } from 'path'
import { getProjects } from '../../processing/getProjects'
import type { BaseProject, ProjectDaTrackingConfig } from '../../types'
import type {
  Range,
  Snapshot,
  SnapshotDomain,
  SnapshotIdentity,
  StoredIdentity,
} from '../types'

/**
 * The id hashes the identity fields only (inbox, sequencers, topics,
 * namespace, appIds, customerId), so a disappeared id means those fields
 * changed - typically discovery picked up a sequencer/inbox rotation through
 * the project's open helper entry (getOpStackDaTracking & co). Editing the
 * entry in place loses everything indexed under the old id; the old entry has
 * to be frozen instead. See projects/ink/ink.ts for the resulting shape.
 */
const FREEZE_RECIPE = [
  'Freeze the old configuration instead of letting it disappear:',
  "1. In the project's .ts daTracking array, turn the old entry into literals so it keeps producing exactly this id - paste the frozen entry printed below in front of the last array element. If the old entry is a helper call (getOpStackDaTracking / getOrbitStackDaTracking / getZkStackDaTracking), the pasted literal replaces nothing - the helper now derives the new configuration and stays as the open entry.",
  "2. Close it with 'untilBlock' (or 'untilTimestamp' for eigen-da) at the last block the old configuration was live - verify the exact block on-chain. If you cannot, the current discovery run's usedBlockNumbers[<chain>] in discovered.json is a safe upper bound (the change had already happened by then).",
  "3. Add the new entry with the new values as the last array element, starting where the old one ended (sinceBlock = the old entry's untilBlock). For a template stack that is the helper call again - getOpStackDaTracking(discovery, { sinceBlock }) - so the next rotation is caught the same way. If you only bracketed the change, start it at the previous discovery run's usedBlockNumbers[<chain>] (from the pre-change discovered.json) - overlaps between entries are fine, holes are not.",
  '4. If the configuration really stopped being used (the project left the layer), close it as in step 2 and do not add a new entry - a deleted entry is gone for good, a closed one is kept.',
  "5. Only then run 'pnpm snapshots:generate --overwrite' in packages/config and commit the updated snapshot as the sign-off (the plain command is append-only and keeps the old entry). Running --overwrite first 'fixes' CI and silently accepts the wipe.",
].join('\n')

/**
 * Same id, moved window. The freeze recipe does not apply here - freezing the
 * entry and re-adding it with the same identity fields yields two entries
 * with the same id.
 */
const RANGE_CHANGE_RECIPE = [
  'The id hashes the identity fields and NOT the range, so this is the same configuration with a moved window. On deploy the backend trims the indexed data to the new range: raising since or lowering/setting until deletes only the records outside it (plus up to an hour at the edited edge - records are hourly buckets); lowering since still wipes the configuration and re-indexes it from the new start. See "Editing sinceBlock / untilBlock" in docs/da-tracking.md.',
  "- If you did not intend the move: ranges are literals in the project's .ts (also in the helper calls), so find the edit that changed since/until, restore the snapshot's values and leave the snapshot alone.",
  "- If you intended it (you just closed an open entry with 'untilBlock' while freezing it, or you are deliberately correcting a range): run 'pnpm snapshots:generate --overwrite' in packages/config and commit the updated snapshot (the plain command is append-only and keeps the committed range).",
  'Do not resolve it by freezing the entry and adding a second one with the same identity fields - both would hash to the same id.',
].join('\n')

export const daTrackingDomain: SnapshotDomain = {
  name: 'da-tracking',
  snapshotPath: join(__dirname, 'snapshot.json'),
  wipeWarning:
    'On deploy the backend WILL WIPE all DA data indexed under these configurations (ManagedMultiIndexer deletes configurations whose id disappears).',
  freezeRecipe: FREEZE_RECIPE,
  rangeChangeRecipe: RANGE_CHANGE_RECIPE,
  freezeSnippet,
  hydrate,
  generate: () => generateDaTrackingIdentities(getProjects()),
}

/** See StoredIdentity: label and range are derived, never stored. */
function hydrate(stored: StoredIdentity): SnapshotIdentity {
  const config = stored.config as ProjectDaTrackingConfig
  return {
    id: stored.id,
    label: createLabel(config),
    ...getRange(config),
    config,
  }
}

/**
 * Computes the backend DA indexer configuration identities for every project,
 * including sovereign projects tracked through a DA layer's
 * sovereignProjectsTrackingConfig. The ids are the exact values the backend
 * keys indexed DA data by - see createDaTrackingId in @l2beat/shared - and the
 * ranges are the exact values it syncs between.
 */
function generateDaTrackingIdentities(projects: BaseProject[]): Snapshot {
  const result: Record<string, SnapshotIdentity[]> = {}

  const add = (projectId: string, config: ProjectDaTrackingConfig) => {
    // Deliberately no dedup - duplicate ids are a config error (colliding
    // backend configuration ids) and the guard test must see them.
    result[projectId] ??= []
    result[projectId].push({
      id: createDaTrackingId(config),
      label: createLabel(config),
      ...getRange(config),
      config,
    })
  }

  for (const project of projects) {
    for (const config of project.daTrackingConfig ?? []) {
      add(project.id, config)
    }
    for (const sovereign of project.daLayer?.sovereignProjectsTrackingConfig ??
      []) {
      for (const config of sovereign.daTrackingConfig) {
        // The backend attaches the DA layer's project id before hashing
        // (getBlockDaTrackingSovereignProjects in backend da.ts).
        add(sovereign.projectId, { daLayer: project.id, ...config })
      }
    }
  }

  return Object.fromEntries(
    Object.entries(result)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([projectId, identities]) => [
        projectId,
        identities.sort((a, b) => a.id.localeCompare(b.id)),
      ]),
  )
}

/** Blocks for the block-based layers, unix seconds for eigen-da. */
function getRange(config: ProjectDaTrackingConfig): Range {
  return config.type === 'eigen-da'
    ? { since: config.sinceTimestamp, until: config.untilTimestamp }
    : { since: config.sinceBlock, until: config.untilBlock }
}

function createLabel(config: ProjectDaTrackingConfig): string {
  switch (config.type) {
    case 'ethereum': {
      const sequencers = config.sequencers
        ? ` sequencers[${config.sequencers.length}]`
        : ''
      return `ethereum inbox ${config.inbox}${sequencers} since ${config.sinceBlock}`
    }
    case 'celestia':
      return `celestia namespace ${config.namespace} since ${config.sinceBlock}`
    case 'avail':
      return `avail appIds [${[...config.appIds].sort((a, b) => a.localeCompare(b)).join(', ')}] since ${config.sinceBlock}`
    case 'eigen-da':
      return `eigen-da customer ${config.customerId} since ${config.sinceTimestamp}`
  }
}

/**
 * A disappeared identity's config as a paste-ready array element for the
 * project's daTracking list, closed with a TODO until (step 2 of the freeze
 * recipe). Rendered from the snapshot's `config` field - after a rotation
 * the snapshot is the only surviving copy of the old values.
 */
export function freezeSnippet(identity: SnapshotIdentity): string | undefined {
  const config = identity.config as ProjectDaTrackingConfig | undefined
  if (!config) {
    return undefined
  }
  const address = (a: string) => `EthereumAddress('${a}')`
  const strings = (values: string[]) => values.map((v) => `'${v}'`).join(', ')
  const lines = [
    '    {',
    `      type: '${config.type}',`,
    `      daLayer: ProjectId('${config.daLayer}'),`,
  ]
  const untilTodo = ' // TODO step 2: last point the old configuration was live'
  if (config.type === 'eigen-da') {
    lines.push(
      `      customerId: '${config.customerId}',`,
      `      sinceTimestamp: UnixTime(${config.sinceTimestamp}),`,
      config.untilTimestamp !== undefined
        ? `      untilTimestamp: UnixTime(${config.untilTimestamp}),`
        : `      untilTimestamp: UnixTime(0),${untilTodo}`,
    )
  } else {
    lines.push(
      `      sinceBlock: ${config.sinceBlock},`,
      config.untilBlock !== undefined
        ? `      untilBlock: ${config.untilBlock},`
        : `      untilBlock: 0,${untilTodo}`,
    )
    if (config.type === 'ethereum') {
      lines.push(`      inbox: ${address(config.inbox)},`)
      if (config.sequencers) {
        lines.push(
          '      sequencers: [',
          ...config.sequencers.map((a) => `        ${address(a)},`),
          '      ],',
        )
      }
      if (config.topics) {
        lines.push(`      topics: [${strings(config.topics)}],`)
      }
    } else if (config.type === 'celestia') {
      lines.push(`      namespace: '${config.namespace}',`)
    } else {
      lines.push(`      appIds: [${strings(config.appIds)}],`)
    }
  }
  lines.push('    },')
  return lines.join('\n')
}
