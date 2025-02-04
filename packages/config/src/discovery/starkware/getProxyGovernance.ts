import type { ProjectDiscovery } from '../ProjectDiscovery'

export function getProxyGovernance(
  discovery: ProjectDiscovery,
  contractIdentifier: string,
) {
  return discovery.formatPermissionedAccounts(
    discovery.get$Admins(contractIdentifier),
  )
}
