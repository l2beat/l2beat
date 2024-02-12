import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { CONTRACTS } from '../layer2s'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('sygma')

export const sygma: Bridge = {
  type: 'bridge',
  id: ProjectId('sygma'),
  display: {
    name: 'Sygma',
    slug: 'sygma',
    category: 'Hybrid',
    links: {
      websites: ['https://buildwithsygma.com/'],
      documentation: ['https://docs.buildwithsygma.com/'],
      repositories: ['https://github.com/sygmaprotocol'],
      explorers: ['https://scan.buildwithsygma.com/'],
      socialMedia: [
        'https://twitter.com/buildwithsygma',
        'https://discord.gg/Qdf6GyNB5J',
        'https://blog.buildwithsygma.com/',
        'https://www.linkedin.com/company/buildwithsygma',
      ],
      apps: [
        'https://transfer-ui.test.buildwithsygma.com/transfer'
        'https://scan.test.buildwithsygma.com/'
        'https://faucet-ui-stage.buildwithsygma.com/'
        'https://scan.buildwithsygma.com/'
        'https://validator.faucet.chainsafe.dev/upload'
        'https://subbridge.io/'
      ],
    },
    description:
      'Sygma is a modular, open-source, cross-chain connectivity protocol built on the fundamentals of the ChainBridge open source project. With Sygma, developers can easily extend their applications across EVM, Substrate, and beyond.',
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0xC832588193cd5ED2185daDA4A531e0B26eC5B830'),
        sinceTimestamp: new UnixTime(1707415076),
        tokens: [
          'PHA',
          'ETH',
          'CRO',
          'MATIC',
          'XDAI',
        ],
      },
    ],
  },
  technology: {
    destination: ['Ethereum Mainnet', 'Khala', 'Phala', 'Cronos', 'Base', 'Gnosis','Polygon',],
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'Sygma leverages a multi-layered framework that uses secure multi-party computation (MPC) and threshold signature schemes (TSS) to strengthen security and communication within the relayer network. There is ongoing efforts underway to implement optimistic, trust-minimized cross-chain block header oracles (Zipline), as well as a ZK-based block header oracle (Spectre) to provide tailored security for different bridging use-cases.',
        
      references: [
        text: 'Future-Proofing Interoperability',
        href: 'https://blog.buildwithsygma.com/vision-cross-chain-future/',
        text: 'Introducing Zipline Casper',
        href: 'https://blog.buildwithsygma.com/zipline/',
        text: 'Spectre: A ZK Coprocessor to Extend Sygma Security',
        href: 'https://blog.buildwithsygma.com/spectre-a-zk-coprocessor-to-extend-sygmas-security/',
      ],
      risks: [],
    },
    validation: {
      name: 'Third Party',
      description:
        'The multi-party computation (MPC) model that Sygma employs includes a number of trusted relayer nodes operating under a trusted federation. These trusted relayer nodes are run by ChainSafe Systems, Bware Labs, Phala Network and new relayer partners are activly being added.',
      references: [
        text: 'Sygma Architecture',
        href: 'https://docs.buildwithsygma.com/architecture',
      ],
      risks: [
        {
          category: 'Users can be censored if',
          text: '',
         
        },
      ],
    },
    destinationToken: {
      name: 'Destination tokens',
      description:
        'Depending on the integration of the specific token route, bridged tokens will follow either a lock/release (1:1 backed, wrapped asset) mechanism or a burn/mint (synthetic asset) mechanism.',
      references: [],
      risks: [
        {
          category: 'Funds can be stolen if',
          text: '',
        },
      ],
    },
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description: 'Signed off-chain by 3 or more independent relayers.',
      sentiment: '',
    },
    sourceUpgradeability: {
      value: 'Yes',
      description: 'The EVM admin multisig is a 3-of-5 and includes actions such as:registering resources and routes, withdrawing fees from the handler, changing the fee logic for a bridge, changing fee percentage on a static fee handler, set the address of the fee oracle which provides gas price and effective rates, pause and unpause the bridge. The community multisig is a 4-of-6 and includes one action, withdraw liquidity from the handle. The Substrate admin multisig is a 2-of-3 and includes actions such as: register a new domain as the supported destination domain, along with its ChainID, set fee amount for a supported domain and an asset, set Fee handler type for a domain and an asset and pause/unpause the bridge of given destination domain.  ',
      sentiment: '',
    },
    destinationToken: RISK_VIEW.CANONICAL_OR_WRAPPED,
  },
  contracts: {
    addresses: [
      discovery.getContractDetails(
        'Bridge',
        'Clear description of the contract here',
      ),
      discovery.getContractDetails(
        'ERC1155Safe',
        'Contract responsible for checking off-chain signatures performed by the oracles, currently there are needed at least 8 confirmations.',
      ),
      discovery.getContractDetails(
        'ERC20Safe',
        'Clear description of the contract here',
      ),
      discovery.getContractDetails(
        'ERC721MinterBurnerPauser',
        'Clear description of the contract here',
      ),
      discovery.getContractDetails(
        'ERC721Safe',
        'Clear description of the contract here',
      ),
      discovery.getContractDetails(
        'Forwarder',
        'Clear description of the contract here',
      ),
      discovery.getContractDetails(
        'Migrations',
        'Clear description of the contract here',
      ),
      discovery.getContractDetails(
        'TestContracts',
        'Clear description of the contract here',
      ),
      discovery.getContractDetails(
        'XC20Safe',
        'Clear description of the contract here',
      ),
      discovery.getContractDetails(
        'Forwarder',
        'Clear description of the contract here',
      ),
    ],
    risks: [],
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'Admin Multisig',
      'The admin multisig covers a set of super administrative privileges, such as pausing the bridge, that may be required in order to be able to reduce the impact of security incidents. As these actions may have significant financial impact, the admin governance process follows a strict off-chain preparation/review and onchain review/signing.'),
    {
      name: 'Relayers',
      description:
        'Relayers are entities that ensure bridge decentralization and execute asset bridging. Relayers are distributed among several legal entities and operate under a trusted federation model.',
      accounts: discovery.getPermissionedAccounts(
        'SignatureVerifier',
        'relayers',
      ),
    },
  ],
}
