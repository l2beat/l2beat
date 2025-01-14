import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import {
  DA_BRIDGES,
  DA_LAYERS,
  RISK_VIEW,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common/ReasonForBeingInOther'
import { ESCROW } from '../../common/escrow'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { Upgradeability, zkStackL2 } from './templates/zkStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('sophon')
const discovery_ZKstackGovL2 = new ProjectDiscovery(
  'shared-zk-stack',
  'zksync2',
)
const bridge = discovery.getContract('L1SharedBridge')

export const sophon: Layer2 = zkStackL2({
  discovery,
  discovery_ZKstackGovL2,
  validatorsEvents: {
    added: 'sophonValidatorsAdded',
    removed: 'sophonValidatorsRemoved',
  },
  additionalBadges: [Badge.DA.Avail],
  createdAt: new UnixTime(1716536140), // 2024-05-24T07:35:40Z
  display: {
    name: 'Sophon',
    slug: 'sophon',
    reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_DA_ORACLE],
    description:
      'Sophon is a consumer-centric ecosystem on a ZK Stack Validium L2, designed to bring onchain benefits to everyday lifestyle and entertainment applications.',
    links: {
      websites: ['https://sophon.xyz/'],
      apps: ['https://portal.sophon.xyz/', 'https://farm.sophon.xyz/'],
      documentation: ['https://docs.sophon.xyz/sophon'],
      explorers: ['https://explorer.sophon.xyz/'],
      repositories: ['https://github.com/sophon-org'],
      socialMedia: [
        'https://x.com/sophon',
        'https://blog.sophon.xyz/',
        'https://t.me/SophonHub',
        'https://discord.gg/sophonhub',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  associatedTokens: ['SOPH'],
  rpcUrl: 'https://rpc.sophon.xyz/',
  chainConfig: {
    name: 'sophon',
    chainId: 50104,
    explorerUrl: 'https://explorer.sophon.xyz/',
    minTimestampForTvl: new UnixTime(1729531437),
  },
  diamondContract: discovery.getContract('SophonZkEvm'),
  daProvider: {
    layer: DA_LAYERS.AVAIL,
    riskView: {
      ...RISK_VIEW.DATA_AVAIL(false),
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
      ...TECHNOLOGY_DATA_AVAILABILITY.AVAIL_OFF_CHAIN(false),
      references: [
        {
          text: 'ExecutorFacet - _commitOneBatch() function',
          href: 'https://etherscan.io/address/0xaD193aDe635576d8e9f7ada71Af2137b16c64075#code#F1#L53',
        },
      ],
    },
    bridge: DA_BRIDGES.NONE,
  },
  nonTemplateEscrows: (zkStackUpgrades: Upgradeability) => [
    discovery.getEscrowDetails({
      address: bridge.address,
      tokens: [
        'ETH',
        'USDT',
        'BEAM',
        'stAethir',
        'PEPE',
        'wstETH',
        'weETH',
        'sDAI',
        'DAI',
        'WBTC',
        'stAZUR',
        'stAVAIL',
        'OPN',
      ], // 'SOPH' not on CG yet
      description:
        'Shared bridge for depositing tokens to Treasure and other ZK stack chains.',
      sharedEscrow: {
        type: 'ElasticChain',
        l2BridgeAddress: EthereumAddress(
          '0x954ba8223a6BFEC1Cc3867139243A02BA0Bc66e4',
        ),
        l2EtherAddress: EthereumAddress(
          '0x72af9F169B619D85A47Dfa8fefbCD39dE55c567D',
        ),
        tokensToAssignFromL1: [], // 'SOPH' not on CG yet
      },
      ...zkStackUpgrades,
    }),
    discovery.getEscrowDetails({
      address: discovery.getContract('L1USDCBridge').address,
      tokens: ['USDC'],
      ...ESCROW.CANONICAL_EXTERNAL,
      description:
        'External contract escrowing USDC deposited to Sophon via canonical messaging.',
    }),
  ],
  nonTemplateContracts: (zkStackUpgrades: Upgradeability) => [
    discovery.getContractDetails('SophonZkEvm', {
      description:
        'The main Rollup contract. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract \
          then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.',
      ...zkStackUpgrades,
    }),
    discovery.getContractDetails('SophonZkEvmAdmin', {
      description:
        'Intermediary governance contract that has the *ChainAdmin* role in the Sophon zkEVM diamond contract.',
    }),
  ],
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'SophonChainAdminMultisig',
      'Inherits *ChainAdmin* permissions like adding/removing validators in the ValidatorTimelock, adding a TransactionFilterer that can censor transactions, upgrading the Sophon Diamond to a predeployed version of the ZK stack and settings its fee parameters.',
    ),
    {
      name: 'SophOracleEOA',
      accounts: [
        discovery.getPermissionedAccount(
          'SophonZkEvmAdmin',
          'tokenMultiplierSetter',
        ),
      ],
      description: 'Can set the conversion factor for SOPH deposits to Sophon.',
    },
    ...discovery.getMultisigPermission(
      'SophonUSDCEscrowMultisig',
      'Can upgrade the implementation of the external USDC escrow and potentially steal all funds locked therein.',
    ),
  ],
  milestones: [
    {
      name: 'Mainnet public launch',
      link: 'https://x.com/sophon/status/1861771965284896996',
      date: '2024-12-18T00:00:00Z',
      description: 'Sophon Mainnet is now open for all users.',
      type: 'general',
    },
    {
      name: 'Mainnet private launch',
      link: 'https://blog.sophon.xyz/the-road-to-mainnet/',
      date: '2024-09-22T00:00:00Z',
      description: 'Sophon launches their mainnet privately.',
      type: 'general',
    },
  ],
})
