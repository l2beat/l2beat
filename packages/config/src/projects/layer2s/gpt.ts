import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
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

const discovery = new ProjectDiscovery('gpt')

const shared = new ProjectDiscovery('shared-polygon-cdk')
const bridge = shared.getContract('Bridge')

const membersCountDAC = discovery.getContractValue<number>(
  'GptProtocolDAC',
  'getAmountOfMembers',
)

const requiredSignaturesDAC = discovery.getContractValue<number>(
  'GptProtocolDAC',
  'requiredAmountOfSignatures',
)

const isForcedBatchDisallowed =
  discovery.getContractValue<string>(
    'GptProtocolValidium',
    'forceBatchAddress',
  ) !== '0x0000000000000000000000000000000000000000'

const upgradeability = {
  upgradableBy: ['GptProtocolDAC Upgrader'],
  upgradeDelay: 'None',
}

export const gpt: Layer2 = polygonCDKStack({
  createdAt: new UnixTime(1720180654), // 2024-07-05T11:57:34Z
  additionalBadges: [Badge.DA.DAC, Badge.RaaS.Gateway],
  additionalPurposes: ['AI'],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.SMALL_DAC],
  display: {
    name: 'GPT Protocol',
    slug: 'gpt',
    description:
      'GPT Protocol is a Validium built on the Polygon CDK stack. The purpose of the project is to create a decentralized market of AI compute power.',
    links: {
      websites: ['https://gptprotocol.org/'],
      apps: [
        'https://bridge.gptprotocol.io/',
        'https://assistant.gptprotocol.io/',
        'https://staking.gptprotocol.org/',
      ],
      documentation: [],
      explorers: ['https://explorer.gptprotocol.io/'],
      repositories: ['https://github.com/gptprotocol'],
      socialMedia: [
        'https://x.com/gpt_protocol',
        'https://t.me/gpt_protocol',
        'https://discord.com/invite/gptprotocol',
        'https://instagram.com/gptprotocol/',
      ],
    },
  },
  associatedTokens: ['GPT'],
  rpcUrl: 'https://rpc.gptprotocol.io', // tested at over 10k requests per minute with no ratelimit (we default to 1500/min)
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
            'https://etherscan.io/address/0xA36aFB6b79A3d164a3d12C141c916BECc6e012D8#code',
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
  chainConfig: {
    chainId: 1511670449,
    minTimestampForTvl: new UnixTime(1716807971),
    name: 'gpt',
  },
  rollupModuleContract: discovery.getContract('GptProtocolValidium'),
  rollupVerifierContract: discovery.getContract('Verifier'),
  isForcedBatchDisallowed,
  nonTemplateEscrows: [
    shared.getEscrowDetails({
      address: bridge.address,
      tokens: ['GPT', 'WETH'],
      sinceTimestamp: new UnixTime(1712620800),
      sharedEscrow: {
        type: 'AggLayer',
        nativeAsset: 'etherWrapped',
        tokensToAssignFromL1: ['GPT'],
        wethAddress: EthereumAddress(
          '0x5A77f1443D16ee5761d310e38b62f77f726bC71c',
        ),
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
      'The trusted sequencer request signatures from DAC members off-chain, and posts hashed batches with signatures to the GptProtocolValidium contract.',
  },
  nonTemplatePermissions: [
    {
      name: 'LocalAdmin',
      accounts: [
        discovery.formatPermissionedAccount(
          discovery.getContractValue('GptProtocolValidium', 'admin'),
        ),
      ],
      description:
        'Admin and ForceBatcher of the GptProtocolValidium contract, can set core system parameters like timeouts, sequencer, activate forced transactions, and set the DA committee members in the GptProtocolDAC contract.',
    },
    {
      name: 'GptProtocolDAC Upgrader',
      accounts: [
        discovery.formatPermissionedAccount(
          discovery.getContractValue('DACProxyAdmin', 'owner'),
        ),
      ],
      description:
        'Can upgrade the GptProtocolDAC contract and thus change the data availability rules any time.',
    },
  ],
  nonTemplateContracts: [
    discovery.getContractDetails('GptProtocolDAC', {
      description:
        'Validium committee contract that allows the owner to setup the members of the committee and stores the required amount of signatures threshold.',
      ...upgradeability,
    }),
  ],
  milestones: [
    {
      name: 'GPT Protocol Launch',
      link: 'https://x.com/gpt_protocol/status/1827155009123090891',
      date: '2024-08-24',
      description:
        'GPT Protocol launches officially, integrated with Polygon AggLayer.',
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
