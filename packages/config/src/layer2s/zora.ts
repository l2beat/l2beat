import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { DERIVATION } from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('zora')

const upgradeability = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

export const zora: Layer2 = opStackL2({
  discovery,
  display: {
    name: 'Zora',
    slug: 'zora',
    warning:
      'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
    description:
      'Zora is a fast, cost-efficient, and scalable Layer 2 built to help bring media onchain, powered by the OP Stack.',
    purposes: ['Universal', 'NFT'],
    links: {
      websites: ['https://zora.energy/', 'https://zora.co/'],
      apps: [],
      documentation: ['https://docs.zora.co/docs/zora-network/intro'],
      explorers: [
        'https://explorer.zora.energy/',
        'https://zora.superscan.network',
      ],
      repositories: ['https://github.com/ourzora/optimism'],
      socialMedia: [
        'https://twitter.com/ourZORA',
        'https://instagram.com/our.zora',
        'https://zora.community',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  upgradeability,
  l1StandardBridgeEscrow: EthereumAddress(
    '0x3e2Ea9B92B7E48A52296fD261dc26fd995284631',
  ),
  rpcUrl: 'https://rpc.zora.co',
  finality: {
    type: 'OPStack-blob',
    genesisTimestamp: new UnixTime(1686693839),
    minTimestamp: new UnixTime(1710386579),
    l2BlockTimeSeconds: 2,
    lag: 0,
  },
  genesisTimestamp: new UnixTime(1686695915),
  l2OutputOracle: discovery.getContract('L2OutputOracle'),
  portal: discovery.getContract('OptimismPortal'),
  stateDerivation: DERIVATION.OPSTACK('ZORA'),
  isNodeAvailable: true,
  milestones: [
    {
      name: 'Zora Network Launch',
      link: 'https://twitter.com/ourZORA/status/1671602234994622464',
      date: '2023-06-21T00:00:00Z',
      description: 'Zora Network is live on mainnet.',
    },
  ],
  knowledgeNuggets: [],
  roleOverrides: {
    batcherHash: 'Sequencer',
    PROPOSER: 'Proposer',
    GUARDIAN: 'Guardian',
    CHALLENGER: 'Challenger',
  },
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'ZoraMultisig',
      'This address is the owner of the following contracts: ProxyAdmin, SystemConfig. It is also designated as a Guardian of the OptimismPortal, meaning it can halt withdrawals. It can upgrade the bridge implementation potentially gaining access to all funds, and change the sequencer, state root proposer or any other system component (unlimited upgrade power).',
    ),
    ...discovery.getMultisigPermission(
      'ChallengerMultisig',
      'This address is the permissioned challenger of the system. It can delete non finalized roots without going through the fault proof process.',
    ),
  ],
  nonTemplateContracts: [
    discovery.getContractDetails('L1ERC721Bridge', {
      description:
        'The L1ERC721Bridge contract is the main entry point to deposit ERC721 tokens from L1 to L2.',
      ...upgradeability,
    }),
  ],
  nonTemplateEscrows: [],
  usesBlobs: true,
})
