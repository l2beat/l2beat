import { UnixTime } from '@l2beat/shared-pure'
import {
  DA_BRIDGES,
  DA_LAYERS,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
} from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { polygonCDKStack } from '../../templates/polygonCDKStack'
import { PolygoncdkDAC } from '../../templates/polygoncdk-template'

const discovery = new ProjectDiscovery('wirex')
const bridge = discovery.getContract('PolygonSharedBridge')

const membersCountDAC = discovery.getContractValue<number>(
  'PolygonDataCommittee',
  'getAmountOfMembers',
)

const requiredSignaturesDAC = discovery.getContractValue<number>(
  'PolygonDataCommittee',
  'requiredAmountOfSignatures',
)

const isForcedBatchDisallowed =
  discovery.getContractValue<string>('Validium', 'forceBatchAddress') !==
  '0x0000000000000000000000000000000000000000'

export const wirex: ScalingProject = polygonCDKStack({
  addedAt: UnixTime(1720180654), // 2024-07-05T11:57:34Z
  archivedAt: UnixTime(1742774400), // 2025-03-24T00:00:00.000Z,
  additionalBadges: [BADGES.DA.DAC, BADGES.RaaS.Gateway],
  additionalPurposes: ['Payments'],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.SMALL_DAC],
  display: {
    name: 'Pay Chain',
    slug: 'wirex',
    description:
      'Pay Chain is a Validium built on the Polygon CDK stack. It is used as the infrastructure for the Wirex non-custodial debit cards.',
    links: {
      websites: ['https://wirexpaychain.com/'],
      bridges: ['https://pay-chain-bridge.wirexpaychain.com/'],
      documentation: ['https://docs.wirexpaychain.com/tech/wirex-pay-chain'],
      explorers: ['https://pay-chain-blockscout.wirexpaychain.com/'],
      socialMedia: [
        'https://x.com/wirexpaychain',
        'https://discord.gg/f8UGp4dH6g',
        'https://wirexpaychain.com/blog',
      ],
    },
  },
  chainConfig: {
    name: 'wirex',
    chainId: 31415,
    explorerUrl: 'https://pay-chain-blockscout.wirexpaychain.com',
    sinceTimestamp: UnixTime(1720093223),
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.wirexpaychain.com',
        callsPerMinute: 1500,
      },
    ],
  },
  // associatedTokens: ['WPAY'], // not launched yet
  discovery,
  daProvider: {
    layer: DA_LAYERS.DAC,
    bridge: DA_BRIDGES.DAC_MEMBERS({
      requiredSignatures: requiredSignaturesDAC,
      membersCount: membersCountDAC,
    }),
    riskView: RISK_VIEW.DATA_EXTERNAL_DAC({
      membersCount: membersCountDAC,
      requiredSignatures: requiredSignaturesDAC,
    }),
    technology: {
      name: 'Data is not stored on chain',
      description:
        'The transaction data is not recorded on the Ethereum main chain. Transaction data is stored off-chain and only the hashes are posted onchain by the Sequencer, after being signed by the DAC members.',
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'the external data becomes unavailable.',
          isCritical: true,
        },
      ],
      references: [
        {
          title:
            'PolygonValidiumStorageMigration.sol - Etherscan source code, sequenceBatchesValidium function',
          url: 'https://etherscan.io/address/0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C#code#F1#L126',
        },
      ],
    },
  },
  rollupModuleContract: discovery.getContract('Validium'),
  rollupVerifierContract: discovery.getContract('Verifier'),
  isForcedBatchDisallowed,
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: bridge.address,
      tokens: '*',
      sharedEscrow: {
        type: 'AggLayer',
        nativeAsset: 'etherPreminted',
        premintedAmount: '340282366920938463463374607431768211455',
      },
    }),
  ],
  stateDerivation: {
    nodeSoftware:
      'Node software can be found [here](https://github.com/0xPolygon/cdk-validium-node).',
    compressionScheme: 'No compression scheme yet.',
    genesisState:
      'The genesis state, whose corresponding root is accessible as Batch 0 root in the `getRollupBatchNumToStateRoot(5,0)` method of PolygonRollupManager, is available [here](https://github.com/0xPolygonHermez/zkevm-contracts/blob/1ad7089d04910c319a257ff4f3674ffd6fc6e64e/tools/addRollupType/genesis.json).',
    dataFormat:
      'The trusted sequencer request signatures from DAC members off-chain, and posts hashed batches with signatures to the WirexPayChainValidium contract.',
  },
  milestones: [
    {
      title: 'Wirex Pay Chain Protocol Launch',
      url: 'https://x.com/wirexpaychain/status/1828779629051793710',
      date: '2024-08-28',
      description:
        'Wirex Pay Chain launches officially, integrated with Polygon Agglayer.',
      type: 'general',
    },
  ],
  customDa: PolygoncdkDAC({
    dac: {
      requiredMembers: requiredSignaturesDAC,
      membersCount: membersCountDAC,
    },
  }),
})
