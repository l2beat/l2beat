import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('token-gateway')

export const tokenGateway: Bridge = {
  type: 'bridge',
  id: ProjectId('token-gateway'),
  createdAt: new UnixTime(1675164709), // 2023-01-31T11:31:49Z
  display: {
    name: 'Token Gateway (Hyperbridge)',
    slug: 'token-gateway',
    description:
      'Token Gateway is a fully trust-free token bridge that puts users in control of their assets.',
    detailedDescription:
      'Token Gateway is secured from even the most malicious byzantine attacks by Hyperbridge. With over $2 billion lost due to vulnerabilities in traditional multisig bridges, it’s clear the industry needs a new approach. Token Gateway prioritizes security above all, offering a safer, trust-free approach to token bridging. It maintains a ledger of all tokens bridged across chains ensuring malicious chains can\'t withdraw more than they deposit. Token Gateway disintermediates solvers, fillers and market makers ensuring users always get 100% of their assets with no liquidity or slippage fees',
    category: 'Hybrid',
    links: {
      websites: ['https://hyperbridge.network/token-gateway'],
      apps: ['https://app.hyperbridge.network/'],
      documentation: [
        'https://docs.hyperbridge.network/',
      ],
      repositories: ['https://github.com/polytope-labs/hyperbridge'],
      socialMedia: [
        'https://x.com/hyperbridge',
        'https://x.com/token_gateway',
      ],
    },
  },
  config: {
    escrows: [],
  },
  technology: {
    canonical: false,
    destination: [
      'Arbirtum',
      'Base',
      'BNB Chain',
      'Ethereum',
      'Gnosis',
      'Optimism',
    ],
    principleOfOperation: {
      name: 'Principle of operation',
      description: `
      Token Gateway uses proofs to authorize the burning and minting of tokens.`,
      references: [
        {
          text: 'Description on Website',
          href: 'https://hyperbridge.network/token-gateway#:~:text=Chains-,Token,tokens.,-Powered',
        },
      ],
      risks: [],
    },
    validation: {
      name: 'Transfers are externally verified',
      description:
        'Transfers are validated by Hyperbridge and its permissionless network of relayers',
      references: [
        {
          text: 'Hyperbridge Docs',
          href: 'https://docs.hyperbridge.network/',
        },
      ],
      risks: [],
    },
  },
  riskView: {
    validatedBy: {
      value: 'Hyperbridge, a crypto-economic coprocessor',
      description:
        'Hyperbridge leverages its consensus proofs to attest to the correctness of the computations performed onchain',
      sentiment: 'good',
    },
    sourceUpgradeability: {
      value: 'No',
      description: `Token Gateway;s contracts are not upgradable.`,
      sentiment: 'good',
    },
    destinationToken: RISK_VIEW.CANONICAL_OR_WRAPPED,
  },
  contracts: {
    addresses: [],
    risks: [],
  },
  permissions: [],
}
