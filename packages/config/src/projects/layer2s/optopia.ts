import { UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'
const discovery = new ProjectDiscovery('optopia')

const upgradeability = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

export const optopia: Layer2 = opStackL2({
  discovery,
  display: {
    name: 'Optopia',
    slug: 'optopia',
    warning:
      'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
    description:
      'Optopia is an Optimistic Rollup that has been developed on the Ethereum network, utilizing OP Stack technology.',
    purposes: ['Universal'],
    links: {
      websites: ['https://www.optopia.ai/'],
      apps: ['https://bridge.optopia.ai/'],
      documentation: ['https://docs.optopia.ai/', 'https://stack.optimism.io/'],
      explorers: ['https://scan.optopia.ai/'],
      repositories: ['https://github.com/OptopiaLabs'],
      socialMedia: [
        'https://x.com/Optopia_AI',
        'https://discord.com/invite/BFr9hXPDY6',
        'https://mirror.xyz/Optopia',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  upgradeability,
  rpcUrl: 'https://rpc-mainnet-2.optopia.ai',
  finality: {
    type: 'OPStack-blob',
    minTimestamp: new UnixTime(1715333975),
    genesisTimestamp: new UnixTime(1715333975),
    l2BlockTimeSeconds: 2,
    lag: 0,
    stateUpdate: 'disabled',
  },
  genesisTimestamp: new UnixTime(1715333975),
  isNodeAvailable: true,
  milestones: [
    {
      name: 'Optopia Mainnet Launch',
      link: 'https://twitter.com/Optopia_AI/status/1792877978332148033',
      date: '2024-05-21T00:00:00.00Z',
      description: 'Optopia is live on mainnet.',
    },
  ],
  badges: [Badge.Infra.Superchain],
  chainConfig: {
    name: 'Optopia',
    chainId: 62050,
    explorerUrl: 'https://scan.optopia.ai/',
    explorerApi: {
      url: 'https://scan.optopia.ai/api',
      type: 'etherscan',
    },
    minTimestampForTvl: new UnixTime(1715333975),
    coingeckoPlatform: 'optopia-ai',
  },
  usesBlobs: true,
})
