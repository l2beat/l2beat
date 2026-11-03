import { ProjectId } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import type { BaseProject } from '../../types'

export const agglayer: BaseProject = {
  id: ProjectId('agglayer'),
  slug: 'agglayer',
  name: 'Agglayer',
  shortName: undefined,
  aliases: ['Polygon'],
  addedAt: 1743677000,
  display: {
    description:
      'Agglayer is a cross-chain settlement layer that connects the liquidity and users of any blockchain for fast, low cost interoperability and growth.',
    links: {
      websites: ['https://www.agglayer.dev/'],
      bridges: ['https://portal.polygon.technology/bridge'],
      documentation: [
        'https://docs.agglayer.dev',
        'https://www.agglayer.dev/learn',
      ],
      explorers: ['https://visualizer.agglayer.dev/'],
      repositories: ['https://github.com/AggLayer'],
      socialMedia: ['https://x.com/agglayer'],
    },
    badges: [BADGES.Stack.CDKErigon, BADGES.Infra.Agglayer],
  },
  colors: {
    primary: {
      light: '#6C00F6',
      dark: '#9655FF',
    },
    secondary: {
      light: '#6C51F4',
      dark: '#7046EB',
    },
  },
  interopConfig: {
    description:
      "The canonical or trust-minimized bridge: Agglayer supports transfers to/from Ethereum as well as native interop within the Agglayer cluster of chains. L1<->L2 transfers are validated by validity or accounting proofs. Agglayer interop supports the secure participation of chains without state transition proofs via 'pessimistic proofs'.",
    plugins: [
      {
        plugin: 'agglayer',
        bridgeType: 'lockAndMint',
      },
      {
        plugin: 'agglayer',
        bridgeType: 'burnAndMint',
      },
    ],
    type: 'canonical',
  },
}
