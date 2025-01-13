import { UnixTime } from '@l2beat/shared-pure'
import {
  DA_BRIDGES,
  DA_LAYERS,
  NEW_CRYPTOGRAPHY,
  RISK_VIEW,
} from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common/ReasonForBeingInOther'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { PolygoncdkDAC } from '../other/da-beat/templates/polygoncdk-template'
import { DacTransactionDataType } from '../other/da-beat/types'
import { polygonCDKStack } from './templates/polygonCDKStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('witness')

const shared = new ProjectDiscovery('shared-polygon-cdk')
const bridge = shared.getContract('Bridge')

const membersCountDAC = discovery.getContractValue<number>(
  'WitnessValidiumDAC',
  'getAmountOfMembers',
)

const requiredSignaturesDAC = discovery.getContractValue<number>(
  'WitnessValidiumDAC',
  'requiredAmountOfSignatures',
)

const isForcedBatchDisallowed =
  discovery.getContractValue<string>('WitnessValidium', 'forceBatchAddress') !==
  '0x0000000000000000000000000000000000000000'

const upgradeability = {
  upgradableBy: ['DACProxyAdminOwner'],
  upgradeDelay: 'No delay',
}

export const witness: Layer2 = polygonCDKStack({
  createdAt: new UnixTime(1720180654), // 2024-07-05T11:57:34Z
  discovery,
  additionalBadges: [Badge.DA.DAC],
  additionalPurposes: ['IoT', 'Oracles'],
  daProvider: {
    layer: DA_LAYERS.DAC,
    bridge: DA_BRIDGES.DAC_MEMBERS({
      requiredSignatures: requiredSignaturesDAC,
      membersCount: membersCountDAC,
    }),
    riskView: {
      ...RISK_VIEW.DATA_EXTERNAL_DAC({
        membersCount: membersCountDAC,
        requiredSignatures: requiredSignaturesDAC,
      }),
      sources: [
        {
          contract: 'WitnessValidiumDAC',
          references: [
            'https://etherscan.io/address/0xd26b535ad58715c4c2fffac32908b13674533dae#code',
          ],
        },
      ],
    },
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
          text: 'PolygonValidiumStorageMigration.sol - Etherscan source code, sequenceBatchesValidium() function',
          href: 'https://etherscan.io/address/0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C#code#F1#L126',
        },
      ],
    },
  },
  display: {
    reasonsForBeingOther: [REASON_FOR_BEING_OTHER.SMALL_DAC],
    name: 'Witness Chain',
    slug: 'witness',
    description:
      'Witness Chain is a Validium built on the Polygon CDK stack and Eigenlayer validates services. The purpose of the project is to create a DePIN coordination Layer.',
    links: {
      websites: ['https://witnesschain.com/'],
      apps: ['https://witnesschain-bridge.eu-north-2.gateway.fm'],
      documentation: ['https://docs.witnesschain.com/'],
      explorers: ['https://witnesschain-blockscout.eu-north-2.gateway.fm/'],
      repositories: ['https://github.com/witnesschain-com'],
      socialMedia: [
        'https://twitter.com/witnesschain',
        'https://discord.gg/HwnzU5CYDp',
        'https://docs.witnesschain.com/resources/technical-papers',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  chainConfig: {
    chainId: 1702448187,
    name: 'witness',
    minTimestampForTvl: new UnixTime(1718569535),
  },
  rpcUrl: 'https://witnesschain-sequencer.eu-north-2.gateway.fm/',
  nonTemplateEscrows: [
    shared.getEscrowDetails({
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
      name: 'Witness Chain Mainnet Launch',
      link: 'https://x.com/witnesschain/status/1808153753897652256',
      date: '2024-07-02',
      description:
        'L2 Diligence proofs are now posted to Witness Chain Mainnet by Eigenlayer operators.',
      type: 'general',
    },
  ],
  knowledgeNuggets: [],
  rollupModuleContract: discovery.getContract('WitnessValidium'),
  rollupVerifierContract: discovery.getContract('FflonkVerifier'),
  isForcedBatchDisallowed,
  nonTemplateTechnology: {
    newCryptography: {
      ...NEW_CRYPTOGRAPHY.ZK_BOTH,
    },
  },
  nonTemplatePermissions: [
    {
      name: 'LocalAdmin',
      accounts: [
        discovery.formatPermissionedAccount(
          discovery.getContractValue('WitnessValidium', 'admin'),
        ),
      ],
      description:
        'Admin of the WitnessValidium contract, can set core system parameters like timeouts, sequencer, activate forced transactions and update the DA mode.',
    },
    {
      name: 'DACProxyAdminOwner',
      accounts: [
        discovery.formatPermissionedAccount(
          discovery.getContractValue('ProxyAdmin', 'owner'),
        ),
      ],
      description:
        "Owner of the WitnessValidiumDAC's ProxyAdmin. Can upgrade the contract.",
    },
  ],
  nonTemplateContracts: [
    discovery.getContractDetails('WitnessValidiumDAC', {
      description:
        'Validium data availability committee contract that allows the admin to setup the members of the committee and stores the required amount of signatures threshold.',
      ...upgradeability,
    }),
  ],
  dataAvailabilitySolution: PolygoncdkDAC({
    bridge: {
      createdAt: new UnixTime(1723211933), // 2024-08-09T13:58:53Z
      requiredMembers: requiredSignaturesDAC,
      membersCount: membersCountDAC,
      transactionDataType: DacTransactionDataType.TransactionData,
    },
  }),
})
