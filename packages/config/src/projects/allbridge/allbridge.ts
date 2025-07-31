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

const discovery = new ProjectDiscovery('allbridge')

export const allbridge: Bridge = {
  type: 'bridge',
  id: ProjectId('allbridge'),
  addedAt: UnixTime(1675164709), // 2023-01-31T11:31:49Z
  display: {
    name: 'Allbridge',
    slug: 'allbridge',
    description:
      'Allbridge Core enables the transfer of value between blockchains by offering cross-chain swaps of native stablecoins using liquidity pools.',
    detailedDescription:
      'For its stablecoin liquidity network it is using either of its own AMB, Circle CCTP or Wormhole to pass messages. Allbridge TokenBridge is a token bridge implemented\
      as a separate contract. Core system parameters can be changed by an EOA, risking the loss of all funds stored in the system contracts.',
    category: 'Hybrid',
    links: {
      websites: ['https://allbridge.io/'],
      bridges: ['https://core.allbridge.io/', 'https://app.allbridge.io/'],
      documentation: [
        'https://docs.allbridge.io/',
        'https://docs-core.allbridge.io/',
      ],
      repositories: ['https://github.com/allbridge-io'],
      socialMedia: [
        'https://x.com/Allbridge_io',
        'https://allbridge.medium.com/',
        'https://t.me/allbridge_announcements',
        'https://discord.com/invite/ASuPY8d3E6',
      ],
    },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0xBBbD1BbB4f9b936C3604906D7592A644071dE884',
        ),
        sinceTimestamp: UnixTime(1636635220),
        tokens: '*',
        description: 'Lock-Mint token bridge',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x7DBF07Ad92Ed4e26D5511b4F285508eBF174135D',
        ),
        sinceTimestamp: UnixTime(1662596190),
        tokens: ['USDT'],
        description: 'USDT liquidity pool on Ethereum',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0xa7062bbA94c91d565Ae33B893Ab5dFAF1Fc57C4d',
        ),
        sinceTimestamp: UnixTime(1669206935),
        tokens: ['USDC'],
        description: 'USDC liquidity pool on Ethereum',
      }),
      // multichain stablecoin pools
      {
        chain: 'arbitrum',
        includeInTotal: false,
        address: EthereumAddress('0x690e66fc0F8be8964d40e55EdE6aEBdfcB8A21Df'),
        sinceTimestamp: UnixTime(1687868331),
        tokens: ['USDC'],
      },
      {
        chain: 'arbitrum',
        includeInTotal: false,
        address: EthereumAddress('0x47235cB71107CC66B12aF6f8b8a9260ea38472c7'),
        sinceTimestamp: UnixTime(1704638642),
        tokens: ['USDT'],
      },
      {
        chain: 'base',
        includeInTotal: false,
        address: EthereumAddress('0xDA6bb1ec3BaBA68B26bEa0508d6f81c9ec5e96d5'),
        sinceTimestamp: UnixTime(1706798147),
        tokens: ['USDC'],
      },
      {
        chain: 'optimism',
        includeInTotal: false,
        address: EthereumAddress('0x3B96F88b2b9EB87964b852874D41B633e0f1f68F'),
        sinceTimestamp: UnixTime(1702912935),
        tokens: ['USDC'],
      },
      {
        chain: 'optimism',
        includeInTotal: false,
        address: EthereumAddress('0xb24A05d54fcAcfe1FC00c59209470d4cafB0deEA'),
        sinceTimestamp: UnixTime(1704638475),
        tokens: ['USDT'],
      },
    ],
  },
  technology: {
    canonical: false,
    destination: [
      'Aurora',
      'Avalanche',
      'BNB Chain',
      'Celo',
      'Ethereum',
      'Fantom',
      'Fuse',
      'Harmony',
      'HECO',
      'Klaytn',
      'Near',
      'Polygon',
      'Solana',
      'Terra Classic',
      'Tezos',
      'XRPL',
      'Waves',
      'Stellar',
    ],
    principleOfOperation: {
      name: 'Principle of operation',
      description: `
      For USDC and USDT, Allbridge 'Core' offers three message protocols (AMBs) to choose from: Allbridge, Wormhole and Circle CCTP (USDC only). 
      These two token classes can also simultaneously be swapped while bridging, tapping into the Allbridges multichain liquidity pools.
      
      For other supported tokens, Allbridge offers a token bridge mode that locks tokens in the escrow on Ethereum and mints them at the destination. 
      The crosschain messages in this case are passed via either Allbridge AMB or Wormhole.`,
      references: [
        {
          title: 'Docs: Wormhole architecture',
          url: 'https://docs.wormhole.com/wormhole/explore-wormhole/components',
        },
      ],
      risks: [],
    },
    validation: {
      name: 'Transfers are externally verified',
      description:
        'Validation process takes place in external network called the Guardian Network. Nodes in the network, called Guardians, observe the Core Contract on each supported chain and produce VAAs (Verified Action Approvals, essentially signed messages) when those contracts receive an interaction. Based on the VAA user can withdraw funds on the other end of the bridge.',
      references: [
        {
          title: 'AllbridgeMessenger contract: function receiveMessage()',
          url: 'https://etherscan.io/address/0x203e8785b4d4312c4152D0c42Ba3FA8BD79086dA#code#F1#L97',
        },
        {
          title: 'WormholeCore contract: function verifyVM()',
          url: 'https://etherscan.io/address/0x3c3d457f1522d3540ab3325aa5f1864e34cba9d0#code#F9#L28',
        },
        {
          title: 'CCTP Risk Management Network',
          url: 'https://docs.chain.link/ccip/concepts#risk-management-network',
        },
      ],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'the circle oracle network fails to facilitate a transfer via the Circle CCTP.',
        },
        {
          category: 'Users can be censored if',
          text: 'the Wormhole guardians and / or Allbridge validators decide to stop processing certain transactions.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'the Wormhole guardians and / or Allbridge validators allow to mint more tokens than there are locked on Ethereum thus preventing some existing holders from being able to bring their funds back to Ethereum.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'the Wormhole guardians and / or Allbridge validators sign a fraudulent message allowing themselves to withdraw all locked funds.',
        },
      ],
    },
  },
  riskView: {
    validatedBy: {
      value: 'Various AMBs',
      description:
        'Allbridge taps into three different crosschain messaging protocols: Their in-house AMB with two validators, Wormhole AMB and Circle CCTP.',
      sentiment: 'warning',
    },
    destinationToken: BRIDGE_RISK_VIEW.CANONICAL_OR_WRAPPED,
  },
  contracts: {
    addresses: {
      ethereum: [
        discovery.getContractDetails(
          'LPBridge',
          'The main contract for the Allbridge liquidity network.',
        ),
        discovery.getContractDetails(
          'TokenBridge',
          'The main contract for the Allbridge token bridge.',
        ),
        discovery.getContractDetails(
          'Validator',
          'This contract is responsible for validating incoming messages to the token bridge.',
        ),
        discovery.getContractDetails(
          'FeeOracle',
          'This contract is responsible for calculating bridge fees.',
        ),
        discovery.getContractDetails(
          'GasOracle',
          'This contract is responsible for calculating crosschain gas fees.',
        ),
        discovery.getContractDetails(
          'AllbridgeMessenger',
          'Contract used to receive messages via allbridge AMB.',
        ),
        discovery.getContractDetails(
          'WormholeMessenger',
          'Contract used to receive messages via Wormhole AMB.',
        ),
        discovery.getContractDetails(
          'CctpBridge',
          'Contract used to receive messages via Circle CCTP.',
        ),
      ],
    },
    risks: [],
  },
  permissions: {
    ethereum: {
      actors: [
        discovery.getPermissionDetails(
          'TokenBridge Admin',
          discovery.getAccessControlRolePermission(
            'TokenBridge',
            'DEFAULT_ADMIN_ROLE',
          ),
          'Allowed to grant and revoke all roles in the TokenBridge (Can steal all funds).',
        ),
        discovery.getPermissionDetails(
          'TokenBridge Manager',
          discovery.getAccessControlRolePermission(
            'TokenBridge',
            'BRIDGE_MANAGER',
          ),
          'Allowed to set Validators, unlockSigners and unpause in the TokenBridge (Can steal all funds).',
        ),
        discovery.getPermissionDetails(
          'TokenBridge Token Manager',
          discovery.getAccessControlRolePermission(
            'TokenBridge',
            'TOKEN_MANAGER',
          ),
          'Allowed add and remove token support in the TokenBridge.',
        ),
        discovery.getPermissionDetails(
          'TokenBridge Stop Manager',
          discovery.getAccessControlRolePermission(
            'TokenBridge',
            'STOP_MANAGER',
          ),
          'Can pause the TokenBridge.',
        ),
        discovery.getPermissionDetails(
          'Allbridge Owner EOA.',
          discovery.getPermissionedAccounts('LPBridge', 'owner'),
          'Owner of all system contracts except TokenBridge, privileged to update messengers and other bridge parameters. As a result this account can drain all funds from the pools.',
        ),
        discovery.getPermissionDetails(
          'AllbridgeMessenger EOA.',
          discovery.formatPermissionedAccounts([
            ChainSpecificAddress(
              'eth:0x7234dB900E907398EdfAdA744d5Bf8A842B335BA',
            ),
          ]),
          'EOA delivering crosschain messages to the AllbridgeMessenger contract.',
        ),
        discovery.getPermissionDetails(
          'WormholeMessenger EOA.',
          discovery.formatPermissionedAccounts([
            ChainSpecificAddress(
              'eth:0x26f9AA5a00825d37E4ebBa0844fcCF1f852640D5',
            ),
          ]),
          'EOA delivering crosschain messages to the WormholeMessenger contract.',
        ),
        discovery.getPermissionDetails(
          'CctpBridge messenger EOA.',
          discovery.formatPermissionedAccounts([
            ChainSpecificAddress(
              'eth:0xb7C522Adb3429e2C7474df324c7a3744A5803414',
            ),
          ]),
          'EOA delivering crosschain messages to the WormholeMessenger contract.',
        ),
      ],
    },
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
