import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { opStackL3 } from '../layer2s/templates/opStack'
import { Layer3 } from './types'

const discovery = new ProjectDiscovery('syndicateframe', 'base')
const upgradeability = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}
export const syndicateframe: Layer3 = opStackL3({
  discovery,
  hostChain: ProjectId('base'),
  display: {
    name: 'Syndicate Frame Chain',
    slug: 'syndicateframe',
    description:
      'Syndicate Frame Chain is an OP Stack L3 on Base for Farcaster Frame developers.',
    purposes: ['Social', 'NFT'],
    links: {
      websites: ['https://syndicate.io/blog/syndicate-frame-chain'],
      apps: [
        'https://bridge-frame.syndicate.io/',
        'https://frame.syndicate.io/',
      ],
      documentation: ['https://docs.syndicate.io/get-started/introduction'],
      explorers: ['https://explorer-frame.syndicate.io/'],
      repositories: [
        'https://github.com/WillPapper/syndicate-farcaster-frame-starter',
      ],
      socialMedia: ['https://warpcast.com/syndicate'],
    },
    activityDataSource: 'Blockchain RPC',
  },
  upgradeability,
  l1StandardBridgeEscrow: EthereumAddress(
    '0xF7Cb313CB6D146dAbB8c5E31798BDCeFc67B831b',
  ),
  genesisTimestamp: new UnixTime(1707371473),
  l2OutputOracle: discovery.getContract('L2OutputOracle'),
  portal: discovery.getContract('OptimismPortal'),
  milestones: [],
  knowledgeNuggets: [],
  roleOverrides: {
    batcherHash: 'Sequencer',
    PROPOSER: 'Proposer',
    GUARDIAN: 'Guardian',
    CHALLENGER: 'Challenger',
  },
  isNodeAvailable: 'UnderReview',
  nonTemplateEscrows: [],
  nonTemplatePermissions: [
    {
      name: 'ProxyAdmin owner',
      description:
        'This address is the owner of the following contracts: ProxyAdmin, SystemConfig. It is also designated as a Guardian of the OptimismPortal, meaning it can halt withdrawals. It can upgrade the bridge implementation potentially gaining access to all funds, and change the sequencer, state root proposer or any other system component (unlimited upgrade power).',
      accounts: [
        discovery.formatPermissionedAccount(
          discovery.getContractValue('ProxyAdmin', 'owner'),
        ),
      ],
    },
  ],
  rpcUrl: 'https://rpc-frame.syndicate.io',
})
