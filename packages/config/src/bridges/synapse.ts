import { ProjectId, UnixTime } from '@l2beat/shared'

import { CONTRACTS } from '../layer2s/common'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

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
  },
  config: {
    escrows: [
      {
        address: '0x2796317b0fF8538F253012862c06787Adfb8cEb6',
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
        address: '0x1116898DdA4015eD8dDefb84b6e8Bc24528Af2d8',
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
    category: 'Hybrid',
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
        address: '0x6571d6be3d8460CF5F7d6711Cd9961860029D85F',
      },
      {
        name: 'SynapseBridge',
        description:
          "Main escrow contract where all the funds are being held, the address with certain privileges can perform withdraw on user's behalf.",
        address: '0x2796317b0fF8538F253012862c06787Adfb8cEb6',
        upgradeability: {
          type: 'EIP1967',
          admin: '0x67F60b0891EBD842Ebe55E4CCcA1098d7Aac1A55',
          implementation: '0x31fe393815822edacBd81C2262467402199EFD0D',
        },
      },
      {
        name: 'Liquidity Pool',
        description:
          'Contract utilized as Liquidity Pool, allowing users to bridge their tokens to canonical versions on Ethereum.',
        address: '0x1116898DdA4015eD8dDefb84b6e8Bc24528Af2d8',
      },
    ],
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK('3 minutes')],
  },

  permissions: [
    {
      name: 'Bridge Governance 2/3 MultiSig',
      description:
        "Manages the bridge parameters and can upgrade its implementation, in case of malicious upgrade user's funds can be lost. Additionally it manages Liquidity Pool with the permissions to mint new tokens.",
      accounts: [
        {
          address: '0x67F60b0891EBD842Ebe55E4CCcA1098d7Aac1A55',
          type: 'MultiSig',
        },
      ],
    },
    {
      name: 'Participants in Bridge Governance 2/3 MultiSig',
      description:
        'Can sign the transaction which will be executed by the Multisig contract.',
      accounts: [
        {
          address: '0xb3DAD3C24A861b84fDF380B212662620627D4e15',
          type: 'EOA',
        },
        {
          address: '0x42980E3e602178354E065723d9652BEf79Ae3673',
          type: 'EOA',
        },
        {
          address: '0x0d745Ad687F2b1E1941569f09f612F60ad4aD5BC',
          type: 'EOA',
        },
      ],
    },
    {
      name: 'Nodes',
      description: 'Can withdraw funds and mint SynERC20 Wrapped tokens.',
      accounts: [
        {
          address: '0x230A1AC45690B9Ae1176389434610B9526d2f21b',
          type: 'EOA',
        },
      ],
    },
  ],
}
