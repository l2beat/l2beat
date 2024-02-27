import { EthereumAddress, formatSeconds, UnixTime } from '@l2beat/shared-pure'

import { DERIVATION } from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { HARDCODED } from '../discovery/values/hardcoded'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from './common/liveness'
import { opStack } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('karak')

const FINALIZATION_PERIOD_SECONDS = discovery.getContractValue<number>(
  'L2OutputOracle',
  'FINALIZATION_PERIOD_SECONDS',
)

const upgradeability = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

export const karak: Layer2 = opStack({
  discovery,
  display: {
    name: 'Karak',
    slug: 'karak',
    warning:
      'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
    description: 'Karak is ....',
    purposes: ['Universal', 'NFT'],
    links: {
      websites: ['https://zora.energy/', 'https://zora.co/'], //TODO: change this
      apps: [],
      documentation: ['https://docs.zora.co/docs/zora-network/intro'], //TODO: change this
      explorers: [
        'https://explorer.zora.energy/', //TODO: change this
        'https://zora.superscan.network', //TODO: change this
      ],
      repositories: ['https://github.com/ourzora/optimism'], //TODO: change this
      socialMedia: [
        'https://twitter.com/ourZORA', //TODO: change this
        'https://instagram.com/our.zora', //TODO: change this
        'https://zora.community', //TODO: change this
      ],
    },
    activityDataSource: 'Blockchain RPC',
    liveness: {
      warnings: {
        stateUpdates: OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING,
      },
      explanation: `Karak is an Optimistic rollup that posts transaction data to the L1. For a transaction to be considered final, it has to be posted within a tx batch on L1 that links to a previous finalized batch. If the previous batch is missing, transaction finalization can be delayed up to ${formatSeconds(
        HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS,
      )} or until it gets published. The state root gets finalized ${formatSeconds(
        FINALIZATION_PERIOD_SECONDS,
      )} after it has been posted.`,
    },
    finality: {
      finalizationPeriod: FINALIZATION_PERIOD_SECONDS,
    },
  },
  upgradeability,
  l1StandardBridgeEscrow: EthereumAddress(
    '0xBA61F25dd9f2d5f02D01B1C2c1c5F0B14c4B48A3',
  ),
  rpcUrl: 'https://rpc.zora.co', //TODO: change this
  finality: {
    type: 'OPStack',
    lag: 0,
  },
  genesisTimestamp: new UnixTime(1686695915), //TODO: change this
  l2OutputOracle: discovery.getContract('L2OutputOracle'),
  portal: discovery.getContract('OptimismPortal'),
  isNodeAvailable: true,
  milestones: [],
  knowledgeNuggets: [],
  roleOverrides: {
    batcherHash: 'Sequencer',
    PROPOSER: 'Proposer',
    GUARDIAN: 'Guardian',
    CHALLENGER: 'Challenger',
  },
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'KARAKMultisig',
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
})
