import { UnixTime } from '@l2beat/shared-pure'

import { DERIVATION, REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { CELESTIA_DA_PROVIDER, opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('publicgoodsnetwork')

export const publicgoodsnetwork: ScalingProject = opStackL2({
  addedAt: UnixTime(1690446197), // 2023-07-27T08:23:17Z
  archivedAt: UnixTime(1734048000), // 2024-12-13T00:00:00.000Z,
  additionalBadges: [BADGES.Infra.Superchain, BADGES.RaaS.Conduit],
  daProvider: CELESTIA_DA_PROVIDER,
  discovery,
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
    name: 'Public Goods Network',
    shortName: 'PGN',
    slug: 'publicgoodsnetwork',
    headerWarning:
      'PGN was sunset in June 2024 and the centralized operator stopped their service. The current canonical bridge escrow contracts are modified to allow for [withdrawals of ETH and ERC-20s based on a pre-configured merkle root](https://gov.gitcoin.co/t/updating-pgns-contract-to-make-funds-easier-to-claim/19569).',
    description:
      'Public Goods Network is an OP stack chain focused on funding public goods.',
    links: {
      websites: ['https://publicgoods.network/'],
      bridges: ['https://bridge.publicgoods.network/'],
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
  genesisTimestamp: UnixTime(1689108083),
  stateDerivation: DERIVATION.OPSTACK('PGN'),
  isNodeAvailable: true,
  milestones: [
    {
      title: 'PGN unpauses the bridge',
      url: 'https://app.blocksec.com/explorer/tx/eth/0x49a8691bef3d6a1434deaa801240af5aeeb4e95034a31564947b23ca6587d276',
      date: '2024-12-17T00:00:00.00Z',
      description:
        'PGN unpauses the bridge after claiming contracts are updated.',
      type: 'general',
    },
    {
      title: 'PGN starts sunset process',
      url: 'https://app.blocksec.com/explorer/tx/eth/0xaf8648b0e0a28902f7cfcc544d520a45d8df8217bba016c4a2f01aaf2bf39556',
      date: '2024-12-10T00:00:00.00Z',
      description: 'PGN starts its shutdown by pausing the bridge.',
      type: 'incident',
    },
    {
      title: 'Public Goods Network Launch',
      url: 'https://twitter.com/pgn_eth/status/1676972199423668228',
      date: '2023-07-06T00:00:00.00Z',
      description: 'The Public Goods Network is live on mainnet.',
      type: 'general',
    },
    {
      title: 'PGN switches to Celestia',
      url: 'https://x.com/conduitxyz/status/1750596065609572398',
      date: '2024-01-26T00:00:00.00Z',
      type: 'general',
    },
  ],
})
