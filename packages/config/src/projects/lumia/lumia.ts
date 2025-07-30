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

const discovery = new ProjectDiscovery('lumia')
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

export const lumia: ScalingProject = polygonCDKStack({
  addedAt: UnixTime(1718181773), // 2024-06-12T08:42:53Z
  additionalBadges: [BADGES.DA.DAC],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.SMALL_DAC],
  additionalPurposes: ['Restaking', 'RWA'],
  display: {
    name: 'Lumia Prism',
    slug: 'lumia',
    description:
      'Lumia is a Validium built on the PolygonCDK stack focusing on real world assets, restaking and account abstraction.',
    links: {
      websites: ['https://lumia.org/'],
      bridges: ['https://bridge.lumia.org/'],
      explorers: ['https://explorer.lumia.org/', 'https://lens.lumia.org/'],
      documentation: ['https://docs.lumia.org/'],
      repositories: [
        'https://github.com/orionprotocol/cdk-validium-permissionless-node',
      ],
      socialMedia: [
        'https://x.com/BuildOnLumia',
        'https://t.me/lumia_community',
        'https://discord.gg/Lumia',
      ],
    },
  },
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
            'PolygonValidiumEtrog.sol - Etherscan source code, sequenceBatchesValidium function',
          url: 'https://etherscan.io/address/0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F#code#F1#L91',
        },
      ],
    },
  },
  rollupModuleContract,
  rollupVerifierContract: discovery.getContract('Verifier'),
  isForcedBatchDisallowed,
  chainConfig: {
    name: 'lumia',
    chainId: 994873017,
    gasTokens: ['LUMIA'],
    explorerUrl: 'https://explorer.lumia.org',
    sinceTimestamp: UnixTime(1719499031),
    apis: [
      {
        type: 'rpc',
        url: 'https://mainnet-rpc.lumia.org',
        callsPerMinute: 1500,
      },
    ],
  },
  associatedTokens: ['LUMIA'],
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: bridge.address,
      tokens: '*',
      sharedEscrow: {
        type: 'AggLayer',
        nativeAsset: 'etherWrapped',
        wethAddress: EthereumAddress(
          '0x5A77f1443D16ee5761d310e38b62f77f726bC71c',
        ),
        tokensToAssignFromL1: ['LUMIA'],
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
  //       sinceTimestamp: UnixTime(1741176767),
  //     },
  //   },
  // ],
  customDa: PolygoncdkDAC({
    dac: {
      requiredMembers: requiredSignaturesDAC,
      membersCount: membersCountDAC,
    },
  }),
  milestones: [],
})
