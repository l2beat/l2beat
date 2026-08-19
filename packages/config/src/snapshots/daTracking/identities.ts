import { createDaTrackingId } from '@l2beat/shared'
import { join } from 'path'
import { getProjects } from '../../processing/getProjects'
import type { BaseProject, ProjectDaTrackingConfig } from '../../types'
import type {
  Range,
  Snapshot,
  SnapshotDomain,
  SnapshotIdentity,
} from '../types'

/**
 * The id hashes the identity fields only (inbox, sequencers, topics,
 * namespace, appIds, customerId), so a disappeared id means those fields
 * changed - typically discovery picked up a sequencer/inbox rotation. Editing
 * the entry in place loses everything indexed under the old id; the old entry
 * has to be frozen instead. See projects/ink/ink.ts for the resulting shape.
 */
const FREEZE_RECIPE = [
  'Freeze the old configuration instead of letting it disappear:',
  "1. In the project's .ts, turn the old entry into literals: copy the values it had before the change (inbox, sequencers/topics, namespace, appIds, customerId, since) from git history - the pre-change discovered.json or project .ts; the snapshot line above tells you which entry it is - so it keeps producing exactly this id. If the entry came from a template, move it to nonTemplateDaTracking.",
  "2. Close it with 'untilBlock' (or 'untilTimestamp' for eigen-da) at the last block the old configuration was live - verify the exact block on-chain. If you cannot, the current discovery run's usedBlockNumbers[<chain>] in discovered.json is a safe upper bound (the change had already happened by then).",
  "3. Add the new entry with the new values, starting where the old one ended (sinceBlock = the old entry's untilBlock). If you only bracketed the change, start it at the previous discovery run's usedBlockNumbers[<chain>] (from the pre-change discovered.json) - overlaps between entries are fine, holes are not.",
  '4. If the configuration really stopped being used (the project left the layer), close it as in step 2 and do not add a new entry - a deleted entry is gone for good, a closed one is kept.',
  "5. Only then run 'pnpm snapshots:generate' in packages/config and commit the updated snapshot as the sign-off. Regenerating it first 'fixes' CI and silently accepts the wipe.",
].join('\n')

/**
 * Same id, moved window. The freeze recipe does not apply here - freezing the
 * entry and re-adding it with the same identity fields yields two entries
 * with the same id.
 */
const RANGE_CHANGE_RECIPE = [
  'The id hashes the identity fields and NOT the range, so this is the same configuration with a moved window. The DA indexers have no trimData support yet, so on deploy ANY range change - closing an entry with untilBlock included - wipes the configuration and re-indexes it from its since; that is slow and only lossless where the layer still serves the old data.',
  "- If you did not intend the move (usually discovery drift on a sinceBlock): pin the range by writing the snapshot's since/until into the project's .ts as literals instead of the discovered values, and leave the snapshot alone.",
  "- If you intended it (you just closed an open entry with 'untilBlock' while freezing it, or you are deliberately correcting a range): run 'pnpm snapshots:generate' in packages/config and commit the updated snapshot.",
  'Do not resolve it by freezing the entry and adding a second one with the same identity fields - both would hash to the same id.',
].join('\n')

export const daTrackingDomain: SnapshotDomain = {
  name: 'da-tracking',
  snapshotPath: join(__dirname, 'snapshot.json'),
  wipeWarning:
    'On deploy the backend WILL WIPE all DA data indexed under these configurations (ManagedMultiIndexer deletes configurations whose id disappears).',
  freezeRecipe: FREEZE_RECIPE,
  rangeChangeRecipe: RANGE_CHANGE_RECIPE,
  generate: () => generateDaTrackingIdentities(getProjects()),
}

/**
 * Computes the backend DA indexer configuration identities for every project,
 * including sovereign projects tracked through a DA layer's
 * sovereignProjectsTrackingConfig. The ids are the exact values the backend
 * keys indexed DA data by - see createDaTrackingId in @l2beat/shared - and the
 * ranges are the exact values it syncs between.
 */
export function generateDaTrackingIdentities(
  projects: BaseProject[],
): Snapshot {
  const result: Record<string, SnapshotIdentity[]> = {}
  forEachDaTrackingConfig(projects, (projectId, config) => {
    // Deliberately no dedup - duplicate ids are a config error (colliding
    // backend configuration ids) and the guard test must see them.
    result[projectId] ??= []
    result[projectId].push({
      id: createDaTrackingId(config),
      label: createLabel(config),
      ...getRange(config),
    })
  })

  return Object.fromEntries(
    Object.entries(result)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([projectId, identities]) => [
        projectId,
        identities.sort((a, b) => a.id.localeCompare(b.id)),
      ]),
  )
}

/**
 * The single walk over every DA tracking configuration, shared by the
 * snapshot and the coverage check so they can never disagree on which
 * configs exist.
 */
export function forEachDaTrackingConfig(
  projects: BaseProject[],
  callback: (projectId: string, config: ProjectDaTrackingConfig) => void,
): void {
  for (const project of projects) {
    for (const config of project.daTrackingConfig ?? []) {
      callback(project.id, config)
    }
    for (const sovereign of project.daLayer?.sovereignProjectsTrackingConfig ??
      []) {
      for (const config of sovereign.daTrackingConfig) {
        // The backend attaches the DA layer's project id before hashing
        // (getBlockDaTrackingSovereignProjects in backend da.ts).
        callback(sovereign.projectId, { daLayer: project.id, ...config })
      }
    }
  }
}

/** Blocks for the block-based layers, unix seconds for eigen-da. */
export function getRange(config: ProjectDaTrackingConfig): Range {
  return config.type === 'eigen-da'
    ? { since: config.sinceTimestamp, until: config.untilTimestamp }
    : { since: config.sinceBlock, until: config.untilBlock }
}

export function createLabel(config: ProjectDaTrackingConfig): string {
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
