import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { DA_BRIDGES, DA_LAYERS, RISK_VIEW } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { Upgradeability, zkStackL2 } from './templates/zkStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('treasure')
const discovery_ZKstackGovL2 = new ProjectDiscovery(
  'shared-zk-stack',
  'zksync2',
)
const bridge = discovery.getContract('L1SharedBridge')

export const treasure: Layer2 = zkStackL2({
  discovery,
  discovery_ZKstackGovL2,
  validatorsEvents: {
    added: 'treasureValidatorsAdded',
    removed: 'treasureValidatorsRemoved',
  },
  badges: [
    Badge.VM.EVM,
    Badge.DA.CustomDA,
    Badge.Stack.ZKStack,
    Badge.Infra.ElasticChain,
  ],
  createdAt: new UnixTime(1719931843), // 2024-07-02T14:50:43Z
  additionalPurposes: ['Gaming'],
  display: {
    name: 'Treasure Chain',
    slug: 'treasure',
    description:
      'Treasure Chain is an upcoming gaming-specific L2 built on the ZK Stack. The Treasure Platform powers end-to-end gaming and game-builder needs including but not limited to Identity, Marketplace, AMM Payments, Analytics and LiveOps.',
    links: {
      websites: ['https://treasure.lol/'],
      apps: ['https://app.treasure.lol'],
      documentation: ['https://docs.treasure.lol'],
      explorers: [],
      repositories: ['https://github.com/TreasureProject'],
      socialMedia: ['https://x.com/Treasure_DAO'],
    },
    activityDataSource: 'Blockchain RPC',
  },
  associatedTokens: ['MAGIC'],
  rpcUrl: 'https://rpc.treasure.lol',
  chainConfig: {
    name: 'treasure',
    chainId: 61166,
    explorerUrl: 'http://treasurescan.io',
    minTimestampForTvl: new UnixTime(1732617294),
  },
  diamondContract: discovery.getContract('TreasureZkEvm'),
  daProvider: {
    layer: DA_LAYERS.EXTERNAL,
    bridge: DA_BRIDGES.NONE,
    riskView: {
      ...RISK_VIEW.DATA_EXTERNAL,
      sources: [
        {
          contract: 'ExecutorFacet',
          references: [
            'https://etherscan.io/address/0xaD193aDe635576d8e9f7ada71Af2137b16c64075#code#F1#L53',
          ],
        },
      ],
    },
    technology: {
      name: 'Data is not stored on chain',
      description:
        'The transaction data is not recorded on the Ethereum main chain. Transaction data is stored off-chain and only the hashes are posted onchain by the centralized Sequencer.',
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'the external data becomes unavailable.',
          isCritical: true,
        },
      ],
      references: [
        {
          text: 'ExecutorFacet - _commitOneBatch() function',
          href: 'https://etherscan.io/address/0xaD193aDe635576d8e9f7ada71Af2137b16c64075#code#F1#L53',
        },
      ],
    },
  },
  nonTemplateEscrows: (zkStackUpgrades: Upgradeability) => [
    discovery.getEscrowDetails({
      address: bridge.address,
      tokens: [],
      description:
        'Shared bridge for depositing tokens to Treasure and other ZK stack chains.',
      sharedEscrow: {
        type: 'ElasticChian',
        l2BridgeAddress: EthereumAddress(
          '0x309429DE3621992Cb0ab8982A448c9Cc5c38405b',
        ),
        l2EtherAddress: EthereumAddress(
          '0x898b3560affd6d955b1574d87ee09e46669c60ea',
        ),
        tokensToAssignFromL1: [],
      },
      ...zkStackUpgrades,
    }),
  ],
  nonTemplateContracts: (zkStackUpgrades: Upgradeability) => [
    discovery.getContractDetails('TreasureZkEvm', {
      description:
        'The main Rollup contract. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract \
          then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.',
      ...zkStackUpgrades,
    }),
    discovery.getContractDetails('TreasureZkEvmAdmin', {
      description:
        'Intermediary governance contract that has the *ChainAdmin* role in the Treasure zkEVM diamond contract.',
    }),
  ],
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'TreasureChainAdminMultisig',
      'Inherits *ChainAdmin* permissions like adding/removing validators in the ValidatorTimelock, adding a TransactionFilterer that can censor transactions, upgrading the Treasure Diamond to a predeployed version of the ZK stack and settings its fee parameters.',
    ),
    {
      name: 'TreasureOracleEOA',
      accounts: [
        discovery.getPermissionedAccount(
          'TreasureZkEvmAdmin',
          'tokenMultiplierSetter',
        ),
      ],
      description:
        'Can set the conversion factor for MAGIC deposits to Treasure.',
    },
  ],
  milestones: [
    {
      name: 'Mainnet launch',
      link: '',
      date: '2024-12-11T00:00:00Z',
      description: 'Treasure mainnet launches for all users.',
      type: 'general',
    },
  ],
})
