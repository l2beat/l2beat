import merge from 'lodash/merge'
import type { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import type { ProjectContract, ProjectPermissions } from '../types'

export function generateDiscoveryDrivenContracts(
  discoveries: ProjectDiscovery[],
): Record<string, ProjectContract[]> {
  let result: Record<string, ProjectContract[]> = {}
  for (const discovery of discoveries) {
    result = merge(result, discovery.getDiscoveredContracts())
  }

  return result
}

export function generateDiscoveryDrivenPermissions(
  discoveries: ProjectDiscovery[],
): Record<string, ProjectPermissions> {
  let result: Record<string, ProjectPermissions> = {}
  for (const discovery of discoveries) {
    result = merge(result, discovery.getDiscoveredPermissions())
  }

  return result
}
