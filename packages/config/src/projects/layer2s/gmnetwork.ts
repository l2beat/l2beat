import { UnixTime, formatSeconds } from '@l2beat/shared-pure'
import { DA_LAYERS } from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import {
  DaCommitteeSecurityRisk,
  DaEconomicSecurityRisk,
  DaFraudDetectionRisk,
  DaRelayerFailureRisk,
  DaUpgradeabilityRisk,
} from '../da-beat/common'
import { DACHALLENGES_DA_PROVIDER, opStackL2 } from './templates/opStack'
import type { Layer2 } from './types'

const discovery = new ProjectDiscovery('gmnetwork')

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

export const gmnetwork: Layer2 = opStackL2({
  createdAt: new UnixTime(1732028588), // 2024-11-19T15:03:08
  discovery,
  additionalBadges: [
    Badge.DA.CustomDA,
    Badge.Infra.Superchain,
    Badge.RaaS.AltLayer,
  ],
  additionalPurposes: ['AI'],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
    name: 'GM Network',
    slug: 'gmnetwork',
    architectureImage: 'opstack-dachallenge',
    description:
      'GM Network is an OP stack L2 in alt-DA mode aiming to deepen the integration of smart, connected devices within everyday human activities by blending Artificial Intelligence and the Internet of Things.',
    links: {
      websites: ['https://gmnetwork.ai/'],
      apps: ['https://bridge.gmnetwork.ai/'],
      documentation: ['https://docs.gmnetwork.ai/docs'],
      explorers: ['https://scan.gmnetwork.ai/'],
      repositories: [],
      socialMedia: [
        'https://x.com/gmnetwork_ai',
        'https://instagram.com/gmnetwork.ai',
        'https://medium.com/@gmnetwork',
        'https://youtube.com/@gmnetwork_ai',
        'https://discord.com/invite/m4VF9WqzK8',
        'https://t.me/GMNetwork_AI',
        'https://t.me/QuestN_Announcement',
      ],
    },
  },
  daProvider: DACHALLENGES_DA_PROVIDER(
    daChallengeWindow,
    daResolveWindow,
    'https://github.com/ethereum-optimism/optimism/releases/tag/op-node%2Fv1.7.5',
    DA_LAYERS.OP_ALT_DA,
  ), // source: altlayer on telegram
  genesisTimestamp: new UnixTime(1717656409),
  rpcUrl: 'https://rpc.gmnetwork.ai/',
  discoveryDrivenData: true,
  dataAvailabilitySolution: {
    type: 'DaLayer',
    kind: 'No DAC',
    display: {
      name: 'GM Network DA',
      description:
        'GM Network DA is a data availability solution using data availability challenges (DA Challenges).',
    },
    systemCategory: 'custom',
    fallback: DA_LAYERS.ETH_CALLDATA,
    challengeMechanism: 'DA Challenges',
    technology: {
      description: `
      ## Architecture
      ![gmnetworkDA layer](/images/da-layer-technology/gmnetworkda/architecture.png#center)
  
      ## Data Availability Challenges
      GM Network relies on DA challenges for data availability. 
      The DA Provider submits an input commitment on Ethereum, and users can request the data behind the commitment off-chain from the DA Provider.
      If a DA challenger finds that the data behind a tx data commitment is not available, they can submit a challenge which requires locking a bond within ${daChallengeWindow}. 
      A challenge can be resolved by publishing the preimage data within an additional ${daResolveWindow}.
      In such case, a portion of the challenger bond is burned, with the exact amount estimated as the cost incurred by the resolver to publish the full data, meaning that the resolver and challenger will approximately lose the same amount of funds.
      The system is not secure if the malicious sequencer is able to outspend the altruistic challengers. 
      If instead, after a challenge, the preimage data is not published, the chain reorgs to the last fully derivable state.
    `,
      references: [
        {
          text: 'Alt-DA Specification',
          href: 'https://github.com/ethereum-optimism/specs/blob/main/specs/experimental/alt-da.md',
        },
        {
          text: 'Security Considerations - Ethresear.ch ',
          href: 'https://ethresear.ch/t/universal-plasma-and-da-challenges/18629',
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
    bridge: {
      createdAt: new UnixTime(1723022143), // 2024-04-03T10:08:59Z
      type: 'IntegratedDacBridge',
      technology: {
        description: `Only hashes of data batches are posted as DA commitments to an EOA on Ethereum.
          However, there is a mechanism that allows users to challenge unavailability of data. \n`,
      },
      requiredMembers: 0,
      membersCount: 0,
      hideMembers: true,
      transactionDataType: 'Transaction data',
      risks: {
        committeeSecurity: DaCommitteeSecurityRisk.NoCommitteeSecurity(),
        upgradeability: DaUpgradeabilityRisk.LowOrNoDelay(), // no delay
        relayerFailure: DaRelayerFailureRisk.NoMechanism,
      },
    },
    risks: {
      economicSecurity: DaEconomicSecurityRisk.DAChallengesNoFunds,
      fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
    },
  },
})
