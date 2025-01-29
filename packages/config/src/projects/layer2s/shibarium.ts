import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { underReviewL2 } from '../layer2s/templates/underReview'

export const shibarium: Layer2 = underReviewL2({
  id: 'shibarium',
  capability: 'universal',
  addedAt: new UnixTime(1738081310), // 2025-01-28T16:21:50+00:00
  badges: [Badge.VM.EVM, Badge.DA.CustomDA],
  display: {
    name: 'Shibarium',
    slug: 'shibarium',
    category: 'Other',
    description:
      'Shibarium is an EVM-compatible, proof of stake sidechain for Ethereum. It is built by developers behind the Shiba Inu token ecosystem. The main bridge to Ethereum is currently validated by Shibarium validators and allows for asset as well as data movement between Shibarium and Ethereum.',
    purposes: ['Universal'],
    links: {
      websites: ['https://shibarium.shib.io/'],
      apps: ['https://shibarium.shib.io/bridge'],
      documentation: [
        'https://docs.shib.io/docs/shibarium/welcome/welcome-overview',
      ],
      explorers: ['https://shibariumscan.io/'],
      repositories: ['https://github.com/shibaone'],
      socialMedia: [
        'https://x.com/ShibariumNet',
        'https://discord.com/invite/shibariumtech',
        'https://x.com/shibtoken',
        'https://blog.shib.io/',
        'https://t.me/ShibariumTechnologies',
      ],
    },
  },
  associatedTokens: ['SHIB', 'BONE', 'LEASH'],
  rpcUrl: 'https://www.shibrpc.com',
  escrows: [
    {
      address: EthereumAddress('0xc3897302aB4B42931cB4857050Fa60f53B775870'), // etherpredicate
      sinceTimestamp: new UnixTime(1691475959),
      tokens: ['ETH'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0x6Aca26bFCE7675FF71C734BF26C8c0aC4039A4Fa'), // erc20predicate
      sinceTimestamp: new UnixTime(1691475539),
      tokens: '*',
      chain: 'ethereum',
    },
  ],
})
