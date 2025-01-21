import type { ProjectDiscovery } from '../ProjectDiscovery'

export function getProxyGovernance(
  discovery: ProjectDiscovery,
  contractIdentifier: string,
) {
  return discovery
    .get$Admins(contractIdentifier)
    .map(discovery.formatPermissionedAccount.bind(discovery))
}
