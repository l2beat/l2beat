import { UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('mint')

export const mint: Layer2 = opStackL2({
  discovery,
  display: {
    name: 'Mint',
    slug: 'mint',
    description: 'Mint Blockchain is a Layer 2 network for NFTs.',
    purposes: ['Universal', 'NFT'],
    links: {
      websites: ['https://mintchain.io/'],
      apps: ['https://bridge.mintchain.io/'],
      documentation: ['https://docs.mintchain.io/'],
      explorers: ['https://explorer.mintchain.io'],
      repositories: ['https://github.com/Mint-Blockchain'],
      socialMedia: [
        'https://twitter.com/Mint_Blockchain',
        'https://discord.gg/mint-blockchain',
      ],
    },
  },
  isNodeAvailable: true,
  genesisTimestamp: new UnixTime(1715612531),
})
