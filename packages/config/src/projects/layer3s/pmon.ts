import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { Badge } from '../badges'
import { underReviewL3 } from '../layer2s/templates/underReview'
import { Layer3 } from '../layer3s'

export const pmon: Layer3 = underReviewL3({
  hostChain: ProjectId('arbitrum'),
  id: ProjectId('pmon'),
  badges: [
    Badge.L3ParentChain.Arbitrum,
    Badge.DA.Celestia,
    Badge.Stack.Orbit,
    Badge.VM.EVM,
    Badge.RaaS.AltLayer,
  ],
  display: {
    category: 'Optimium',
    provider: 'Arbitrum',
    name: 'PMON Chain',
    slug: 'pmon',
    description:
      'Polychain Monsters built an Orbit stack Optimium, housing the Onchain Monsters game.',
    purposes: ['Gaming', 'NFT'],
    links: {
      websites: ['https://protocolmonsterlabs.com/'],
      apps: [
        'https://battle.polychainmonsters.com/',
        'https://bridge.arbitrum.io/?destinationChain=pmon-chain&sourceChain=arbitrum-one',
      ],
      documentation: ['https://battle-docs.polychainmonsters.com/'],
      explorers: [],
      repositories: [],
      socialMedia: [
        'https://x.com/protocolmon',
        'https://discord.gg/protocolmon',
      ],
    },
  },
  associatedTokens: ['PMON'],
  escrows: [
    {
      chain: 'arbitrum',
      address: EthereumAddress('0x10B25719f4c0fA1BFF22431438E6b6315059548A'), // ERC20Bridge
      sinceTimestamp: new UnixTime(1707462976),
      tokens: '*',
    },
  ],
})
