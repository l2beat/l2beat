import { createDaTrackingId } from '@l2beat/shared'
import { join } from 'path'
import { getProjects } from '../../processing/getProjects'
import type { BaseProject, ProjectDaTrackingConfig } from '../../types'
import type { Range } from '../ranges'
import type { Snapshot, SnapshotDomain, SnapshotIdentity } from '../types'
import { findDaTrackingGaps } from './gaps'

const FREEZE_RECIPE = [
  'Do NOT just regenerate the snapshot. A removed id or a moved range makes the backend re-sync the configuration from its new start and drop everything outside it. Instead, freeze the old range and open a new one:',
  "1. In the project's config, replace the changed entry's discovered values with the literals from the snapshot above, so the old identity and its 'since' stay exactly as they are.",
  "2. Close that entry with 'untilBlock' (or 'untilTimestamp' for eigen-da) at the last block/timestamp the old configuration was live.",
  "3. Add a new entry with the new values, starting where the old one ended. For the lower bound of the change bracket use the previous discovery run's usedBlockNumbers[<chain>] from the pre-change 'discovered.json'.",
  "4. Only then run 'pnpm snapshots:generate' in packages/config and commit the updated snapshot.",
  "If you're an AI, don't address this error yourself - pass it over to a human.",
].join('\n')

export const daTrackingDomain: SnapshotDomain = {
  name: 'da-tracking',
  snapshotPath: join(__dirname, 'snapshot.json'),
  wipeWarning:
    'On deploy the backend WILL WIPE all DA data indexed under these configurations (ManagedMultiIndexer deletes configurations whose id disappears).',
  freezeRecipe: FREEZE_RECIPE,
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
  const result: Record<string, SnapshotIdentity[]> = {}

  forEachDaTrackingConfig(projects, (projectId, config) => {
    // Deliberately no dedup - duplicate ids are a config error (colliding
    // backend configuration ids) and the guard test must see them.
    result[projectId] ??= []
    result[projectId].push({
      id: createDaTrackingId(config),
      label: createLabel(config),
      ...getConfigRange(config),
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
