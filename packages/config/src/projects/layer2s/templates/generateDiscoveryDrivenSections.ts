import { ScalingProjectRisk } from '../../../common'
import { ProjectDiscovery } from '../../../discovery/ProjectDiscovery'

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
    contracts: {
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
    },
    permissions: discovery.getDiscoveredPermissions(),
    nativePermissions: additionalDiscoveriesSorted
      ? Object.fromEntries(
          additionalDiscoveriesSorted.map(([chain, discovery]) => [
            chain,
            discovery.getDiscoveredPermissions(),
          ]),
        )
      : undefined,
  }
}
