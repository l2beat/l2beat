import { UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer3 } from '../../types'
import { Badge } from '../badges'
import { opStackL3 } from '../layer2s/templates/opStack'

const discovery = new ProjectDiscovery('ham', 'base')

export const ham: Layer3 = opStackL3({
  addedAt: new UnixTime(1722499160), // 2024-08-01T07:59:20Z
  discovery,
  additionalBadges: [Badge.L3ParentChain.Base, Badge.RaaS.Caldera],
  additionalPurposes: ['Social'],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
    name: 'Ham',
    slug: 'ham',
    description:
      'Ham Chain is an OP stack Optimium L3 on Base enabling Tips and SocialFi on the Farcaster social network.',
    links: {
      websites: ['https://ham.fun/'],
      apps: [
        'https://ham.bridge.caldera.xyz/',
        'https://ham.fun/bridge',
        'https://relay.link/ham',
      ],
      documentation: [
        'https://docs.ham.fun/',
        'https://stack.optimism.io/',
        'https://ham.fun/developers',
      ],
      explorers: ['https://explorer.ham.fun/'],
      socialMedia: [
        'https://x.com/HamOnWarpcast',
        'https://warpcast.com/~/channel/lp',
        'https://t.me/+B93fbhulpb5iYWYx',
      ],
    },
  },
  genesisTimestamp: new UnixTime(1716590734),
  celestiaDa: {
    sinceBlock: 0, // Edge Case: config added @ DA Module start
    namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAMod4SpeLVvrm6k=',
  },
  isNodeAvailable: true,
  rpcUrl: 'https://rpc.ham.fun', // chainId: 5112
})
