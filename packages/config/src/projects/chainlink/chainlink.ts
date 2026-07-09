import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'

const discovery = new ProjectDiscovery('chainlink')

export const chainlink: BaseProject = {
  id: ProjectId('chainlink'),
  slug: 'chainlink',
  name: 'Chainlink',
  shortName: undefined,
  addedAt: UnixTime(0),
  discoveryInfo: getDiscoveryInfo([discovery]),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'The Chainlink price feeds that onchain protocols read for asset prices. Each feed is a proxy in front of an OCR2 aggregator whose reported price is the median of reports signed by a quorum of oracle nodes, all administered by a Chainlink multisig that can swap the aggregator behind any feed or reconfigure the node set and the quorum size.',
    links: {
      websites: ['https://chain.link/'],
      documentation: ['https://docs.chain.link/data-feeds'],
      repositories: ['https://github.com/smartcontractkit/chainlink'],
      socialMedia: ['https://x.com/chainlink'],
    },
    badges: [],
  },
  defiInfo: {
    category: 'Oracle',
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}
