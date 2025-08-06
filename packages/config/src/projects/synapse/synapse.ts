import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BRIDGE_RISK_VIEW, CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('synapse')

export const synapse: Bridge = {
  type: 'bridge',
  id: ProjectId('synapse'),
  addedAt: UnixTime(1662628329), // 2022-09-08T09:12:09Z
  display: {
    name: 'Synapse',
    slug: 'synapse',
    links: {
      websites: ['https://synapseprotocol.com/landing'],
      bridges: ['https://synapseprotocol.com'],
      documentation: ['https://docs.synapseprotocol.com/'],
      repositories: ['https://github.com/synapsecns'],
      explorers: ['https://analytics.synapseprotocol.com/'],
      socialMedia: [
        'https://twitter.com/SynapseProtocol',
        'https://discord.gg/synapseprotocol',
        'https://forum.synapseprotocol.com/',
        'https://synapse.mirror.xyz/',
      ],
    },
    description:
      'Synapse is a token bridge leveraging a validator between chains and liquidity pools to perform cross-chain and same chain swaps.',
    category: 'Hybrid',
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0x2796317b0fF8538F253012862c06787Adfb8cEb6'),
        sinceTimestamp: UnixTime(1629082107),
        tokens: [
          'ETH',
          'WETH',
          'FRAX.legacy',
          'USDT',
          'USDC',
          'WBTC',
          'DAI',
          'gOHM',
        ],
        chain: 'ethereum',
      },
      // address of the Synapse AMM pool used for swaps to canonical tokens
      {
        address: EthereumAddress('0x1116898DdA4015eD8dDefb84b6e8Bc24528Af2d8'),
        sinceTimestamp: UnixTime(1629082839),
        tokens: ['USDT', 'DAI', 'USDC'],
        chain: 'ethereum',
      },
    ],
  },
  technology: {
    destination: [
      'Arbitrum',
      'Avalanche',
      'Aurora',
      'Base',
      'Blast',
      'BNB Chain',
      'Cronos',
      'DFK Chain',
      'Optimism',
      'Polygon',
      'Aurora',
      'Boba Network',
      'Fantom',
      'Metis',
    ],
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'Synapse leverages cross-chain messaging to transfer tokens from Ethereum to other chains and vice-versa. The external actor is observing events on supported chains and manages funds accordingly. The tokens are swapped using a typical lock-mint bridge with a wrapped asset on the other chain, or are provided via liquidity pools, where the user funds are converted to a stable on one end and on the other end synthetic stablecoin nUSD is minted and immediately swapped to a given token.',
      references: [],
      risks: [],
    },
    validation: {
      name: 'Transfers are externally verified',
      description:
        'External actor observe events on Ethereum and transfer funds to other bridges. The same happens when bridging back to Ethereum, external actor instructs EOA to perform withdraw on users account.',
      references: [],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'nodes decide not to transfer tokens after observing an event on Ethereum.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'nodes decide to mint more tokens than there are locked on Ethereum thus preventing some existing holders from being able to bring their funds back to Ethereum.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'nodes decide to withdraw all the funds from the Ethereum Contract.',
        },
      ],
    },
    destinationToken: {
      name: 'Destination tokens',
      description:
        'Type of the token received on the destination chain depends on the token, if it is native to this chain user will receive canonical token. If the bridged token is not native to the destination chain then user will end up with wrapped version, the contract is called BridgeToken and is upgradable.',
      references: [],
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'destination token contract is maliciously upgraded or not securely implemented.',
        },
      ],
    },
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description: 'Withdraws are validated by EOA.',
      sentiment: 'bad',
    },
    destinationToken: BRIDGE_RISK_VIEW.CANONICAL,
  },
  contracts: {
    addresses: {
      ethereum: [
        discovery.getContractDetails(
          'L1BridgeZap',
          'Entry point for deposits. Acts as a relayer between user and escrow, enabling token swap feature.',
        ),
        discovery.getContractDetails(
          'SynapseBridge',
          "Main escrow contract where all the funds are being held, the address with certain privileges can perform withdraw on user's behalf.",
        ),
        discovery.getContractDetails(
          'Liquidity Pool',
          'Contract utilized as Liquidity Pool, allowing users to bridge their tokens to canonical versions on Ethereum.',
        ),
      ],
    },
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK('3 minutes')],
  },

  permissions: {
    ethereum: {
      actors: [
        discovery.getMultisigPermission(
          'Bridge Multisig',
          "Manages the bridge parameters and can upgrade its implementation, in case of malicious upgrade user's funds can be lost. Additionally it manages Liquidity Pool with the permissions to mint new tokens.",
        ),
        discovery.getPermissionDetails(
          'Nodes (NODEGROUP_ROLE)',
          discovery.getAccessControlRolePermission(
            'SynapseBridge',
            'NODEGROUP_ROLE',
          ),
          'Is an executor who can call regular bridging functions like withdrawing funds and minting SynERC20 Wrapped tokens.',
        ),
        discovery.getPermissionDetails(
          'Governors (GOVERNANCE_ROLE)',
          discovery.getAccessControlRolePermission(
            'SynapseBridge',
            'GOVERNANCE_ROLE',
          ),
          'Can set bridging fees, pause and unpause the SynapseBridge contract.',
        ),
        discovery.getPermissionDetails(
          'Admin (DEFAULT_ADMIN_ROLE)',
          discovery.getAccessControlRolePermission(
            'SynapseBridge',
            'DEFAULT_ADMIN_ROLE',
          ),
          'Can call setWethAddress() on the SynapseBridge contract.',
        ),
      ],
    },
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
