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
import { PolygoncdkDAC } from '../da-beat/templates/polygoncdk-template'
import { DacTransactionDataType } from '../da-beat/types'
import { polygonCDKStack } from './templates/polygonCDKStack'
import type { Layer2 } from './types'

const discovery = new ProjectDiscovery('wirex')

const shared = new ProjectDiscovery('shared-polygon-cdk')
const bridge = shared.getContract('Bridge')

const membersCountDAC = discovery.getContractValue<number>(
  'WirexPayChainDAC',
  'getAmountOfMembers',
)

const requiredSignaturesDAC = discovery.getContractValue<number>(
  'WirexPayChainDAC',
  'requiredAmountOfSignatures',
)

const isForcedBatchDisallowed =
  discovery.getContractValue<string>(
    'WirexPayChainValidium',
    'forceBatchAddress',
  ) !== '0x0000000000000000000000000000000000000000'

const upgradeability = {
  upgradableBy: ['WirexPayChainDAC Upgrader'],
  upgradeDelay: 'None',
}

export const wirex: Layer2 = polygonCDKStack({
  createdAt: new UnixTime(1720180654), // 2024-07-05T11:57:34Z
  additionalBadges: [Badge.DA.DAC, Badge.RaaS.Gateway],
  additionalPurposes: ['Payments'],
  display: {
    reasonsForBeingOther: [REASON_FOR_BEING_OTHER.SMALL_DAC],
    name: 'Pay Chain',
    slug: 'wirex',
    description:
      'Pay Chain is a Validium built on the Polygon CDK stack. It is used as the infrastructure for the Wirex non-custodial debit cards.',
    links: {
      websites: ['https://wirexpaychain.com/'],
      apps: ['https://pay-chain-bridge.wirexpaychain.com/'],
      documentation: ['https://docs.wirexpaychain.com/tech/wirex-pay-chain'],
      explorers: ['https://pay-chain-blockscout.wirexpaychain.com/'],
      repositories: [],
      socialMedia: [
        'https://x.com/wirexpaychain',
        'https://discord.gg/f8UGp4dH6g',
        'https://wirexpaychain.com/blog',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  chainConfig: {
    name: 'wirex',
    chainId: 31415,
    explorerUrl: 'https://pay-chain-blockscout.wirexpaychain.com',
    minTimestampForTvl: new UnixTime(1720093223),
  },
  // associatedTokens: ['WPAY'], // not launched yet
  rpcUrl: 'https://pay-chain-rpc.wirexpaychain.com', // tested at over 10k requests per minute with no ratelimit (we default to 1500/min)
  discovery,
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
          contract: 'PolygonDataCommittee.sol',
          references: [
            'https://etherscan.io/address/0xAce9269EaC3419937093154dea0AD44C36Df6963#code',
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
          text: 'PolygonValidiumStorageMigration.sol - Etherscan source code, sequenceBatchesValidium function',
          href: 'https://etherscan.io/address/0x10D296e8aDd0535be71639E5D1d1c30ae1C6bD4C#code#F1#L126',
        },
      ],
    },
  },
  rollupModuleContract: discovery.getContract('WirexPayChainValidium'),
  rollupVerifierContract: discovery.getContract('Verifier'),
  isForcedBatchDisallowed,
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
  nonTemplateTechnology: {
    newCryptography: {
      ...NEW_CRYPTOGRAPHY.ZK_BOTH,
    },
  },
  stateDerivation: {
    nodeSoftware:
      'Node software can be found [here](https://github.com/0xPolygon/cdk-validium-node).',
    compressionScheme: 'No compression scheme yet.',
    genesisState:
      'The genesis state, whose corresponding root is accessible as Batch 0 root in the `getRollupBatchNumToStateRoot(5,0)` method of PolygonRollupManager, is available [here](https://github.com/0xPolygonHermez/zkevm-contracts/blob/1ad7089d04910c319a257ff4f3674ffd6fc6e64e/tools/addRollupType/genesis.json).',
    dataFormat:
      'The trusted sequencer request signatures from DAC members off-chain, and posts hashed batches with signatures to the WirexPayChainValidium contract.',
  },

  nonTemplatePermissions: [
    {
      name: 'LocalAdmin',
      accounts: [
        discovery.formatPermissionedAccount(
          discovery.getContractValue('WirexPayChainValidium', 'admin'),
        ),
      ],
      description:
        'Admin and ForceBatcher of the WirexPayChainValidium contract, can set core system parameters like timeouts, sequencer, activate forced transactions, and set the DA committee members in the WirexPayChainDAC contract.',
    },
    {
      name: 'WirexPayChainDAC Upgrader',
      accounts: [
        discovery.formatPermissionedAccount(
          discovery.getContractValue('DACProxyAdmin', 'owner'),
        ),
      ],
      description:
        'Can upgrade the WirexPayChainDAC contract and thus change the data availability rules any time.',
    },
  ],
  nonTemplateContracts: [
    discovery.getContractDetails('WirexPayChainDAC', {
      description:
        'Validium committee contract that allows the owner to setup the members of the committee and stores the required amount of signatures threshold.',
      ...upgradeability,
    }),
  ],
  milestones: [
    {
      name: 'Wirex Pay Chain Protocol Launch',
      link: 'https://x.com/wirexpaychain/status/1828779629051793710',
      date: '2024-08-28',
      description:
        'Wirex Pay Chain launches officially, integrated with Polygon AggLayer.',
      type: 'general',
    },
  ],
  knowledgeNuggets: [],
  dataAvailabilitySolution: PolygoncdkDAC({
    bridge: {
      createdAt: new UnixTime(1723211933), // 2024-08-09T13:58:53Z
      requiredMembers: requiredSignaturesDAC,
      membersCount: membersCountDAC,
      transactionDataType: DacTransactionDataType.TransactionData,
    },
  }),
})
