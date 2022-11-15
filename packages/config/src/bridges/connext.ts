import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const connext: Bridge = {
  type: 'bridge',
  id: ProjectId('connext'),
  display: {
    name: 'Connext',
    slug: 'connext',
    links: {
      websites: [
        'https://bridge.connext.network/',
        'https://www.connext.network/',
      ],
      apps: ['https://bridge.connext.network/'],
      explorers: ['https://connextscan.io/'],
      socialMedia: [
        'http://twitter.com/connextnetwork',
        'https://discord.gg/pm4TPr4w5g',
        'https://blog.connext.network/',
      ],
      documentation: ['https://docs.connext.network/'],
      repositories: ['https://github.com/CoinHippo-Labs/connext-bridge'],
    },
  },
  config: {
    escrows: [
      {
        address: '0x31eFc4AeAA7c39e54A33FDc3C46ee2Bd70ae0A09',
        sinceTimestamp: new UnixTime(1636004546),
        tokens: ['USDC', 'USDT', 'DAI', 'WBTC'],
      },
    ],
  },
  technology: {
    category: 'Liquidity Network',
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
          text: "liquidity provider (Router) decides to not cooperate, living user's funds locked for a limited period of time."
        },
      ],
    },
    validation: {
      name: 'Validation',
      description: 
        'A user and a Router (liquidity provider) engage in a peer-to-peer atomic swap process and both are expected to monitor each other\'s actions during the "Prepare" (lock) and "Fulfill" (claim) phases. When a Relayer is used to send a message to the destination chain, the user needs to verify that it happens, and that it happens in a timely manner.',
      references: [
        {
          text: 'Docstring for TransactionManager.sol',
          href: 'https://etherscan.deth.net/address/0x31efc4aeaa7c39e54a33fdc3c46ee2bd70ae0a09#code'
        }
      ],
      risks: []
    }
  },
}
