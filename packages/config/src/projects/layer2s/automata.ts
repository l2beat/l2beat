import { UnixTime, formatSeconds } from '@l2beat/shared-pure'
import { DA_LAYERS } from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import {
  DaCommitteeSecurityRisk,
  DaEconomicSecurityRisk,
  DaFraudDetectionRisk,
  DaRelayerFailureRisk,
  DaUpgradeabilityRisk,
} from '../da-beat/common'
import { DACHALLENGES_DA_PROVIDER, opStackL2 } from './templates/opStack'

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
  addedAt: new UnixTime(1729359609), // 2024-10-19T17:40:09Z
  additionalBadges: [Badge.RaaS.AltLayer],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
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
  customDa: {
    type: 'DA Challenges',
    name: 'Automata DA',
    description:
      'Automata DA is a data availability solution using data availability challenges (DA Challenges).',
    challengeMechanism: 'DA Challenges',
    fallback: DA_LAYERS.ETH_CALLDATA,
    technology: {
      description: `
## Architecture
![gmnetworkDA layer](/images/da-layer-technology/gmnetworkda/architecture.png#center)

## Data Availability Challenges
Automata relies on DA challenges for data availability. 
The DA Provider submits an input commitment on Ethereum, and users can request the data behind the commitment off-chain from the DA Provider.
If a DA challenger finds that the data behind a tx data commitment is not available, they can submit a challenge which requires locking a bond within ${daChallengeWindow}. 
A challenge can be resolved by publishing the preimage data within an additional ${daResolveWindow}.
In such case, a portion of the challenger bond is burned, with the exact amount estimated as the cost incurred by the resolver to publish the full data, meaning that the resolver and challenger will approximately lose the same amount of funds.
The system is not secure if the malicious sequencer is able to outspend the altruistic challengers. 
If instead, after a challenge, the preimage data is not published, the chain reorgs to the last fully derivable state.

## DA Bridge
Only hashes of data batches are posted as DA commitments to an EOA on Ethereum.
However, there is a mechanism that allows users to challenge unavailability of data.
    `,
      references: [
        {
          title: 'Alt-DA Specification',
          url: 'https://github.com/ethereum-optimism/specs/blob/main/specs/experimental/alt-da.md',
        },
        {
          title: 'Security Considerations - Ethresear.ch ',
          url: 'https://ethresear.ch/t/universal-plasma-and-da-challenges/18629',
        },
      ],
      risks: [
        {
          category: 'Funds can be lost if',
          text: `the sequencer posts an invalid data availability certificate and there are no challengers.`,
        },
        {
          category: 'Funds can be lost if',
          text: `the sequencer posts an invalid data availability certificate, and he is able to outspend the challengers.`,
        },
      ],
    },
    risks: {
      economicSecurity: DaEconomicSecurityRisk.DAChallengesNoFunds,
      fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
      committeeSecurity: DaCommitteeSecurityRisk.NoCommitteeSecurity(),
      upgradeability: DaUpgradeabilityRisk.LowOrNoDelay(), // no delay
      relayerFailure: DaRelayerFailureRisk.NoMechanism,
    },
  },
})
