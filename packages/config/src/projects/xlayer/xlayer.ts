import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
} from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('xlayer')
const bridge = discovery.getContract('PolygonSharedBridge')

export const xlayer: ScalingProject = {
  addedAt: UnixTime(1713983341), // 2024-04-24T18:29:01Z
  badges: [BADGES.DA.CustomDA, BADGES.Infra.Agglayer, BADGES.RaaS.Gateway],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.SMALL_DAC,
    REASON_FOR_BEING_OTHER.NO_PROOFS,
  ],
  display: {
    name: 'X Layer',
    slug: 'xlayer',
    description:
      'X Layer is a Layer 2 by OKX with seamless integration with OKX products. It is powered by the Polygon CDK.',
    links: {
      websites: ['https://okx.com/xlayer'],
      documentation: [
        'https://web3.okx.com/xlayer/docs/users/welcome/about-x-layer',
      ],
      explorers: ['https://okx.com/explorer/xlayer'],
      socialMedia: ['https://twitter.com/XLayerOfficial'],
    },
    category: 'Other',
    purposes: ['Universal'],
  },
  dataAvailability: {
    layer: DA_LAYERS.NONE,
    bridge: DA_BRIDGES.NONE,
    mode: { value: 'None' },
  },
  config: {
    associatedTokens: ['OKB'],
    escrows: [
      discovery.getEscrowDetails({
        address: bridge.address,
        tokens: '*',
        sinceTimestamp: UnixTime(1712620800),
        sharedEscrow: {
          type: 'AggLayer',
          nativeAsset: 'etherWrapped',
          wethAddress: EthereumAddress(
            '0x5a77f1443d16ee5761d310e38b62f77f726bc71c',
          ),
          tokensToAssignFromL1: ['OKB'],
        },
      }),
    ],
    activityConfig: {
      type: 'block',
      startBlock: 1,
    },
  },
  chainConfig: {
    name: 'xlayer',
    chainId: 196,
    explorerUrl: 'https://rpc.xlayer.tech',
    gasTokens: ['OKB'],
    sinceTimestamp: UnixTime(1711782180),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 47416,
        version: '3',
      },
    ],
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.xlayer.tech',
        callsPerMinute: 1500,
      },
    ],
  },
  milestones: [
    {
      title: 'Migration to Pessimistic Proofs',
      url: 'https://etherscan.io/tx/0xab579dbf426db0badfaef925504105088f3300b51f1362a4084c57d7e13c0fb1#eventlog',
      date: '2025-08-05',
      description:
        'X Layer stops validating the full L2 state and moves to bridge accounting proofs.',
      type: 'general',
    },
    {
      title: 'X Layer Public Launch',
      url: 'https://x.com/XLayerOfficial/status/1780056275898048562',
      date: '2024-04-16',
      description: 'X Layer is live on mainnet, integrated with Agglayer.',
      type: 'general',
    },
  ],
  type: 'layer2',
  id: ProjectId('xlayer'),
  capability: 'universal',
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_NONE,
      description:
        "Currently the system permits invalid state roots. 'Pessimistic' proofs only validate the bridge accounting.",
    },
    dataAvailability: RISK_VIEW.DATA_EXTERNAL,
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, 0),
    sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM(false),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
  },
  stage: {
    stage: 'NotApplicable',
  },
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
