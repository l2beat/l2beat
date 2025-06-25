import { ProjectId, UnixTime } from '@l2beat/shared-pure'

import type { Bridge } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

export const train: Bridge = {
  type: 'bridge',
  id: ProjectId('train'),
  addedAt: UnixTime(1741358288), // 2025-03-07T14:38:08Z
  reviewStatus: 'inReview',
  display: {
    name: 'Train',
    slug: 'train',
    category: 'Liquidity Network',
    links: {
      websites: ['https://train.tech/'],
      documentation: ['https://docs.train.tech/protocol/introduction'],
      repositories: ['https://github.com/trainprotocol'],
      socialMedia: [
        'https://x.com/trainprotocol',
        'https://t.me/trainprotocol',
      ],
    },
    description:
      'The TRAIN Protocol (TRustless Atomic INtents) is a peer-to-peer system for bridging and swapping assets. The protocol is implemented as a set of persistent, non-upgradable smart contracts deployed to all supported networks. TRAIN is built on top of an improved version of Atomic Swaps. This allows two parties—the User and the Solver—to exchange assets trustlessly across different chains. Users send their Intents to Solvers, who fulfill these Intents using Atomic Swaps.',
  },
  config: {
    escrows: [],
  },
  riskView: {
    validatedBy: {
      value: 'User',
      description:
        'The Hashed Timelock Contract (HTLC) of the solver must be verified by the user or the DApp themselves (using a trusted RPC, a light client of the destination chain or similar).',
      sentiment: 'warning',
    },
  },
  technology: {
    destination: ['Ethereum', 'Base', 'Optimism', 'Starknet', 'Arbitrum'],
  },
  discoveryInfo: getDiscoveryInfo([]),
}
