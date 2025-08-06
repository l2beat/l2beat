import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('everclearbridge')

export const everclearbridge: Bridge = {
  type: 'bridge',
  id: ProjectId('everclearbridge'),
  addedAt: UnixTime(1742199959), // 2025-03-17
  reviewStatus: 'inReview',
  display: {
    name: 'Everclear',
    slug: 'everclearbridge',
    category: 'Liquidity Network',
    links: {
      websites: ['https://everclear.org/'],
      documentation: ['https://docs.everclear.org/'],
      explorers: ['https://explorer.everclear.org/intents'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/everclearorg',
        'https://everclear.org/blog',
        'https://t.me/EverclearCommunity',
        'https://discord.gg/everclear',
      ],
    },
    description:
      'Everclear is an intent- and clearing bridge that coordinates the global settlement of liquidity between chains, solving fragmentation for modular blockchains.',
  },
  config: {
    associatedTokens: ['CLEAR', 'NEXT'],
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0xa05A3380889115bf313f1Db9d5f335157Be4D816',
        ),
        tokens: '*',
        description:
          'The Spoke contract on Ethereum which escrows funds for the bridge.',
      }),
      {
        address: EthereumAddress('0xa05A3380889115bf313f1Db9d5f335157Be4D816'),
        sinceTimestamp: UnixTime(1726461757),
        includeInTotal: false,
        tokens: '*',
        chain: 'arbitrum',
      },
      {
        address: EthereumAddress('0xa05A3380889115bf313f1Db9d5f335157Be4D816'),
        sinceTimestamp: UnixTime(1726461429),
        includeInTotal: false,
        tokens: '*',
        chain: 'optimism',
      },
      {
        address: EthereumAddress('0xa05A3380889115bf313f1Db9d5f335157Be4D816'),
        sinceTimestamp: UnixTime(1726461945),
        includeInTotal: false,
        tokens: '*',
        chain: 'base',
      },
      {
        address: EthereumAddress('0xc24dC29774fD2c1c0c5FA31325Bb9cbC11D8b751'),
        sinceTimestamp: UnixTime(1737656378),
        includeInTotal: false,
        tokens: '*',
        chain: 'linea',
      },
      {
        address: EthereumAddress('0x9ADA72CCbAfe94248aFaDE6B604D1bEAacc899A7'),
        sinceTimestamp: UnixTime(1736383193),
        includeInTotal: false,
        tokens: '*',
        chain: 'blast',
      },
    ],
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description:
        'The Hyperlane message protocol is used. If the verifier (called ISM, default is a multisig) agrees on a message, it is considered verified and can be executed at the destination.',
      sentiment: 'bad',
    },
  },
  technology: {
    destination: [
      'Optimism',
      'BSC',
      'Base',
      'Arbitrum',
      'Linea',
      'Polygon',
      'Avalanche',
      'Blast',
      'Unichain',
      'Taiko',
      'Mode',
      'Scroll',
      'Zircuit',
    ],
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
