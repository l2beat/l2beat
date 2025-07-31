import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { BRIDGE_RISK_VIEW } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('sygma')

export const sygma: Bridge = {
  type: 'bridge',
  id: ProjectId('sygma'),
  addedAt: UnixTime(1711107103), // 2024-03-22T11:31:43Z
  display: {
    name: 'Sygma',
    slug: 'sygma',
    category: 'Hybrid',
    description:
      'Sygma is an interoperability protocol enabling asset transfers, non-fungible tokens, and cross-chain execution. With Sygma, developers can extend their applications across Ethereum mainnet, Base, Cronos, Polygon, Gnosis, Polkadot, Kusama, and other Substrate-based chains with active work on Bitcoin and Cosmos SDK interoperability.',
    detailedDescription: `Sygma in its current version is an interoperability protocol relying, from the Ethereum's point-of-view, on a \
    single EOA address' signature. This address is meant to represent MPC validators. There are plans in the future to extend the protocol and \
    add zk verifiers for block header oracle verification and optimistic routes that can be tailored to users' needs, however at the moment these capabilities are not deployed.`,
    links: {
      websites: [
        'https://buildwithsygma.com/',
        'https://blog.buildwithsygma.com',
      ],
      documentation: ['https://docs.buildwithsygma.com'],
      explorers: [
        'https://scan.buildwithsygma.com',
        'https://scan.test.buildwithsygma.com',
      ],
      repositories: ['https://github.com/sygmaprotocol'],
      socialMedia: [
        'https://discord.gg/Qdf6GyNB5J',
        'https://twitter.com/buildwithsygma',
        'https://t.me/buildwithsygma',
      ],
      bridges: [
        'https://subbridge.io',
        'https://docs.buildwithsygma.com/resources/environments/testnet/#testnet-faucet',
        'https://sygma-react-widget.pages.dev/',
        'https://validator.faucet.chainsafe.dev/upload',
      ],
    },
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description:
        '4/7 of the MPC group (the Sygma relayer network) is required to create a cross-chain message with the MPC signature.', // sygma eng team currently developing a zk methodology for block header oracle verification which we will implement on mainnet relayers soon. additionally, optimistic approach coming as well. we call this "tailored security"
      sentiment: 'bad',
    },
    destinationToken: BRIDGE_RISK_VIEW.CANONICAL_OR_WRAPPED,
  },
  technology: {
    destination: [
      // these are the currently supported networks on mainnet, but the main integration available is our backend integration for PHA tokens between the EVM<->Phala/Khala routes on Phala's SubBridge
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
        'Sygma currently leverages an MPC relayer network along with threshold signature schemes (TSS) to facilitate cross-chain transfers. From the PoV of Ethereum transfers are authorized by a single EOA address.',
      references: [],
      risks: [],
    },
    validation: {
      name: 'Transfers are externally verified',
      description:
        'The Sygma MPC Relayer, according to project`s information, is supposed to be a set of decentralized permissioned network agents and is the entry-level into Sygma verification systems. On each deposit event or cross-chain message, the trusted relayers on the Sygma protocol perform an MPC ceremony utilizing threshold signature signing (TSS) to jointly attest to the validity of the cross-chain message prior to execution. Although entry-level, an MPC relayer architecture represents a significant increase in security versus traditional multisig bridges, ensuring that no single participant can defeat an honest majority. The current Sygma relayer network consists of a set of federated entities including Bware Labs, Phala Network, ChainSafe Systems, and Sygma Labs. It is worth noting that this offchain setup cannot be verified on Ethereum and has to be trusted.',
      references: [],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'Greater than threshold number of MPC relayer nodes decide to censor certain transactions.',

          _ignoreTextFormatting: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'Greater than threshold number of MPC relayer nodes are maliciously taken over resulting in signing of malicious transactions.',

          _ignoreTextFormatting: true,
        },
        {
          category: 'Funds can be lost if',
          text: 'Greater than threshold number of MPC relayer nodes lose access to their MPC private keys.',

          _ignoreTextFormatting: true,
        },
      ],
    },
    destinationToken: {
      name: 'Destination tokens',
      description:
        'Depending on the integration of the specific token route, bridged tokens will follow either a lock/release (1:1 backed, wrapped asset) mechanism or a burn/mint (synthetic asset) mechanism.',
      risks: [],
      references: [],
    },
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0xC832588193cd5ED2185daDA4A531e0B26eC5B830'), // sygma erc-20 bridge handler address used to hold liquidity
        sinceTimestamp: UnixTime(1685659954),
        tokens: ['PHA'],
        chain: 'ethereum',
      },
    ],
  },
  contracts: {
    addresses: {
      ethereum: [
        discovery.getContractDetails('Bridge', {
          description:
            'The contract that facilitates and manages the cross-chain transfer of assets by recording and verifying deposit and withdrawal events across different blockchain networks. The actual handling of the deposits/withdrawals is handled by a configured Handler contracts such as for example ERC20Handler.',
        }),
        discovery.getContractDetails('ERC20 Bridge Handler', {
          description:
            'A contract that handles ERC20 tokens, enabling their deposit, withdrawal, and management within the protocol. This contract currently stores PHA tokens.',
        }),
        discovery.getContractDetails('FeeHandlerRouter', {
          description:
            'The FeeHandlerRouter contract routes fee handling for cross-chain transactions to appropriate fee handlers based on the destination domain and resource ID, while managing exemptions through a whitelist system.',
        }),
        discovery.getContractDetails('BasicFeeHandler', {
          description:
            'The BasicFeeHandler contract collects and manages deposit fees for cross-chain transactions, allowing for fee adjustments and the distribution of collected fees, intended for use with the bridge and fee router contract.',
        }),
        discovery.getContractDetails('Permissionless Generic Handler', {
          description:
            'The PermissionlessGenericHandler contract facilitates the processing of generic deposits and their execution without permissions, integrating with the bridge contract for cross-chain interactions, and is designed to handle complex data encoding for executing transactions across chains.',
        }),
      ],
    },
    risks: [
      {
        category: 'Funds can be stolen if',
        text: 'admin sets a handler that allows for mismanagement of funds.',
      },
    ],
  },
  permissions: {
    ethereum: {
      actors: [
        discovery.getMultisigPermission(
          'Admin Multisig',
          'The admin multisig covers a set of administrative privileges, \
    including ability to configure handlers that contain logic for handling deposits/withdrawals for specific chains and assets.',
        ),
        discovery.getMultisigPermission(
          'Community Multisig',
          'This multisig has the ability to manually withdraw tokens from the bridge using adminWithdraw() method.',
        ),
        discovery.getPermissionDetails(
          'Pauser/Unpauser',
          discovery.formatPermissionedAccounts([
            ChainSpecificAddress(
              'eth:0x695bd50CB07ffBd4098b272CE8b52B3c256ca049',
            ),
          ]),
          'EOA address with the permission to pause/unpause the bridge.',
        ),
      ],
    },
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
