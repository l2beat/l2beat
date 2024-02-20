import { ProjectId, UnixTime } from '@l2beat/shared-pure'

import { NUGGETS } from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
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
    description:
      'Sygma is a modular, open-source, cross-chain connectivity protocol. With Sygma, developers can easily extend their applications across EVM, Substrate, and beyond.',
    detailedDescription: 
      `Sygma is a hybrid bridging protocol that currently leverages an MPC-based relayer network along with threshold signature schemes (TSS) to facilitate cross-chain transfers. There is ongoing efforts underway to implement optimistic, trust-minimized cross-chain block header oracles (Zipline), as well as a ZK-based block header oracle (Spectre) to provide tailored security for different bridging use-cases.`,
    links: {
      websites: [
        'https://buildwithsygma.com/',
        'https://blog.buildwithsygma.com',
      ],
      documentation: [
        `https://docs.buildwithsygma.com`,
      ],
      explorers: [
        `https://scan.buildwithsygma.com`,
        `https://scan.test.buildwithsygma.com`
      ],
      repositories: ['https://github.com/sygmaprotocol'],
      socialMedia: [
        'https://discord.gg/Qdf6GyNB5J',
        'https://twitter.com/buildwithsygma',
        `https://t.me/buildwithsygma`
      ],
      apps: [
        `https://subbridge.io`,
        'https://transfer-ui.test.buildwithsygma.com/transfer',
        'https://faucet-ui-stage.buildwithsygma.com/',
        'https://validator.faucet.chainsafe.dev/upload',
      ]
    },
  },
  riskView: {
    validatedBy: {
      value: 'Third party',
      description:
        '4/6 of the MPC group (the Sygma relayer network) is required to create a cross-chain message with the MPC signature.', // sygma eng team currently developing a zk methodology for block header oracle verification which we will implement on mainnet relayers soon. additionally, optimistic approach coming as well. we call this "tailored security"
      sentiment: 'neutral',
    },
    sourceUpgradeability: {
      value: 'No',
      description: 'Contracts are not upgradable.',
      sentiment: 'good',
    },
    destinationToken: RISK_VIEW.CANONICAL_OR_WRAPPED,
  },
  technology: {
    destination: [ // these are the currently supported networks on mainnet, but the main integration available is our backend integration for PHA tokens between the EVM<->Phala/Khala routes on Phala's SubBridge 
      'Ethereum',
      'Phala',
      'Khala',
      'Polygon',
      'Cronos',
      'Base',
      'Gnosis',
    ],
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        `Sygma is a hybrid bridging protocol that currently leverages an MPC-based relayer network along with threshold signature schemes (TSS) to facilitate cross-chain transfers. There is ongoing efforts underway to implement optimistic, trust-minimized cross-chain block header oracles (Zipline), as well as a ZK-based block header oracle (Spectre) to provide tailored security for different bridging use-cases.`,
      references: [],
      risks: [],
    },
    validation: {
      name: 'Transfers are externally verified',
      description:
        'A Sygma relayer network, operated by a trusted federation of entities (incl. Sygma Labs, Bware Labs, Phala Network, and ChainSafe), listens, parses, and passes along events related to cross-chain transfers or generic message passing. The relayer nodes in this network utilizes a variety of verification systems (currently MPC) to sign off on generic messages and/or token release/minting.',
      references: [],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'Greater than threshold number of MPC relayer nodes decide to censor certain transactions.',
          isCritical: true,
          _ignoreTextFormatting: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'Greater than threshold number of MPC relayer nodes are maliciously taken over resulting in signing of malicious transactions.',
          isCritical: true,
          _ignoreTextFormatting: true,
        },
        {
          category: 'Funds can be lost if',
          text: 'Greater than threshold number of MPC relayer nodes lose access to their MPC private keys.',
          isCritical: true,
          _ignoreTextFormatting: true,
        },
      ],
    },
    destinationToken: {
      name: 'Destination tokens',
      description:
        'Tokens received on the destination chain can be either wrapped tokens or native tokens depending on the specific implementation. For example, on Phalas integrated use-case with Sygma, native tokens are burned in Substrate/Polkadot and unlocked on EVM, and vice versa where tokens get locked on EVM and minted in Substrate/Polkadot.',
      risks: [],
      references: [],
    },
  },
  config: {
    escrows: [
      {
        address: discovery.getContract('Sygma').address, 
        sinceTimestamp: new UnixTime(1685659954),
        tokens: ['PHA'],
      },
    ],
  },
  contracts: {
    addresses: [
        {
            address: EthereumAddress('0x4D878E8Fb90178588Cda4cf1DCcdC9a6d2757089'),
            name: 'Bridge',
            description: 'The Bridge.sol contract facilitates and manages the cross-chain transfer of assets by recording and verifying deposit and withdrawal events across different blockchain networks.',
        },
        {
            address: EthereumAddress('0xC832588193cd5ED2185daDA4A531e0B26eC5B830'),
            name: 'ERC20Handler',
            description: 'A contract that handles ERC20 tokens, enabling their deposit, withdrawal, and management within the protocol. This contract currently stores PHA tokens.',
        },
        {
            address: EthereumAddress('0x1d34808907607FA82Fa1b51F5fBA5Ff5a3Fa90cF'),
            name: 'FeeHandlerRouter',
            description: 'The FeeHandlerRouter contract routes fee handling for cross-chain transactions to appropriate fee handlers based on the destination domain and resource ID, while managing exemptions through a whitelist system.',
        },
        {
            address: EthereumAddress('0x9f9778DA7c1D0AbE148314d6C1EA6E0A93C151C7'),
            name: 'BasicFeeHandler', // fixed fee
            description: 'The BasicFeeHandler contract collects and manages deposit fees for cross-chain transactions, allowing for fee adjustments and the distribution of collected fees, intended for use with the bridge and fee router contract.',
        },
        {
            address: EthereumAddress('0x31282123E7bcd947e2c1Bc364d564839574fAdCD'),
            name: 'PermissionlessGenericHandler',
            description: 'The PermissionlessGenericHandler contract facilitates the processing of generic deposits and their execution without permissions, integrating with the bridge contract for cross-chain interactions, and is designed to handle complex data encoding for executing transactions across chains.',
        },
        {
            address: EthereumAddress('0x6c5bA91642F10282b576d91922Ae6448C9d52f4E'),
            name: 'PHA',
            description: 'Token contract address for PHA token, which is one of Sygmas supported routes between EVM and Phala/Khala.',
        },
    ],
    risks: [],
    isIncomplete: true,
  },
  permissions: [
    {
      accounts: [
        {
          address: EthereumAddress(
            '0xc4d8b2F5501C765dE0C5E12550118F397B197D05',
          ),
          type: 'MultiSig', 
        },
      ],
      name: 'Community MultiSig', // 4/6 GnosisSafeProxy
      description:
        'This 4/6 multisig is used to manage the fee handler liquidity.',
    },
    {
      accounts: [
        {
          address: EthereumAddress(
            '0x86a73a594f74C76a6eB8F9E728d992D03252f60f',
          ),
          type: 'EOA', 
        },
        {
          address: EthereumAddress(
            '0xC6458dedf35231F524ED9d7E0DF77A60b9E08676',
          ),
          type: 'EOA', 
        },
        {
          address: EthereumAddress(
            '0xe845B1d31CaA16Bf6c6Bf5E97a28D086bd46FD49',
          ),
          type: 'EOA', 
        },
        {
          address: EthereumAddress(
            '0xa399460Ce767b06297457178D2F9F8f144017E77',
          ),
          type: 'EOA', 
        },
        {
          address: EthereumAddress(
            '0x0c1db86328E6CFCD4f530401131Dc9a26DefA12a',
          ),
          type: 'EOA', 
        },
        {
          address: EthereumAddress(
            '0xd85b34B2Fe1eC7815B6dF659372382A8FA229677',
          ),
          type: 'EOA', 
        },
      ],
      name: 'Community MultiSig Participants',
      description:
        'Participants of the 4/6 Sygma community multisig.',
    },
    {
      accounts: [
        {
          address: EthereumAddress(
            '0xde79695d5cefF7c324552B3ecbe6165f77FCdF53', 
          ),
          type: 'MultiSig', // 3/5 GnosisSafeProxy
        },
      ],
      name: 'Admin MultiSig',
      description:
        'The 3/5 admin multisig covers a set of super administrative privileges, such as pausing the bridge, that may be required in order to be able to reduce the impact of security incidents.',
    },
    {
      accounts: [
        {
          address: EthereumAddress(
            '0x86a73a594f74C76a6eB8F9E728d992D03252f60f', 
          ),
          type: 'EOA', 
        },
        {
          address: EthereumAddress(
            '0x5a288b42dC222190D8cF5014A330c978ee42A5df', 
          ),
          type: 'EOA', 
        },
        {
          address: EthereumAddress(
            '0xe845B1d31CaA16Bf6c6Bf5E97a28D086bd46FD49', 
          ),
          type: 'EOA', 
        },
        {
          address: EthereumAddress(
            '0xacc0268a75280192897a78C706C9FBA2d2b851C4', 
          ),
          type: 'EOA', 
        },
        {
          address: EthereumAddress(
            '0x197C57440A30cB28103ab27CB1b0dC86E5907ADA', 
          ),
          type: 'EOA', 
        },
      ],
      name: 'Admin MultiSig Participants',
      description:
        'Participants of the 3/5 Sygma admin multisig.',
    },
  ],
  knowledgeNuggets: [
    {
      title: 'Architecture overview',
      url: 'https://docs.buildwithsygma.com/architecture',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_01,
    },
    {
      title: 'Audits',
      url: 'https://docs.buildwithsygma.com/audits',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_03,
    },
    {
        title: 'Frequently asked questions',
        url: 'https://docs.buildwithsygma.com/faq',
        thumbnail: NUGGETS.THUMBNAILS.L2BEAT_03,
      },
  ],
}
