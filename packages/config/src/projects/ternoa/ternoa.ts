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

const discovery = new ProjectDiscovery('ternoa')
const bridge = discovery.getContract('AgglayerBridge')

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

export const ternoa: ScalingProject = polygonCDKStack({
  addedAt: UnixTime(1727455020), // 2024-09-27T17:09:00Z
  additionalBadges: [BADGES.DA.DAC, BADGES.RaaS.Zeeve],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.SMALL_DAC],
  additionalPurposes: ['Payments'],
  display: {
    name: 'Ternoa',
    slug: 'ternoa',
    description:
      'Ternoa is a modular Validium leveraging the Polygon CDK stack. It is built by the team behind the Substrate-based Ternoa Layer 1 and focuses on PayFi.',
    links: {
      websites: ['https://ternoa.network/'],
      bridges: ['https://portal.polygon.technology/bridge'],
      explorers: ['https://explorer-mainnet.zkevm.ternoa.network/'],
      documentation: ['https://docs.ternoa.network/learn/ternoa-zkevm+'],
      repositories: ['https://github.com/capsule-corp-ternoa'],
      socialMedia: [
        'https://x.com/ternoa_',
        'https://t.me/ternoa',
        'https://medium.com/ternoa',
        'https://discord.com/invite/cNZTGtGJNR',
        'https://linkedin.com/company/ternoa/mycompany/',
        'https://youtube.com/channel/UCUYvbtRE5HoWPz7z88V7Khw',
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
          url: 'https://etherscan.io/address//0x427113ae6F319BfFb4459bfF96eb8B6BDe1A127F#code#F1#L91',
        },
      ],
    },
  },
  rollupModuleContract,
  rollupVerifierContract: discovery.getContract('Verifier'),
  isForcedBatchDisallowed,
  chainConfig: {
    name: 'ternoa',
    chainId: 752025,
    explorerUrl: 'https://explorer-mainnet.zkevm.ternoa.network',
    sinceTimestamp: UnixTime(1735650935),
    gasTokens: ['CAPS'],
    apis: [
      {
        type: 'rpc',
        // successfully tested at 5k/min
        url: 'https://rpc-mainnet.zkevm.ternoa.network',
        callsPerMinute: 300,
      },
    ],
  },
  associatedTokens: ['CAPS'],
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
        tokensToAssignFromL1: ['CAPS'],
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
  //       sinceTimestamp: UnixTime(1735650935),
  //     },
  //   },
  // ],
  milestones: [
    {
      title: 'Ternoa Mainnet Launch',
      url: 'https://x.com/Ternoa_/status/1884519126812487828',
      date: '2025-01-29',
      description: 'Ternoa is live on mainnet, integrated with Agglayer.',
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
