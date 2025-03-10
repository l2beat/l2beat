import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'
import { BADGES } from '../badges'

export const shibarium: ScalingProject = underReviewL2({
  id: 'shibarium',
  capability: 'universal',
  addedAt: UnixTime(1738081310), // 2025-01-28T16:21:50+00:00
  badges: [BADGES.VM.EVM, BADGES.DA.CustomDA],
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
  chainConfig: {
    name: 'shibarium',
    chainId: 109,
    apis: [
      {
        type: 'rpc',
        url: 'https://www.shibrpc.com',
        callsPerMinute: 1500,
      },
    ],
  },
  escrows: [
    {
      address: EthereumAddress('0xc3897302aB4B42931cB4857050Fa60f53B775870'), // etherpredicate
      sinceTimestamp: UnixTime(1691475959),
      tokens: ['ETH'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0x6Aca26bFCE7675FF71C734BF26C8c0aC4039A4Fa'), // erc20predicate
      sinceTimestamp: UnixTime(1691475539),
      tokens: '*',
      chain: 'ethereum',
    },
  ],
})
