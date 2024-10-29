import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { Upgradeability, zkStackL2 } from './templates/zkStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('zeronetwork')
const discovery_ZKstackGovL2 = new ProjectDiscovery(
  'shared-zk-stack',
  'zksync2',
)
const bridge = discovery.getContract('L1SharedBridge')

export const zeronetwork: Layer2 = zkStackL2({
  discovery,
  discovery_ZKstackGovL2,
  validatorsEvents: {
    added: 'zeronetworkValidatorsAdded',
    removed: 'zeronetworkValidatorsRemoved',
  },
  badges: [
    Badge.VM.EVM,
    Badge.DA.EthereumBlobs,
    Badge.Stack.ZKStack,
    Badge.Infra.ElasticChain,
  ],
  createdAt: new UnixTime(1721214420), // 2024-07-17T11:07:00Z
  display: {
    name: 'ZERϴ Network',
    slug: 'zeronetwork',
    description:
      'ZERϴ Network is an L2 by the Zerion wallet team, utilizing the ZK stack and native account abstraction, allowing users with Zerion Wallet DNA NFTs gasless and prioritized transactions.',
    links: {
      websites: ['https://zero.network/'],
      apps: ['https://bridge.zero.network/', 'https://zerion.io/'],
      documentation: ['https://docs.zero.network/'],
      explorers: ['https://explorer.zero.network/'],
      repositories: [],
      socialMedia: [
        'https://x.com/ZEROdotnetwork',
        'https://zero.network/blog',
        'https://discord.com/invite/VfC24at',
      ],
    },
    activityDataSource: 'Blockchain RPC'
  },
  rpcUrl: 'https://rpc.zerion.io/v1/zero',
  chainConfig: {
    name: 'zeronetwork',
    chainId: 543210,
    explorerUrl: 'https://explorer.zero.network/',
    minTimestampForTvl: new UnixTime(1729616414),
  },
  diamondContract: discovery.getContract('ZeroNetworkZkEvm'),
  nonTemplateEscrows: (zkStackUpgrades: Upgradeability) => [
    discovery.getEscrowDetails({
      address: bridge.address,
      tokens: [],
      description:
        'Shared bridge for depositing tokens to ZERϴ and other ZK stack chains.',
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
    discovery.getContractDetails('ZeroNetworkZkEvm', {
      description:
        'The main Rollup contract. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract \
          then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.',
      ...zkStackUpgrades,
    }),
    discovery.getContractDetails('ZeroNetworkZkEvmAdmin', {
      description:
        'Intermediary governance contract that has the *ChainAdmin* role in the ZERϴ zkEVM diamond contract.',
    }),
  ],
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'ZeroNetworkChainAdminMultisig',
      'Inherits *ChainAdmin* permissions like adding/removing validators in the ValidatorTimelock, adding a TransactionFilterer that can censor transactions, upgrading the ZERϴ Diamond to a predeployed version of the ZK stack and settings its fee parameters.',
    ),
    {
      name: 'ZeroNetworkOracleEOA',
      accounts: [
        discovery.getPermissionedAccount(
          'ZeroNetworkZkEvmAdmin',
          'tokenMultiplierSetter',
        ),
      ],
      description: 'Can set the conversion factor for SOPH deposits to ZERϴ.',
    },
  ],
  milestones: [
    {
      name: 'Mainnet launch',
      link: 'https://zero.network/blog',
      date: '2024-01-01T00:00:00Z', // TODO: Update
      description: 'ZERϴ launches their mainnet.',
      type: 'general',
    },
  ],
})
