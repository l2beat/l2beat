import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { DERIVATION } from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { HARDCODED } from '../discovery/values/hardcoded'
import { formatSeconds } from '../utils/formatSeconds'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from './common/liveness'
import { opStack } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('zora')

const FINALIZATION_PERIOD_SECONDS = discovery.getContractValue<number>(
  'L2OutputOracle',
  'FINALIZATION_PERIOD_SECONDS',
)

const upgradeability = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

export const zora: Layer2 = opStack({
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
    liveness: {
      warnings: {
        stateUpdates: OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING,
      },
      explanation: `Zora is an Optimistic rollup that posts transaction data to the L1. For a transaction to be considered final, it has to be posted within a tx batch on L1 that links to a previous finalized batch. If the previous batch is missing, transaction finalization can be delayed up to ${formatSeconds(
        HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS,
      )} or until it gets published. The state root gets finalized ${formatSeconds(
        FINALIZATION_PERIOD_SECONDS,
      )} after it has been posted.`,
    },
  },
  upgradeability,
  l1StandardBridgeEscrow: EthereumAddress(
    '0x3e2Ea9B92B7E48A52296fD261dc26fd995284631',
  ),
  apiUrl: 'https://rpc.zora.co',
  sequencerAddress: EthereumAddress(
    discovery.getContractValue('SystemConfig', 'batcherHash'),
  ),
  inboxAddress: EthereumAddress('0x6F54Ca6F6EdE96662024Ffd61BFd18f3f4e34DFf'),
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
    discovery.getContractDetails('L1StandardBridge', {
      description:
        'The L1StandardBridge contract is the main entry point to deposit ERC20 tokens from L1 to L2.',
      ...upgradeability,
    }),
  ],
  nonTemplateEscrows: [],
})
