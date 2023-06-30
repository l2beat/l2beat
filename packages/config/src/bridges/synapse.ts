import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { CONTRACTS } from '../layer2s/common'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('synapse')

export const synapse: Bridge = {
  type: 'bridge',
  id: ProjectId('synapse'),
  display: {
    name: 'Synapse',
    slug: 'synapse',
    links: {
      websites: ['https://synapseprotocol.com/landing'],
      apps: ['https://synapseprotocol.com'],
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
        sinceTimestamp: new UnixTime(1629082107),
        tokens: ['ETH', 'WETH', 'FRAX', 'USDT', 'USDC', 'WBTC', 'DAI', 'gOHM'],
      },
      // address of the AMM pool used for swaps to canonical tokens
      // the address of the pool is passed as a parameter for the function
      // Synapse team has on their repo contract "Pool Config"
      // https://github.com/synapsecns/synapse-contracts/blob/master/contracts/bridge/PoolConfig.sol
      // from which admittedly the nodes are getting swap pool address
      // but I could not find any trace of it on chain
      {
        address: EthereumAddress('0x1116898DdA4015eD8dDefb84b6e8Bc24528Af2d8'),
        sinceTimestamp: new UnixTime(1629082839),
        tokens: ['USDT', 'DAI', 'USDC'],
      },
    ],
  },
  technology: {
    destination: [
      'Arbitrum',
      'Avalanche',
      'BNB Chain',
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
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'nodes decide to mint more tokens than there are locked on Ethereum thus preventing some existing holders from being able to bring their funds back to Ethereum.',
          isCritical: true,
        },
        {
          category: 'Funds can be stolen if',
          text: 'nodes decide to withdraw all the funds from the Ethereum Contract.',
          isCritical: true,
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
          isCritical: true,
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
    sourceUpgradeability: {
      value: '3 minutes delay',
      description:
        'Bridge can be upgraded after 3 minutes delay by a 2/3 Admin MultiSig.',
      sentiment: 'bad',
    },
    destinationToken: RISK_VIEW.CANONICAL,
  },
  contracts: {
    addresses: [
      {
        name: 'L1BridgeZap',
        description:
          'Entry point for deposits. Acts as a relayer between user and escrow, enabling token swap feature.',
        address: EthereumAddress('0x6571d6be3d8460CF5F7d6711Cd9961860029D85F'),
      },
      discovery.getContractDetails(
        'SynapseBridge',
        "Main escrow contract where all the funds are being held, the address with certain privileges can perform withdraw on user's behalf.",
      ),
      {
        name: 'Liquidity Pool',
        description:
          'Contract utilized as Liquidity Pool, allowing users to bridge their tokens to canonical versions on Ethereum.',
        address: EthereumAddress('0x1116898DdA4015eD8dDefb84b6e8Bc24528Af2d8'),
      },
    ],
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK('3 minutes')],
  },

  permissions: [
    ...discovery.getMultisigPermission(
      'Bridge Multisig',
      "Manages the bridge parameters and can upgrade its implementation, in case of malicious upgrade user's funds can be lost. Additionally it manages Liquidity Pool with the permissions to mint new tokens.",
    ),
    {
      name: 'Nodes',
      description: 'Can withdraw funds and mint SynERC20 Wrapped tokens.',
      accounts: [
        {
          // TODO: add support for deeper queries SynapseBridge.accessControl.NODEGROUP_ROLE.members
          address: EthereumAddress(
            '0x230A1AC45690B9Ae1176389434610B9526d2f21b',
          ),
          type: 'EOA',
        },
      ],
    },
  ],
}
