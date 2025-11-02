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

const discovery = new ProjectDiscovery('silicon')
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

export const silicon: ScalingProject = polygonCDKStack({
  addedAt: UnixTime(1725027256), // 2024-08-30T14:14:16Z
  additionalBadges: [BADGES.DA.DAC, BADGES.RaaS.Nodeinfra],
  discovery,
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.SMALL_DAC],
  display: {
    name: 'Silicon',
    slug: 'silicon',
    description:
      'Silicon is a Validium built on the Polygon CDK Stack, aiming to become the social network of the future.',
    links: {
      websites: ['https://silicon.network/'],
      bridges: ['https://bridge.silicon.network/'],
      documentation: ['https://docs.silicon.network/'],
      explorers: ['https://scope.silicon.network'],
      repositories: ['https://github.com/0xSilicon'],
      socialMedia: ['https://x.com/0xSilicon'],
    },
  },
  rollupModuleContract,
  rollupVerifierContract: discovery.getContract('Verifier'),
  isForcedBatchDisallowed,
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
    name: 'silicon',
    chainId: 2355,
    explorerUrl: 'https://scope.silicon.network',
    sinceTimestamp: UnixTime(1724183531),
    apis: [
      { type: 'rpc', url: 'https://rpc.silicon.network', callsPerMinute: 300 },
    ],
  },
  nonTemplateEscrows: [
    // shared
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
  milestones: [
    {
      title: 'Silicon Mainnet Launch',
      url: 'https://x.com/0xSilicon/status/1828704079687917908',
      date: '2024-08-28',
      description: 'Silicon is live on mainnet, integrated with Agglayer.',
      type: 'general',
    },
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
  //       sinceTimestamp: UnixTime(1724183531),
  //     },
  //   },
  // ],
  customDa: PolygoncdkDAC({
    dac: {
      requiredMembers: requiredSignaturesDAC,
      membersCount: membersCountDAC,
    },
  }),
})
