import { assert } from '@l2beat/shared-pure'
import type { ProjectDiscovery } from '../../../discovery/ProjectDiscovery'
import type {
  ScalingProjectPermissions,
  ScalingProjectRisk,
} from '../../../types'

export function generateDiscoveryDrivenSections(
  discovery: ProjectDiscovery,
  // TODO: remove and calculate automatically
  contractRisks: ScalingProjectRisk[],
  additionalDiscoveries?: { [chain: string]: ProjectDiscovery },
) {
  const additionalDiscoveriesSorted = additionalDiscoveries
    ? Object.entries(additionalDiscoveries).sort(([chainA], [chainB]) =>
        chainA.localeCompare(chainB),
      )
    : undefined

  return {
    addresses: discovery.getDiscoveredContracts(),
    nativeAddresses: additionalDiscoveriesSorted
      ? Object.fromEntries(
          additionalDiscoveriesSorted.map(([chain, discovery]) => [
            chain,
            discovery.getDiscoveredContracts(),
          ]),
        )
      : undefined,
    risks: contractRisks,
  }
}

export function generateDiscoveryDrivenPermissions(
  discoveries: ProjectDiscovery[],
): Record<string, ScalingProjectPermissions> {
  const result: Record<string, ScalingProjectPermissions> = {}
  for (const discovery of discoveries) {
    // NOTE(radomski): Just make sure we don't insert twice. There is a
    // talk to be had about "what about shared modules" and all of that but
    // we will cross that bridge when we come to it
    assert(!(discovery.chain in result))
    result[discovery.chain] = discovery.getDiscoveredPermissions()
  }

  return result
}
