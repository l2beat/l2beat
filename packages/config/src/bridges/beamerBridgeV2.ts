import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const PROJECT_ID = ProjectId('beamer-bridge-v2')
const discovery = new ProjectDiscovery(PROJECT_ID.toString())

export const beamerbridgev2: Bridge = {
  type: 'bridge',
  id: PROJECT_ID,
  display: {
    name: 'Beamer Bridge V2',
    slug: 'beamerbridgev2',
    category: 'Liquidity Network',
    links: {
      websites: ['https://beamerbridge.com'],
      apps: ['https://app.beamerbridge.com'],
      repositories: ['https://github.com/beamer-bridge/beamer'],
      socialMedia: [
        'https://twitter.com/BeamerBridge',
        'https://discord.gg/beamerbridge',
        'https://medium.com/@BeamerBridge',
      ],
    },
    description:
      'Beamer Bridge is an optimistic rollup-to-rollup bridge that enables direct ERC-20 asset transfers between any two EVM compatible rollups, without transitioning to L1. It uses actors called Agents to fulfill user transfer requests on the destination chain. Users lock their assets on the source chain, and Agents provide the assets on the destination chain. Agents later receive the locked capital on the source chain by proving that they actually provided the assets on the destination chain. There is no liquidity pool, every agent participates in the cross-chain transfer by providing their own capital. Claims can ultimately be challenged on L1 using the rollups canonical bridges.',
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: discovery.getContractDetails('EthereumRequestManager').address,
        sinceTimestamp: new UnixTime(1678964183),
        tokens: ['USDC', 'WETH', 'DAI', 'USDT'],
      }),
    ],
  },
  riskView: {
    validatedBy: {
      value: 'Optimistically',
      description:
        'Claims are considered valid if no challenge is submitted within the claim period (24h). The dispute can either be resolved by the participants or escalated by making use of the canonical bridge.',
      sentiment: 'warning',
    },
    sourceUpgradeability: RISK_VIEW.UPGRADABLE_NO,
    destinationToken: RISK_VIEW.CANONICAL,
  },
  technology: {
    destination: ['Mainnet', 'Optimism', 'Arbitrum'],
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'The user initiates transaction to contract on Rollup 1, locking fees and assets. An Agent sends assets to user on Rollup 2. At this stage, the user is done and receives their assets on target rollup. The agent initiates the claim on the rollup, and if no one challenges the claim, the agent can withdraw the assets after 24h.',
      references: [
        {
          text: 'Beamer Bridge V2 Architecture',
          href: 'https://docs.beamerbridge.com/whitepaper.html',
        },
      ],
      risks: [],
      isIncomplete: true,
    },
    validation: {
      name: 'Optimistic validation with fallback to canonical bridge',
      description:
        'Claims are considered valid if no challenge is submitted within the claim period (24h). The dispute can either be resolved by the participants using an auction system or escalated by making use of the canonical bridge.',
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'an agent claim is left unchallenged for 24 hours or the L1 dispute resolution is not triggered.',
          isCritical: false,
          _ignoreTextFormatting: true,
        },
      ],
      references: [
        {
          text: 'Beamer Bridge V2 Architecture',
          href: 'https://docs.beamerbridge.com/whitepaper.html',
        },
      ],
    },
    destinationToken: {
      name: 'Destination tokens',
      description:
        'Only tokens that have been bridged using native chain bridges are supported.',
      references: [],
      risks: [],
    },
  },
  contracts: {
    addresses: [
      discovery.getContractDetails('Resolver', {
        name: 'Resolver',
        description:
          'The resolver contract is deployed on L1 and is used in the challenge game.',
      }),
      discovery.getContractDetails('EthereumL1Messenger', {
        address: EthereumAddress('0x12B8489913E2afBCed131d52c345C380BBB65baf'),
        name: 'EthereumL1Messenger',
      }),
      discovery.getContractDetails('EthereumRequestManager', {
        name: 'RequestManager',
        description:
          'Ethereum: When a user wants to perform a transfer from Ethereum to a rollup they deposit their funds in the request manager. An agent fills the request on the target chain and can later claim the funds locked in the RequestManager.',
      }),
      discovery.getContractDetails('EthereumFillManager', {
        name: 'FillManager',
        description:
          'Ethereum: Agents filling requests from a Rollup to Ethereum use this contract to transfer the funds to the user.',
      }),
      discovery.getContractDetails('EthereumL2Messenger', {
        name: 'EthereumL2Messenger',
      }),
    ],
    risks: [],
  },
  permissions: [
    {
      accounts: [
        {
          address: EthereumAddress(
            '0x42405d66fdA09dbDaC90Ff25fC5a4C2353f43E70',
          ),
          type: 'EOA',
        },
      ],
      name: 'Owner',
      description:
        'Can invoke admin functions on the contracts such as adding new tokens, whitelisting agents or pausing the contracts.',
    },
  ],
}
