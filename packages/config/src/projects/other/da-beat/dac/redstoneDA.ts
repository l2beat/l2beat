import { DaEconomicSecurityRisk, DaFraudDetectionRisk } from '../types'
import { DaLayer } from '../types/DaLayer'

export const redstoneDA: DaLayer = {
  id: 'redstone-da',
  type: 'DaLayer',
  kind: 'DAC',
  display: {
    name: 'RedstoneDA',
    slug: 'redstoneDA',
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
  technology: `
    ## Data Availability Challenges
    Redstone relies on DA challenges for data availability. 
    If a DA challenger finds that the data behind a tx data commitment is not available, they can submit a challenge which requires locking a bond within ${daChallengeWindow}. 
    A challenge can be resolved by publishing the preimage data within an additional ${daResolveWindow}.
    In such case, a portion of the challenger bond is burned, with the exact amount estimated as the cost incurred by the resolver to publish the full data, meaning that the resolver and challenger will approximately lose the same amount of funds.
    The system is not secure if the malicious sequencer is able to outspend the altruistic challengers. 
    If instead, after a challenge, the preimage data is not published, the chain reorgs to the last fully derivable state.
  `,
  bridges: [],
  usedIn: [],
  risks: {
    economicSecurity: DaEconomicSecurityRisk.Unknown,
    fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
  },
}
