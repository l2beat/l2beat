import { createDaTrackingId } from '@l2beat/shared'
import groupBy from 'lodash/groupBy'
import { join } from 'path'
import { getProjects } from '../../processing/getProjects'
import type { BaseProject, ProjectDaTrackingConfig } from '../../types'
import type {
  Range,
  Snapshot,
  SnapshotDomain,
  SnapshotIdentity,
} from '../types'
import { findDaTrackingGaps } from './gaps'

/**
 * For a config whose identity fields changed - the old id is gone for good, so
 * the old entry has to be frozen instead of edited. See the two ethereum
 * entries in projects/ink/ink.ts for a worked example (sequencer rotation).
 */
const FREEZE_RECIPE = [
  'Freeze the old configuration, do not let it disappear:',
  "1. In the project's config, replace the old entry's discovered values with the literals from the snapshot above, so its id stays exactly as it is.",
  "2. Close that entry with 'untilBlock' (or 'untilTimestamp' for eigen-da) at the last block/timestamp the old configuration was live.",
  "3. Add a new entry with the new values, starting where the old one ended. For the lower bound of the change bracket use the previous discovery run's usedBlockNumbers[<chain>] from the pre-change 'discovered.json'.",
  "4. Only then run 'pnpm snapshots:generate' in packages/config and commit the updated snapshot.",
].join('\n')

/**
 * For a config whose identity is unchanged but whose range moved. The id is a
 * hash of the identity fields only, so the "freeze and add a new entry" recipe
 * does not apply here - it would produce two entries with the same id.
 */
const RANGE_CHANGE_RECIPE = [
  'The id hashes the identity fields (inbox, sequencers, topics, namespace, appIds, customerId) and NOT the range, so this is the same configuration with a moved window. Do not freeze it and add a second entry - the two would collide on the id.',
  "If the move is unintended (usually discovery drift on a sinceBlock): pin the range by writing the snapshot's literal since/until into the project's config instead of the discovered values, and leave the snapshot alone.",
  "If the move is intended: accept it knowingly, then run 'pnpm snapshots:generate' in packages/config. Raising 'since' or lowering 'until' TRIMS the data outside the new range; lowering 'since' makes the backend re-index the configuration from scratch.",
].join('\n')

export const daTrackingDomain: SnapshotDomain = {
  name: 'da-tracking',
  snapshotPath: join(__dirname, 'snapshot.json'),
  wipeWarning:
    'On deploy the backend WILL WIPE all DA data indexed under these configurations (ManagedMultiIndexer deletes configurations whose id disappears).',
  freezeRecipe: FREEZE_RECIPE,
  rangeChangeRecipe: RANGE_CHANGE_RECIPE,
  generate: () => generateDaTrackingIdentities(getProjects()),
  findConfigViolations: () => findDaTrackingGaps(getProjects()),
}

/**
 * Computes the backend DA indexer configuration identities for every project,
 * including sovereign projects tracked through a DA layer's
 * sovereignProjectsTrackingConfig. The ids are the exact values the backend
 * keys indexed DA data by - see createDaTrackingId in @l2beat/shared.
 */
export function generateDaTrackingIdentities(
  projects: BaseProject[],
): Snapshot {
  // Deliberately no dedup - duplicate ids are a config error (colliding
  // backend configuration ids) and the guard test must see them.
  const flat: (SnapshotIdentity & { projectId: string })[] = []
  forEachDaTrackingConfig(projects, (projectId, config) => {
    flat.push({
      projectId,
      id: createDaTrackingId(config),
      label: createLabel(config),
      ...getConfigRange(config),
    })
  })

  return Object.fromEntries(
    Object.entries(groupBy(flat, (e) => e.projectId))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([projectId, identities]) => [
        projectId,
        identities
          .map(({ projectId: _, ...identity }) => identity)
          .sort((a, b) => a.id.localeCompare(b.id)),
      ]),
  )
}

/**
 * Single walk over every DA tracking configuration in the config, used by both
 * the identity snapshot and the config invariants, so they can never disagree
 * on which configs exist.
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

/**
 * The range in the config's native unit - blocks for the block-based layers,
 * unix seconds for eigen-da. Ranges are only ever compared within a single DA
 * layer, and a layer never mixes the two kinds.
 */
export function getConfigRange(config: ProjectDaTrackingConfig): Range {
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
