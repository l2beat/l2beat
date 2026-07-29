import { createDaTrackingId } from '@l2beat/shared'
import { join } from 'path'
import type { BaseProject, ProjectDaTrackingConfig } from '../types'

export function getDaTrackingSnapshotPath(): string {
  return join(__dirname, 'daTrackingIdentities.json')
}

export interface DaTrackingIdentity {
  id: string
  label: string
}

export type DaTrackingIdentitiesSnapshot = Record<string, DaTrackingIdentity[]>

/**
 * Computes the backend DA indexer configuration identities for every project,
 * including sovereign projects tracked through a DA layer's
 * sovereignProjectsTrackingConfig. The ids are the exact values the backend
 * keys indexed DA data by - see createDaTrackingId in @l2beat/shared.
 */
export function generateDaTrackingIdentities(
  projects: BaseProject[],
): DaTrackingIdentitiesSnapshot {
  const result: Record<string, DaTrackingIdentity[]> = {}

  const add = (projectId: string, config: ProjectDaTrackingConfig) => {
    const identity = {
      id: createDaTrackingId(config),
      label: createLabel(config),
    }
    result[projectId] ??= []
    if (!result[projectId].some((e) => e.id === identity.id)) {
      result[projectId].push(identity)
    }
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
