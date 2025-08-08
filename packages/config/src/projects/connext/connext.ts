import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BRIDGE_RISK_VIEW } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('connext')

export const connext: Bridge = {
  type: 'bridge',
  id: ProjectId('connext'),
  addedAt: UnixTime(1662628329), // 2022-09-08T09:12:09Z
  archivedAt: UnixTime(1682553600), // 2023-04-27T00:00:00.000Z,
  display: {
    name: 'Connext (Legacy)',
    slug: 'connext-legacy',
    category: 'Liquidity Network',
    links: {
      websites: ['https://bridge.connext.network/', 'https://connext.network/'],
      bridges: ['https://bridge.connext.network/'],
      explorers: ['https://connextscan.io/'],
      socialMedia: [
        'https://twitter.com/connextnetwork',
        'https://discord.gg/pm4TPr4w5g',
        'https://blog.connext.network/',
      ],
      documentation: ['https://docs.connext.network/'],
    },
    description:
      'Connext Bridge is a cross-chain bridge that performs atomic swap between user and a liquidity provider (on separate chains) to perform asset swap. Liquidity Providers (Routers) bid for user requests in an off-chain auction.',
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0x31eFc4AeAA7c39e54A33FDc3C46ee2Bd70ae0A09'),
        sinceTimestamp: UnixTime(1636004546),
        tokens: ['USDC', 'USDT', 'DAI', 'WBTC'],
        chain: 'ethereum',
      },
    ],
  },
  technology: {
    destination: [
      'Avalanche',
      'BNB Chain',
      'Polygon',
      'Avalanche',
      'Fantom',
      'Gnosis Chain',
      'Arbitrum One',
      'Arbitrum Nova',
    ],
    principleOfOperation: {
      name: 'Principle of Operation',
      description:
        'Connext Bridge is a cross-chain bridge that uses liquidity providers that participate in an auction with each other to fulfill a user token transfer request. Specifically, when a user intends to perform a cross-chain token transfer, they initially broadcast this intent off-chain to Routers (which are registered and run by liquidity providers, with their liquidity kept in Connext Bridge escrow on selected chains). Routers that are able and willing to commit to fulfill the transfer need to respond off-chain with a bid during a short period of time. Upon selection of a bid, the user and the Router start a peer-to-peer atomic swap process. The user communicates with TransactionManager contract on the source chain to lock their tokens and commit to the selected bid. This event triggers selected Router to lock corresponding amount on the destination chain. The user waits for this event and then relays a signed message to the destination contract (via a Relayer) to claim those funds, while the Router uses the same signed message to claim funds on the source chain. There is a timeout for this process - when it passes, both the user and the Router can reclaim their locked funds.',
      references: [],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'liquidity providers decide to never bid to fulfill transfers of a given user.',
        },
        {
          category: 'Funds can be frozen if',
          text: "liquidity provider (Router) decides to not cooperate, leaving user's funds locked for a limited period of time (e.g. 72 hours).",
        },
      ],
    },
    validation: {
      name: 'Validation',
      description:
        'A user and a Router (liquidity provider) engage in a peer-to-peer atomic swap process and both are expected to monitor each other\'s actions during the "Prepare" (lock) and "Fulfill" (claim) phases. When a Relayer is used to send a message to the destination chain, the user needs to verify that it happens, and that it happens in a timely manner.',
      references: [
        {
          title: 'Docstring for TransactionManager.sol',
          url: 'https://etherscan.deth.net/address/0x31efc4aeaa7c39e54a33fdc3c46ee2bd70ae0a09#code',
        },
      ],
      risks: [],
    },
  },
  riskView: {
    validatedBy: {
      value: 'User',
      description: 'Transfer is done via peer-to-peer atomic swap',
      sentiment: 'good',
    },
    destinationToken: {
      ...BRIDGE_RISK_VIEW.CANONICAL,
      description: BRIDGE_RISK_VIEW.CANONICAL.description,
    },
  },
  contracts: {
    addresses: {
      ethereum: [
        discovery.getContractDetails(
          'TransactionManager',
          'Escrow and logic for cross-chain transactions.',
        ),
        discovery.getContractDetails(
          'FulfillInterpreter',
          'Contract enabling execution of arbitrary calldata on a destination chain.',
        ),
      ],
    },
    risks: [],
  },
  permissions: {
    ethereum: {
      actors: [
        discovery.getPermissionDetails(
          'Owner of TransactionManager',
          discovery.getPermissionedAccounts('TransactionManager', 'owner'),
          'Can add and remove Routers and supported assets.',
        ),
      ],
    },
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
