import { ProjectId, UnixTime } from '@l2beat/shared-pure'

import { BRIDGE_RISK_VIEW } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const PROJECT_ID = ProjectId('beamer-bridge-v2')
const discovery = new ProjectDiscovery(PROJECT_ID.toString())
const isPaused = discovery.getContractValue<boolean>(
  'EthereumRequestManager',
  'paused',
)

const warningText = isPaused ? 'The bridge is currently paused.' : undefined

export const beamerbridgev2: Bridge = {
  type: 'bridge',
  id: PROJECT_ID,
  addedAt: UnixTime(1688643599), // 2023-07-06T11:39:59Z
  archivedAt: UnixTime(1742774400), // 2025-03-24T00:00:00.000Z,
  display: {
    name: 'Beamer Bridge V2',
    slug: 'beamerbridgev2',
    category: 'Liquidity Network',
    warning: warningText,
    links: {
      websites: ['https://beamerbridge.com'],
      bridges: ['https://app.beamerbridge.com'],
      repositories: ['https://github.com/beamer-bridge/beamer'],
      socialMedia: [
        'https://twitter.com/BeamerBridge',
        'https://discord.gg/beamerbridge',
        'https://medium.com/@BeamerBridge',
      ],
    },
    description:
      'Beamer Bridge is an optimistic rollup-to-rollup bridge that enables direct ERC-20 asset transfers between any two EVM compatible rollups, without transitioning to L1.',
    detailedDescription:
      'It uses actors called Agents to fulfill user transfer requests on the destination chain. Users lock their assets on the source chain, and Agents provide the assets on the destination chain. Agents later receive the locked capital on the source chain by proving that they actually provided the assets on the destination chain. There is no liquidity pool, every agent participates in the cross-chain transfer by providing their own capital. Claims can ultimately be challenged on L1 using the rollups canonical bridges.',
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: discovery.getContractDetails('EthereumRequestManager').address,
        sinceTimestamp: UnixTime(1678964183),
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
    destinationToken: BRIDGE_RISK_VIEW.CANONICAL,
  },
  technology: {
    destination: ['Mainnet', 'Optimism', 'Arbitrum'],
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'The user initiates transaction to contract on Rollup 1, locking fees and assets. An Agent sends assets to user on Rollup 2. At this stage, the user is done and receives their assets on target rollup. The agent initiates the claim on the rollup, and if no one challenges the claim, the agent can withdraw the assets after 24h.',
      references: [
        {
          title: 'Beamer Bridge V2 Architecture',
          url: 'https://docs.beamerbridge.com/',
        },
      ],
      risks: [],
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
          title: 'Beamer Bridge V2 Architecture',
          url: 'https://docs.beamerbridge.com/',
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
    addresses: {
      ethereum: [
        discovery.getContractDetails('Resolver', {
          name: 'Resolver',
          description:
            'This contract resides on the L1 chain and is tasked with receiving thefill or non-fill proofs from the target L2 chain and forwarding them to the RequestManager on the source L2 chain.',
        }),
        discovery.getContractDetails('EthereumRequestManager', {
          name: 'RequestManager',
          description:
            'When a user wants to perform a transfer from Ethereum to a rollup they deposit their funds in the request manager. An agent fills the request on the target chain and can later claim the funds locked in the RequestManager.',
          pausable: {
            paused: isPaused,
            pausableBy: ['Owner'],
          },
        }),
        discovery.getContractDetails('EthereumFillManager', {
          name: 'FillManager',
          description:
            'Agents filling requests from a Rollup to Ethereum use this contract to transfer the funds to the user.',
        }),
        discovery.getContractDetails('EthereumL2Messenger', {
          name: 'EthereumL2Messenger',
          description:
            'The Ethereum L2 Messenger stores messages coming from the FillManager for a potential future L1 resolution. It takes over the job of the canonical bridges for rollups which is storing all messages going from the FillManager to the Resolution contract on L1.',
        }),
        discovery.getContractDetails('EthereumL1Messenger', {
          name: 'EthereumL1Messenger',
          description:
            'The Ethereum L1 Messenger contracts forwards messages to the RequestManager.',
        }),
        discovery.getContractDetails('OptimismL1Messenger', {
          name: 'OptimismL1Messenger',
          description:
            'The messenger contracts establish an interface for communication with the RequestManager and FillManager contracts via the rollups. The Optimism L1 Messenger is responsible for relaying the messages to the Optimism chain.',
        }),
        discovery.getContractDetails('ArbitrumL1Messenger', {
          name: 'ArbitrumL1Messenger',
          description:
            'The messenger contracts establish an interface for communication with the RequestManager and FillManager contracts via the rollups. The Arbitrum L1 Messenger is responsible for relaying the messages to the Arbitrum chain.',
        }),
      ],
    },
    risks: [],
  },
  permissions: {
    ethereum: {
      actors: [
        discovery.getPermissionDetails(
          'Owner',
          discovery.getPermissionedAccounts('EthereumRequestManager', 'owner'),
          'Can invoke admin functions on the contracts such as adding new tokens, whitelisting agents or pausing the contracts.',
        ),
        discovery.getPermissionDetails(
          'Liquidity Providers',
          discovery.getPermissionedAccounts(
            'EthereumFillManager',
            'liquidityProviders',
          ),
          'Addresses allowed to fill requests.',
        ),
      ],
    },
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
