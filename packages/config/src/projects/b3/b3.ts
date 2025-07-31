import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { CELESTIA_DA_PROVIDER, opStackL3 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('b3')

export const b3: ScalingProject = opStackL3({
  addedAt: UnixTime(1722376845),
  additionalBadges: [
    BADGES.DA.Celestia,
    BADGES.RaaS.Caldera,
    BADGES.L3ParentChain.Base,
  ],
  daProvider: CELESTIA_DA_PROVIDER,
  hostChain: 'base',
  discovery,
  additionalPurposes: ['Gaming'],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
    name: 'B3',
    slug: 'b3',
    architectureImage: 'B3',
    description:
      'B3 is an L3 built on Base to bring gamers and game creators onchain, powered by the OP Stack and Celestia DA.',
    links: {
      websites: ['https://b3.fun/'],
      bridges: ['https://bridge.b3.fun/'],
      documentation: ['https://docs.b3.fun/'],
      explorers: ['https://explorer.b3.fun/'],
      repositories: [],
      socialMedia: [
        'https://x.com/b3dotfun',
        'https://discord.com/invite/b3dotfun',
        'https://warpcast.com/b3dotfun',
      ],
    },
  },
  chainConfig: {
    name: 'b3',
    chainId: 8333,
    explorerUrl: 'https://explorer.b3.fun',
    apis: [
      {
        type: 'rpc',
        url: 'https://mainnet-rpc.b3.fun/http',
        callsPerMinute: 800,
      },
      { type: 'blockscout', url: 'https://explorer.b3.fun/api/v2/' },
    ],
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
  genesisTimestamp: UnixTime(1722378840),
  celestiaDa: {
    sinceBlock: 0, // Edge Case: config added @ DA Module start
    namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAMod4SqMAivUaAM=',
  },
  isNodeAvailable: false,
  milestones: [
    {
      title: 'B3 Open Mainnet Launch',
      url: 'https://cryptoslate.com/press-releases/b3-fun-debuts-mainnet-with-record-breaking-367k-wallets-and-47m-transactions-in-just-1-month-of-testnet/',
      date: '2024-08-15T00:00:00.00Z',
      description: 'B3 opens the mainnet to the public.',
      type: 'general',
    },
  ],
})
