import { UnixTime, formatSeconds } from '@l2beat/shared-pure'
import { DA_LAYERS } from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common/ReasonForBeingInOther'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { DACHALLENGES_DA_PROVIDER, opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('automata')

const daChallengeWindow = formatSeconds(
  discovery.getContractValue<number>(
    'DataAvailabilityChallenge',
    'challengeWindow',
  ) * 12, // in blocks, to seconds
)

const daResolveWindow = formatSeconds(
  discovery.getContractValue<number>(
    'DataAvailabilityChallenge',
    'resolveWindow',
  ) * 12, // in blocks, to seconds
)

export const automata: Layer2 = opStackL2({
  createdAt: new UnixTime(1729359609), // 2024-10-19T17:40:09Z
  additionalBadges: [
    Badge.DA.CustomDA,
    Badge.Infra.Superchain,
    Badge.RaaS.AltLayer,
  ],
  display: {
    reasonsForBeingOther: [
      REASON_FOR_BEING_OTHER.NO_PROOFS,
      REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
    ],
    name: 'Automata',
    slug: 'automata',
    description:
      'Automata Network is an OP stack based Layer 2 Optimium acting as a modular attestation layer that extends machine-level trust to Ethereum with TEE Coprocessors and an EigenLayer AVS.',
    links: {
      websites: ['https://ata.network/'],
      apps: ['https://bridge.ata.network/'],
      documentation: ['https://docs.ata.network/'],
      explorers: ['https://explorer.ata.network'],
      repositories: ['https://github.com/automata-network/automata'],
      socialMedia: [
        'https://x.com/AutomataNetwork',
        'https://discord.com/invite/automata',
        'https://blog.ata.network/',
        'https://ata.ws/telegram',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  associatedTokens: ['ATA'],
  nonTemplateOptimismPortalEscrowTokens: ['ATA'],
  isNodeAvailable: 'UnderReview',
  rpcUrl: 'https://rpc.ata.network/',
  discovery,
  genesisTimestamp: new UnixTime(1721183063),
  daProvider: DACHALLENGES_DA_PROVIDER(
    daChallengeWindow,
    daResolveWindow,
    'https://github.com/ethereum-optimism/optimism/releases/tag/v1.7.7',
    DA_LAYERS.OP_ALT_DA,
  ), // source: altlayer on telegram
  discoveryDrivenData: true,
})
