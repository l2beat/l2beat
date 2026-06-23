import { ProjectId } from '@l2beat/shared-pure'

/** Temporary mapping until discrepancies between chain names and project IDs are eliminated. */
export function chainToProjectId(chain: string): ProjectId {
  switch (chain) {
    case 'polygonpos':
      return ProjectId('polygon-pos')
    default:
      return ProjectId(chain)
  }
}

export function projectIdToChain(projectId: ProjectId): string {
  switch (projectId) {
    case 'polygon-pos':
      return 'polygonpos'
    default:
      return projectId
  }
}
