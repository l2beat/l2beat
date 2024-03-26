import { ProjectDiscovery } from '../ProjectDiscovery'

const discovery = new ProjectDiscovery('shared-polygon-cdk')

export function getUpgradeDelay() {
  return discovery.getContractValue<number>('Timelock', 'getMinDelay')
}

export function getTrustedAggregatorTimeout() {
  return discovery.getContractValue<number>(
    'PolygonRollupManager',
    'trustedAggregatorTimeout',
  )
}

export function getPendingStateTimeout() {
  return discovery.getContractValue<number>(
    'PolygonRollupManager',
    'pendingStateTimeout',
  )
}
