import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { opStackL3 } from '../layer2s/templates/opStack'
import { Layer3 } from './types'

const discovery = new ProjectDiscovery('stack', 'base')

const upgradeability = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

export const stack: Layer3 = opStackL3({
  discovery,
  hostChain: ProjectId('base'),
  display: {
    name: 'Stack',
    slug: 'stack',
    description:
      'Stack Chain is an Optimium on Base using OP stack technology with Celestia for data availability. \
            Stack Chain is a blockchain for bringing points onchain, allowing brands to create and own their loyalty programs.',
    purposes: ['Social', 'RWA'],
    links: {
      websites: ['https://stack.so/'],
      apps: ['https://bridge.stack.so'],
      documentation: ['https://docs.stack.so'],
      explorers: ['https://explorer.stack.so'],
      repositories: ['https://github.com/stack-so/protocol-interfaces'],
      socialMedia: [
        'https://twitter.com/stackdotso',
        'https://t.me/+RVFamOmYBo42NzFh',
        'https://stack.mirror.xyz/',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  upgradeability,
  l1StandardBridgeEscrow: EthereumAddress(
    '0xbA256039AEdaD407692D8Deb366308BE6Bb2515C',
  ),
  rpcUrl: 'https://rpc.stack.so',
  genesisTimestamp: new UnixTime(1709683711),
  l2OutputOracle: discovery.getContract('L2OutputOracle'),
  portal: discovery.getContract('OptimismPortal'),
  isNodeAvailable: 'UnderReview',
  milestones: [],
  knowledgeNuggets: [],
  roleOverrides: {
    batcherHash: 'Sequencer',
    PROPOSER: 'Proposer',
    GUARDIAN: 'Guardian',
    CHALLENGER: 'Challenger',
  },
  nonTemplateEscrows: [],
  nonTemplatePermissions: [], // TODO
  nonTemplateContracts: [], // TODO
})
