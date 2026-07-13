import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('chainlink')

const ocrQuorum = (aggregator: string): string => {
  const { f, signers } = discovery.getContractValue<{
    f: number
    signers: string[]
  }>(aggregator, 'ocrConfig')
  return `${f + 1} of ${signers.length}`
}

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
    detailedDescription: readProjectMarkdown(
      'chainlink',
      'detailedDescription',
      {
        ethUsdQuorum: ocrQuorum('Chainlink_ETH_USD_Aggregator'),
        stethUsdQuorum: ocrQuorum('Chainlink_stETH_USD_Aggregator'),
        rethEthQuorum: ocrQuorum('Chainlink_rETH_ETH_Aggregator'),
        safeStats: discovery.getMultisigStats('ChainlinkOracleMultisig'),
        minAnswer: discovery.getContractValue<number>(
          'Chainlink_ETH_USD_Aggregator',
          'minAnswer',
        ),
      },
    ),
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
