import { UnixTime } from '@l2beat/shared-pure'

import { DERIVATION } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { CELESTIA_DA_PROVIDER, opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('publicgoodsnetwork')

const isPaused = discovery.getContractValue<boolean>('OptimismPortal', 'paused')

export const publicgoodsnetwork: Layer2 = opStackL2({
  isArchived: true,
  createdAt: new UnixTime(1690446197), // 2023-07-27T08:23:17Z
  additionalBadges: [
    Badge.DA.Celestia,
    Badge.Infra.Superchain,
    Badge.RaaS.Conduit,
  ],
  daProvider: CELESTIA_DA_PROVIDER,
  discovery,
  display: {
    name: 'Public Goods Network',
    shortName: 'PGN',
    slug: 'publicgoodsnetwork',
    headerWarning: isPaused
      ? 'The OptimismPortal is paused, withdrawals from the canonical bridge are not possible.'
      : undefined,
    description:
      'Public Goods Network is an OP stack chain focused on funding public goods.',
    links: {
      websites: ['https://publicgoods.network/'],
      apps: ['https://bridge.publicgoods.network/'],
      documentation: ['https://docs.publicgoods.network/'],
      explorers: [
        'https://explorer.publicgoods.network',
        'https://pgn.superscan.network',
      ],
      repositories: [
        'https://github.com/supermodularxyz/pgn-monorepo',
        'https://github.com/supermodularxyz/pgn-docs',
      ],
      socialMedia: ['https://twitter.com/pgn_eth'],
    },
  },
  genesisTimestamp: new UnixTime(1689108083),
  stateDerivation: DERIVATION.OPSTACK('PGN'),
  isNodeAvailable: true,
  milestones: [
    {
      name: 'PGN pauses the bridge',
      link: 'https://app.blocksec.com/explorer/tx/eth/0xaf8648b0e0a28902f7cfcc544d520a45d8df8217bba016c4a2f01aaf2bf39556',
      date: '2024-12-10T00:00:00.00Z',
      description: 'PGN starts sunset process.',
      type: 'incident',
    },
    {
      name: 'Public Goods Network Launch',
      link: 'https://twitter.com/pgn_eth/status/1676972199423668228',
      date: '2023-07-06T00:00:00.00Z',
      description: 'The Public Goods Network is live on mainnet.',
      type: 'general',
    },
    {
      name: 'PGN switches to Celestia',
      link: 'https://x.com/conduitxyz/status/1750596065609572398',
      date: '2024-01-26T00:00:00.00Z',
      type: 'general',
    },
  ],
  discoveryDrivenData: true,
})
