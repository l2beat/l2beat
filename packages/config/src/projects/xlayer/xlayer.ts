import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
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

const discovery = new ProjectDiscovery('xlayer')
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

const rollupModuleContract = discovery.getContract('Validium')

export const xlayer: ScalingProject = polygonCDKStack({
  addedAt: UnixTime(1713983341), // 2024-04-24T18:29:01Z
  discovery,
  additionalBadges: [BADGES.DA.DAC, BADGES.Infra.Agglayer],
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
            'PolygonValidiumEtrog.sol - Etherscan source code, sequenceBatchesValidium function',
          url: 'https://etherscan.io/address/0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F#code#F1#L91',
        },
      ],
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
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.SMALL_DAC],
  display: {
    name: 'X Layer',
    slug: 'xlayer',
    description:
      'X Layer is Validium by OKX with seamless integration with OKX products. It is powered by the Polygon CDK.',
    links: {
      websites: ['https://okx.com/xlayer'],
      documentation: [
        'https://okx.com/xlayer/docs/users/welcome/about-x-layer',
      ],
      explorers: ['https://okx.com/explorer/xlayer'],
      socialMedia: ['https://twitter.com/XLayerOfficial'],
    },
  },
  associatedTokens: ['OKB'],
  nonTemplateEscrows: [
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
  // project-specific sequencer txs (can be listed when we are able to split the shared agglayer trackedTxs):
  // nonTemplateTrackedTxs: [
  //   {
  //     uses: [
  //       { type: 'liveness', subtype: 'batchSubmissions' },
  //       { type: 'l2costs', subtype: 'batchSubmissions' },
  //     ],
  //     query: {
  //       formula: 'functionCall',
  //       address: rollupModuleContract.address,
  //       selector: '0xb910e0f9',
  //       functionSignature:
  //         'function sequenceBatches(tuple(bytes transactions, bytes32 forcedGlobalExitRoot, uint64 forcedTimestamp, bytes32 forcedBlockHashL1)[] batches, uint32 l1InfoTreeLeafCount, uint64 maxSequenceTimestamp, bytes32 expectedFinalAccInputHash, address l2Coinbase)',
  //       sinceTimestamp: UnixTime(1736257283),
  //     },
  //   },
  // ],
  milestones: [
    {
      title: 'X Layer Public Launch',
      url: 'https://x.com/XLayerOfficial/status/1780056275898048562',
      date: '2024-04-16',
      description: 'X Layer is now accessible to everyone.',
      type: 'general',
    },
  ],
  rollupModuleContract,
  rollupVerifierContract: discovery.getContract('Verifier'),
  isForcedBatchDisallowed,
  customDa: PolygoncdkDAC({
    dac: {
      requiredMembers: requiredSignaturesDAC,
      membersCount: membersCountDAC,
    },
  }),
})
