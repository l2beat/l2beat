import { UnixTime, formatSeconds } from '@l2beat/shared-pure'
import {
  DA_LAYERS,
  DaCommitteeSecurityRisk,
  DaEconomicSecurityRisk,
  DaFraudDetectionRisk,
  DaRelayerFailureRisk,
  DaUpgradeabilityRisk,
  REASON_FOR_BEING_OTHER,
} from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { DACHALLENGES_DA_PROVIDER, opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('funki')
const genesisTimestamp = UnixTime(1721211095)

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

export const funki: ScalingProject = opStackL2({
  capability: 'universal',
  addedAt: UnixTime(1728289959), // 2024-10-07T08:32:39Z
  additionalBadges: [BADGES.RaaS.AltLayer],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
    name: 'Funki',
    slug: 'funki',
    description:
      'Funki chain is an OP Stack Optimium on Ethereum reimagining the blockchain experience as an interconnected world brimming with wonder, adventure, and fun.',
    category: 'Optimium',
    stack: 'OP Stack',
    links: {
      websites: ['https://funkichain.com'],
      apps: ['https://funkichain.com/bridge', 'https://swap.funkichain.com'],
      documentation: ['https://docs.funkichain.com/'],
      explorers: ['https://funkiscan.io/'],
      repositories: ['https://github.com/funkichain'],
      socialMedia: [
        'https://x.com/funkichain',
        'https://facebook.com/funkichain',
        'https://instagram.com/funkichain',
        'https://t.me/funkichain',
      ],
    },
  },
  daProvider: DACHALLENGES_DA_PROVIDER(
    daChallengeWindow,
    daResolveWindow,
    'https://github.com/ethereum-optimism/optimism/releases/tag/v1.7.7',
    DA_LAYERS.OP_ALT_DA,
  ), // source: altlayer on telegram
  isNodeAvailable: 'UnderReview',
  chainConfig: {
    name: 'funki',
    chainId: 33979,
    explorerUrl: 'https://funkiscan.io',
    sinceTimestamp: genesisTimestamp,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc-mainnet.funkichain.com',
        callsPerMinute: 1500,
      },
    ],
  },
  discovery,
  genesisTimestamp,
  customDa: {
    type: 'DA Challenges',
    name: 'Altlayer DA',
    description:
      'Altlayer DA is a data availability solution using data availability challenges (DA Challenges).',
    challengeMechanism: 'DA Challenges',
    fallback: DA_LAYERS.ETH_CALLDATA,
    technology: {
      description: `
  ## Architecture
  ![gmnetworkDA layer](/images/da-layer-technology/gmnetworkda/architecture.png#center)
  
  ## Data Availability Challenges
  The project relies on DA challenges for data availability. 
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
