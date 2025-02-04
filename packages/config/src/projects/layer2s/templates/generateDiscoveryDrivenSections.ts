import { assert } from '@l2beat/shared-pure'
import type { ProjectDiscovery } from '../../../discovery/ProjectDiscovery'
import type { ProjectContract, ProjectPermissions } from '../../../types'

export function generateDiscoveryDrivenContracts(
  discoveries: ProjectDiscovery[],
): Record<string, ProjectContract[]> {
  const result: Record<string, ProjectContract[]> = {}
  for (const discovery of discoveries) {
    // NOTE(radomski): Just make sure we don't insert twice. There is a
    // talk to be had about "what about shared modules" and all of that but
    // we will cross that bridge when we come to it
    assert(!(discovery.chain in result))
    result[discovery.chain] = discovery.getDiscoveredContracts()
  }

  return result
}

export function generateDiscoveryDrivenPermissions(
  discoveries: ProjectDiscovery[],
): Record<string, ProjectPermissions> {
  const result: Record<string, ProjectPermissions> = {}
  for (const discovery of discoveries) {
    // NOTE(radomski): Just make sure we don't insert twice. There is a
    // talk to be had about "what about shared modules" and all of that but
    // we will cross that bridge when we come to it
    assert(!(discovery.chain in result))
    result[discovery.chain] = discovery.getDiscoveredPermissions()
  }

  return result
}
