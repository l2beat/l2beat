import { formatSeconds } from '@l2beat/shared-pure'
import { DA_LAYERS } from '../../../common'
import { ProjectDiscovery } from '../../../discovery/ProjectDiscovery'
import { DaEconomicSecurityRisk, DaFraudDetectionRisk } from '../types'
import { DaChallengeMechanism } from '../types/DaChallengeMechanism'
import type { DacDaLayer } from '../types/DaLayer'
import { redstoneDABridge } from './bridges/redstoneDABridge'

const discovery = new ProjectDiscovery('redstone')

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

export const redstoneDA: DacDaLayer = {
  id: 'redstone-da',
  type: 'DaLayer',
  kind: 'No DAC',
  systemCategory: 'custom',
  fallback: DA_LAYERS.ETH_CALLDATA,
  display: {
    name: 'RedstoneDA',
    slug: 'redstone',
    description:
      'RedstoneDA is a data availability solution using data availability challenges (DA Challenges).',
    links: {
      websites: [],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: [],
    },
  },
  challengeMechanism: DaChallengeMechanism.DaChallenges,
  technology: {
    description: `
    ## Architecture
    ![RedstoneDA layer](/images/da-layer-technology/redstoneda/architecture.png#center)

    ## Data Availability Challenges
    Redstone relies on DA challenges for data availability. 
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
        text: `the sequencer posts an invalid data availability commitment and there are no challengers.`,
      },
      {
        category: 'Funds can be lost if',
        text: `the sequencer posts an invalid data availability commitment, and he is able to outspend the challengers.`,
      },
    ],
  },
  bridges: [redstoneDABridge],
  risks: {
    economicSecurity: DaEconomicSecurityRisk.DAChallengesNoFunds,
    fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
  },
}
