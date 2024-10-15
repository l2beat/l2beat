import { formatSeconds } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../../../discovery/ProjectDiscovery'
import { NO_BRIDGE } from '../templates/no-bridge-template'
import { DaEconomicSecurityRisk, DaFraudDetectionRisk } from '../types'
import { DaLayer } from '../types/DaLayer'
import { linkByDA } from '../utils/link-by-da'

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

export const redstoneDA: DaLayer = {
  id: 'redstone-da',
  type: 'DaLayer',
  kind: 'DAC',
  display: {
    name: 'RedstoneDA',
    slug: 'redstone',
    description:
      'RedstoneDA is a data availability solution using data availability challenges (DA Challenges).',
    links: {
      websites: ['https://redstone.xyz/'],
      apps: ['https://redstone.xyz/deposit'],
      documentation: ['https://redstone.xyz/docs'],
      explorers: ['https://explorer.redstone.xyz/'],
      repositories: ['https://github.com/latticexyz/redstone'],
      socialMedia: [
        'https://twitter.com/redstonexyz',
        'https://discord.com/invite/latticexyz',
      ],
    },
  },
  technology: {
    description: `
    ## Data Availability Challenges
    Redstone relies on DA challenges for data availability. 
    The DA Provider submits an input commitment on Ethereum, and users can request the data behind the commitment off-chain from the DA Provider.
    If a DA challenger finds that the data behind a tx data commitment is not available, they can submit a challenge which requires locking a bond within ${daChallengeWindow}. 
    A challenge can be resolved by publishing the preimage data within an additional ${daResolveWindow}.
    In such case, a portion of the challenger bond is burned, with the exact amount estimated as the cost incurred by the resolver to publish the full data, meaning that the resolver and challenger will approximately lose the same amount of funds.
    The system is not secure if the malicious sequencer is able to outspend the altruistic challengers. 
    If instead, after a challenge, the preimage data is not published, the chain reorgs to the last fully derivable state.
  `,
  },
  bridges: [
    NO_BRIDGE({
      layer: 'RedstoneDA',
      description:
        'The risk profile in this page refers to scaling solutions that do not integrate with a data availability bridge.',
      technology: {
        description: `No DA bridge is selected. Without a DA bridge, Ethereum has no proof of data availability for this project.
        However, there is a mechanism that allows users to challenge unavailability of data. \n`,
      },
    }),
  ],
  usedIn: linkByDA({
    layer: (layer) => layer === 'RedstoneDA',
  }),
  risks: {
    economicSecurity: DaEconomicSecurityRisk.Unknown,
    fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
  },
}
