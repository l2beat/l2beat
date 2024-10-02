import { RISK_VIEW } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { Upgradeability, zkStackL2 } from './templates/zkStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('cronoszkevm')
const discovery_ZKstackGovL2 = new ProjectDiscovery(
  'shared-zk-stack',
  'zksync2',
)

export const cronoszkevm: Layer2 = zkStackL2({
  discovery,
  discovery_ZKstackGovL2,
  validatorsEvents: {
    added: 'cronosValidatorsAdded',
    removed: 'cronosValidatorsRemoved',
  },
  badges: [
    Badge.VM.EVM,
    Badge.DA.CustomDA,
    Badge.Stack.ZKStack,
    Badge.Infra.ElasticChain,
  ],
  display: {
    tvlWarning: {
      content:
        'The TVL is currently shared among all projects using the shared ZK stack contracts. See ZKsync Era TVL.',
      sentiment: 'warning',
    },
    name: 'Cronos zkEVM',
    slug: 'cronoszkevm',
    description:
      'Cronos zkEVM is a general-purpose Validium on Ethereum built on the ZK Stack, scaling the existing portfolio of Cronos apps and chains.',
    purposes: ['Universal'],
    links: {
      websites: ['https://cronos.org/zkevm'],
      apps: ['https://zkevm.cronos.org/bridge'],
      documentation: ['https://docs-zkevm.cronos.org/'],
      explorers: ['https://explorer.zkevm.cronos.org/'],
      repositories: [],
      socialMedia: [
        'https://x.com/cronos_chain',
        'https://discord.com/invite/cronos',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  associatedTokens: ['zkCRO'],
  rpcUrl: 'https://mainnet.zkevm.cronos.org',
  // chainConfig: {
  //   name: 'cronoszkevm',
  //   chainId: 388,
  //   explorerUrl: 'https://explorer.zkevm.cronos.org/',
  //   explorerApi: {
  //     url: '',
  //     type: '',
  //   },
  //   minTimestampForTvl: new UnixTime(),
  //   coingeckoPlatform: '',
  diamondContract: discovery.getContract('CronosZkEvm'),
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
  // currently unclear if state derivation is significantly different from ZKsync Era, see telegram chat
  // stateDerivation: {
  //   nodeSoftware: `The node software is open-source, and its source code can be found [here](https://github.com/matter-labs/zksync-era).
  //   The main node software does not rely on Layer 1 (L1) to reconstruct the state, but you can use [this tool](https://github.com/eqlabs/zksync-state-reconstruct) for that purpose. Currently, there is no straightforward method to inject the state into the main node, but ZKsync is actively working on a solution for this.`,
  //   compressionScheme:
  //     'Bytecodes undergo compression before deployment on Layer 1 (L1). You can find additional information on this process [here](https://github.com/matter-labs/zksync-era/blob/main/docs/guides/advanced/11_compression.md).',
  //   genesisState: 'There have been neither genesis states nor regenesis.',
  //   dataFormat:
  //     'Details on data format can be found [here](https://github.com/matter-labs/zksync-era/blob/main/docs/guides/advanced/09_pubdata.md).',
  // },
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
