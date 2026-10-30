import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getOpStackDaTracking, opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('codex')

export const codex: ScalingProject = opStackL2({
  ecosystemInfo: {
    id: ProjectId('superchain'),
    isPartOfSuperchain: false,
  },
  addedAt: UnixTime(1793361600), // 2026-10-30T12:00:00Z
  discovery,
  daTracking: [
    // Previously tracked as a sovereign project in ethereum.ts with lowercase
    // addresses; kept verbatim so its configuration id (and indexed data) survives.
    {
      type: 'ethereum',
      daLayer: ProjectId('ethereum'),
      sinceBlock: 20953494,
      untilBlock: 26305598,
      inbox: '0x8c12f051c161c2cda736f3b3fa1c4bdd35b7922c',
      sequencers: ['0xb5bd290ef8ef3840cb866c7a8b7cc9e45fde3ab9'],
    },
    getOpStackDaTracking(discovery, { sinceBlock: 26305598 }),
  ],
  genesisTimestamp: UnixTime(1728898067),
  additionalBadges: [BADGES.RaaS.Conduit],
  additionalPurposes: ['Payments'],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'Codex',
    warning:
      'The fault proof system is deployed but is not functional. The dispute games commit to op-program v1.6.0, which predates the Jovian hardfork active on the chain and does not include its chain ID in the embedded superchain registry snapshot, so no dispute can be resolved by execution. Security relies entirely on the permissioned proposer and challenger.',
    slug: 'codex',
    description:
      'Codex is an OP Stack rollup on Ethereum purpose-built for stablecoin-native payments, FX and settlement.',
    links: {
      websites: ['https://codex.xyz/'],
      documentation: ['https://docs.codex.xyz/'],
      explorers: ['https://explorer.codex.xyz'],
      repositories: ['https://github.com/Codex-Data'],
      socialMedia: [
        'https://x.com/CodexFX',
        'https://linkedin.com/company/codexfx',
      ],
    },
  },
  chainConfig: {
    name: 'codex',
    chainId: 81224,
    explorerUrl: 'https://explorer.codex.xyz',
    sinceTimestamp: UnixTime(1728898067),
    gasTokens: ['ETH'],
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.codex.xyz',
        callsPerMinute: 300,
      },
    ],
  },
  isNodeAvailable: 'UnderReview',
})
