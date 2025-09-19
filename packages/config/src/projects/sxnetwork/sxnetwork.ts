import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'

import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { AnytrustDAC } from '../../templates/anytrust-template'
import { orbitStackL2 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('sxnetwork')

export const sxnetwork: ScalingProject = orbitStackL2({
  addedAt: UnixTime(1722430544), // 2024-07-31T12:55:44Z
  discovery,
  additionalBadges: [BADGES.RaaS.Gelato],
  additionalPurposes: ['Betting'],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    name: 'SX Network',
    slug: 'sxnetwork',
    description:
      "SX Network is an Orbit stack Optimium, built to scale the SX team's existing sports betting platform.",
    links: {
      websites: ['https://sx.technology/'],
      bridges: [
        'https://sx.bet/wallet/bridge',
        'https://bridge.gelato.network/bridge/sx-rollup',
      ],
      documentation: ['https://docs.sx.technology/'],
      repositories: ['https://github.com/sx-network'],
      explorers: ['https://explorerl2.sx.technology/'],
      socialMedia: [
        'https://x.com/SX_Network',
        'https://discord.com/invite/sxnetwork',
      ],
    },
  },
  isNodeAvailable: 'UnderReview',
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  associatedTokens: ['SX'],
  chainConfig: {
    name: 'sxnetwork',
    chainId: 4162,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.sx-rollup.gelato.digital',
        callsPerMinute: 300,
      },
    ],
    gasTokens: ['SX'],
  },
  activityConfig: {
    type: 'block',
    adjustCount: { type: 'SubtractOne' },
    startBlock: 1,
  },
  customDa: AnytrustDAC({ discovery, hostChain: 'ethereum' }),
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      // ERC20 Gateway
      address: ChainSpecificAddress(
        'eth:0xB4968C66BECc8fb4f73b50354301c1aDb2Abaa91',
      ),
      tokens: '*',
      description:
        'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, "wrapped" token will be minted.',
    }),
  ],
})
