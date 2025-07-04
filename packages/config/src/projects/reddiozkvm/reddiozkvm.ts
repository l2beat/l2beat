import {
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'

import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
  STATE_VALIDATION,
  TECHNOLOGY_DATA_AVAILABILITY,
  STATE_ZKP_SN
} from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import {
  getCommittee,
  getProxyGovernance,
  getSHARPVerifierContracts,
  getSHARPVerifierGovernors,
  getSHARPVerifierUpgradeDelay,
} from '../../discovery/starkware'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { formatExecutionDelay } from '../../common/formatDelays'
import { delayDescriptionFromString } from '../../utils/delayDescription'

const discovery = new ProjectDiscovery('reddiozkvm')
const finalizationPeriod = 0

const { committeePermission, minSigners } = getCommittee(discovery)

export const reddiozkvm: ScalingProject = {
  type: 'layer2',
  id: ProjectId('reddiozkvm'),
  addedAt: UnixTime(1684838286), // 2023-05-23T10:38:06Z
  capability: 'universal',
  badges: [
    BADGES.VM.EVM,
    BADGES.DA.EthereumBlobs
  ],
  display: {
    name: 'Reddio',
    slug: 'Reddio',
    description:
      'Reddio proudly announces the launch of its Mainnet Alpha, bringing the world’s first GPU-Accelerated Parallel EVM architecture to live production. Purpose-built for compute-intensive and AI-native applications, Reddio opens a new frontier of speed and programmability within Ethereum’s ecosystem.',
    purposes: ['Universal'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://reddio.com/'],
      bridges: [
        'https://reddio.com/explore',
        'https://dashboard.reddio.com',
        'https://bridge.reddio.com',
        'https://reddio.com/redSonic'
      ],
      documentation: ['https://docs.reddio.com/'],
      explorers: ['https://explorer.reddio.com/'],
      repositories: ['https://github.com/reddio-com/reddio'],
      socialMedia: [
        'https://twitter.com/reddio_com',
        'https://facebook.com/reddiocom',
        'https://linkedin.com/company/reddio',
        'https://discord.com/invite/SjNAJ4qkK3',
      ],
    },
  },
  stage: {
    stage: 'NotApplicable',
  },
  config: {
    escrows: [
      // discovery.getEscrowDetails({
      //   address: EthereumAddress('0x4315990d9eeaffdfafd49958b4851f203fa1126f'),
      //   name: 'Vault',
      //   tokens: ['ETH', 'rsvEth', 'USDT', 'rsvUSDt'],
      //   description: 'Vault contract, used also as an escrow.',
      // }),
      // discovery.getEscrowDetails({
      //   address: EthereumAddress('0xCc0a76eE23BBc536b0A72C965C1b76289A48D7D4'),
      //   tokens: ['ETH', 'RDO', 'USDT'],
      //   description: 'Bridge contract, used also as an escrow.',
      // }),
    ],
    /*
    transactionApi: {
      type: 'starkex',
      product: ['reddio'],
      sinceTimestamp: UnixTime(1615389188),
      resyncLastDays: 7,
    },
    */
  },
  dataAvailability: {
    layer: DA_LAYERS.DAC,
    bridge: DA_BRIDGES.DAC_MEMBERS({
      membersCount: committeePermission.accounts.length,
      requiredSignatures: minSigners,
    }),
    mode: DA_MODES.STATE_DIFFS,
  },
  riskView: {
    stateValidation: RISK_VIEW.STATE_NONE,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW_NON_UPGRADABLE,
    sequencerFailure: RISK_VIEW.SEQUENCER_SELF_SEQUENCE(0),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  stateValidation: {
    categories: [],
  },
  technology: {
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_BLOB_OR_CALLDATA,
    },
    operator: {
      ...OPERATOR.CENTRALIZED_SEQUENCER,
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.CANONICAL_ORDERING('smart contract'),
    },
    exitMechanisms: [ ]
  },
  contracts: {
    addresses: {
      [discovery.chain]: [
      ],
    },
    risks: [
    ],
  },
  permissions: {
    [discovery.chain]: discovery.getDiscoveredPermissions(),
  },
  milestones: [
    {
      title: 'Reddio Announces Mainnet Launch',
      url: 'https://blog.reddio.com/announces-layer2-zkrollup-mainnet-launch/',
      date: '2022-09-29T00:00:00Z',
      description: 'Reddio announces its Validium Mainnet launch.',
      type: 'general',
    },
  ],
  discoveryInfo: getDiscoveryInfo([discovery]),
}
