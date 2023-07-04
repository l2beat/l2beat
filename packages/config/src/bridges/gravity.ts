import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('gravity')

export const gravity: Bridge = {
  type: 'bridge',
  id: ProjectId('gravity'),
  display: {
    name: 'Gravity',
    slug: 'gravity',
    category: 'Token Bridge',
    links: {
      websites: ['https://www.gravitybridge.net/'],
      explorers: [
        'https://www.mintscan.io/gravity-bridge',
        'https://www.skynetexplorers.com/gravity-bridge',
      ],
      apps: [
        'https://spacestation.zone/',
        'https://bridge.blockscape.network/',
      ],
      repositories: ['https://github.com/Gravity-Bridge'],
      documentation: [
        'https://www.gravitybridge.net/faq',
        'https://github.com/Gravity-Bridge/Gravity-Docs',
      ],
      socialMedia: [
        'https://twitter.com/gravity_bridge',
        'https://discord.gg/d3DshmHpXA',
      ],
    },
    description:
      'Gravity bridge is designed to connect Cosmos and Ethereum ecosystems together. The bridge is using custom blockchain called Cosmos Gravity Bridge for cross-chain message passing.',
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0xa4108aA1Ec4967F8b52220a4f7e94A8201F2D906'),
        sinceTimestamp: new UnixTime(1639416372),
        tokens: ['USDC', 'WETH', 'DAI', 'USDT', 'WBTC'],
      },
    ],
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description:
        'Transfers need to be approved by 2/3 of the validator set operating in Cosmos Gravity Bridge blockchain.',
      sentiment: 'bad',
    },
    sourceUpgradeability: RISK_VIEW.UPGRADABLE_NO,
    destinationToken: RISK_VIEW.WRAPPED,
  },
  technology: {
    destination: ['Cosmos'],
    canonical: false,
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'Gravity is a Token Bridge that locks tokens in the escrow contracts on Ethereum and mints tokens on Cosmos. The cross-chain communication is achieved using Gravity Bridge Blockchain with validators watching Ethereum network for events and minting tokens on Cosmos. Validators also approve transfers back to Ethereum via message signing.',
      references: [],
      risks: [],
    },
    validation: {
      name: 'Transfers are externally verified',
      description:
        'Transfer events on Ethereum are being watched by Validators and when they happen tokens are minted on Cosmos. When bridging back to Ethereum the message is signed by the previously mentioned blockchain and relayed to the Ethereum network where it is checked. If everything is correct the funds are released and send back to the user.',
      references: [],
      risks: [],
    },
    destinationToken: {
      name: 'Destination tokens',
      description: 'Tokens transferred end up as wrapped ERC20 proxies.',
      references: [],
      risks: [],
      isIncomplete: true,
    },
  },
  contracts: {
    addresses: [
      discovery.getContractDetails(
        'Gravity',
        'Contract holding locked assets and handling user interactions for transfers and withdrawals.',
      ),
    ],
    risks: [],
    isIncomplete: true,
  },
  permissions: [
    {
      name: 'Cosmos Validators',
      description:
        'Control Gravity contract on Ethereum, funds cannot be transfer without the signature of at least 2/3 of the validators set.',
      accounts: [],
    },
  ],
}
