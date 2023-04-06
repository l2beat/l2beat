import { ProjectDiscovery } from '../ProjectDiscovery'

export function getProxyGovernance(
  discovery: ProjectDiscovery,
  contractIdentifier: string,
) {
  return discovery
    .getContractUpgradeabilityParam(contractIdentifier, 'proxyGovernance')
    .map(discovery.formatPermissionedAccount.bind(discovery))
}
