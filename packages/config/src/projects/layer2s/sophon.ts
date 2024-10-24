import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { RISK_VIEW } from '../../common'
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

export const cronoszkevm: Layer2 = zkStackL2({
  discovery,
  discovery_ZKstackGovL2,
  validatorsEvents: {
    added: 'sophonValidatorsAdded',
    removed: 'sophonValidatorsRemoved',
  },
  badges: [
    Badge.VM.EVM,
    Badge.DA.CustomDA,
    Badge.Stack.ZKStack,
    Badge.Infra.ElasticChain,
  ],
  createdAt: new UnixTime(1716536140), // 2024-05-24T07:35:40Z
  display: {
    name: 'Sophon',
    slug: 'sophon',
    description:
      "Sophon is a community-driven and entertainment-focused ecosystem built on top of a modular rollup stack leveraging ZKsync's ZK Stack technology.",
    links: {
      websites: ['https://sophon.xyz/'],
      apps: ['https://farm.sophon.xyz/'],
      documentation: ['https://docs.sophon.xyz/'],
      explorers: [],
      repositories: [],
      socialMedia: ['https://x.com/sophon'],
    },
  },
  associatedTokens: ['SOPH'],
  rpcUrl: '',
  chainConfig: {
    name: '',
    chainId: ,
    coingeckoPlatform: '',
    explorerUrl: '',
    minTimestampForTvl: new UnixTime(),
  },
  diamondContract: discovery.getContract(''),
  daProvider: {
    name: 'External',
    bridge: {
      type: 'None',
    },
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
        'The transaction data is not recorded on the Ethereum main chain. Transaction data is stored off-chain and only the hashes are posted on-chain by the centralized Sequencer.',
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
      tokens: ['ybETH', 'CRO', 'USDC', 'WBTC', 'zkCRO'],
      description:
        'Shared bridge for depositing tokens to Cronos zkEVM and other ZK stack chains.',
      sharedEscrow: {
        type: 'ElasticChian',
        l2BridgeAddress: EthereumAddress(
          '0x309429DE3621992Cb0ab8982A448c9Cc5c38405b',
        ),
        l2EtherAddress: EthereumAddress(
          '0x898b3560affd6d955b1574d87ee09e46669c60ea',
        ),
        tokensToAssignFromL1: ['zkCRO'],
      },
      ...zkStackUpgrades,
    }),
  ],
  nonTemplateContracts: (zkStackUpgrades: Upgradeability) => [
    discovery.getContractDetails('CronosZkEvm', {
      description:
        'The main Rollup contract. The operator commits blocks and provides a ZK proof which is validated by the Verifier contract \
          then processes transactions. During batch execution it processes L1 --> L2 and L2 --> L1 transactions.',
      ...zkStackUpgrades,
    }),
    discovery.getContractDetails('CronosZkEVMAdmin', {
      description:
        'Intermediary governance contract that has the *ChainAdmin* role in the Cronos zkEVM diamond contract.',
    }),
    discovery.getContractDetails('TransactionFiltererDenyList', {
      description:
        'Censorship contract that is registered as the TransactionFilterer in the Cronos zkEVM diamond contract. Keeps a list of addresses that are not allowed to force transactions to the Layer 2 (`requestL2Transaction()`).',
    }),
  ],
  nonTemplatePermissions: [
    ...discovery.getMultisigPermission(
      'CronosChainAdminMultisig',
      'Inherits all *ChainAdmin* permissions.',
    ),
    {
      name: 'CronosChainAdminEOA',
      accounts: [
        discovery.getAccessControlRolePermission(
          'CronosZkEVMAdmin',
          'ADMIN',
        )[0],
      ],
      description: 'Inherits all *ChainAdmin* permissions.',
    },
    ...discovery.getMultisigPermission(
      'TxFiltererOwnerMultisig',
      'Owns the TransactionFiltererDenyList contract and can manage addresses in the censoring list. Currently also has all *ChainAdmin* permissions through the CronosZkEVMAdmin contract.',
    ),
  ],
  milestones: [
    {
      name: 'Alpha Mainnet Launch',
      link: 'https://blog.cronos.org/p/cronos-zkevm-launches-its-alpha-mainnet',
      date: '2024-08-15T00:00:00Z',
      description: 'Cronos zkEVM Launches Its Alpha Mainnet powered by ZKsync.',
      type: 'general',
    },
  ],
})
