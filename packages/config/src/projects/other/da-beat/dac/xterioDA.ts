import { formatSeconds } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../discovery/ProjectDiscovery'
import { DaEconomicSecurityRisk, DaFraudDetectionRisk } from '../types'
import { DaChallengeMechanism } from '../types/DaChallengeMechanism'
import { DaLayer } from '../types/DaLayer'
import { linkByDA } from '../utils/link-by-da'
import { xterioDABridge } from './bridges/xterioDABridge'

const discovery = new ProjectDiscovery('xterio')

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

export const xterioDA: DaLayer = {
  id: 'xterio-da',
  type: 'DaLayer',
  kind: 'No DAC',
  systemCategory: 'custom',
  fallback: 'Ethereum (calldata)',
  display: {
    name: 'XterioDA',
    slug: 'xterio',
    description:
      'XterioDA is a data availability solution using data availability challenges (DA Challenges).',
    links: {
      websites: ['https://xter.io/'],
      apps: ['https://xter.io/', 'https://eth-bridge.xter.io/'],
      documentation: ['https://stack.optimism.io/'],
      explorers: ['https://eth.xterscan.io/'],
      repositories: ['https://github.com/XterioTech'],
      socialMedia: [
        'https://x.com/XterioGames',
        'https://discord.gg/xterio',
        'https://medium.com/@XterioGames',
      ],
    },
  },
  challengeMechanism: DaChallengeMechanism.DaChallenges,
  technology: {
    description: `
    ## Architecture
    ![XterioDA layer](/images/da-layer-technology/xterioda/architecture.png#center)

    ## Data Availability Challenges
    Xterio relies on DA challenges for data availability. 
    The DA Provider submits an input commitment on Ethereum, and users can request the data behind the commitment off-chain from the DA Provider.
    If a DA challenger finds that the data behind a tx data commitment is not available, they can submit a challenge which requires locking a bond within ${daChallengeWindow}. 
    A challenge can be resolved by publishing the preimage data within an additional ${daResolveWindow}.
    In such case, a portion of the challenger bond is burned, with the exact amount estimated as the cost incurred by the resolver to publish the full data, meaning that the resolver and challenger will approximately lose the same amount of funds.
    The system is not secure if the malicious sequencer is able to outspend the altruistic challengers. 
    If instead, after a challenge, the preimage data is not published, the chain reorgs to the last fully derivable state. For more details, see the OP [Alt-da specification](https://github.com/ethereum-optimism/specs/blob/main/specs/experimental/alt-da.md) and this [Ethresear.ch post](https://ethresear.ch/t/universal-plasma-and-da-challenges/18629) discussing security considerations.
  `,
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
  bridges: [xterioDABridge],
  usedIn: linkByDA({
    layer: (layer) => layer === 'XterioDA',
  }),
  risks: {
    economicSecurity: DaEconomicSecurityRisk.DAChallengesNoFunds,
    fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
  },
}
