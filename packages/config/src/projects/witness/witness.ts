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

const discovery = new ProjectDiscovery('witness')

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

export const witness: ScalingProject = polygonCDKStack({
  addedAt: UnixTime(1720180654), // 2024-07-05T11:57:34Z
  archivedAt: UnixTime(1738022400), // 2025-01-28T00:00:00.000Z,
  discovery,
  additionalBadges: [BADGES.DA.DAC, BADGES.RaaS.Gateway],
  additionalPurposes: ['IoT', 'Oracles'],
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
            'PolygonValidiumStorageMigration.sol - Etherscan source code, sequenceBatchesValidium() function',
          url: 'https://etherscan.io/address/0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C#code#F1#L126',
        },
      ],
    },
  },
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.SMALL_DAC],
  display: {
    headerWarning:
      'The operator has stopped servicing this Validium (the last batch was posted on 2024-12-18).',
    name: 'Witness Chain',
    slug: 'witness',
    description:
      'Witness Chain is a Validium built on the Polygon CDK stack and Eigenlayer validates services. The purpose of the project is to create a DePIN coordination Layer.',
    links: {
      websites: ['https://witnesschain.com/'],
      bridges: ['https://witnesschain-bridge.eu-north-2.gateway.fm'],
      documentation: ['https://docs.witnesschain.com/'],
      explorers: ['https://witnesschain-blockscout.eu-north-2.gateway.fm/'],
      repositories: ['https://github.com/witnesschain-com'],
      socialMedia: [
        'https://twitter.com/witnesschain',
        'https://discord.gg/HwnzU5CYDp',
        'https://docs.witnesschain.com/resources/technical-papers',
      ],
    },
  },
  chainConfig: {
    chainId: 1702448187,
    name: 'witness',
    sinceTimestamp: UnixTime(1718569535),
    apis: [
      {
        type: 'rpc',
        url: 'https://witnesschain-sequencer.eu-north-2.gateway.fm/',
        callsPerMinute: 300,
      },
    ],
  },
  nonTemplateEscrows: [
    // TVS was 31 doler on 2025-01-28 when this was archived
    // shared.getEscrowDetails({
    //   address: bridge.address,
    //   tokens: '*',
    //   sharedEscrow: {
    //     type: 'AggLayer',
    //     nativeAsset: 'etherPreminted',
    //     premintedAmount: '340282366920938463463374607431768211455',
    //   },
    // }),
  ],
  milestones: [
    {
      title: 'Witness Chain Mainnet Launch',
      url: 'https://x.com/witnesschain/status/1808153753897652256',
      date: '2024-07-02',
      description: 'WitnessChain is live on mainnet, integrated with Agglayer.',
      type: 'general',
    },
  ],
  rollupModuleContract: discovery.getContract('Validium'),
  rollupVerifierContract: discovery.getContract('Verifier'),
  isForcedBatchDisallowed,
  customDa: PolygoncdkDAC({
    dac: {
      requiredMembers: requiredSignaturesDAC,
      membersCount: membersCountDAC,
    },
  }),
})
