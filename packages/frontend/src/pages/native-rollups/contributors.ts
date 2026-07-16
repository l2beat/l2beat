import type { ImageParams } from '~/utils/project/getImageParams'

export interface Contributor {
  name: string
  org: string
  href: string
  image: ImageParams
}

export const CONTRIBUTORS = [
  {
    name: 'Luca Donno',
    org: 'L2BEAT',
    href: 'https://x.com/donnoh_eth',
    imagePath: '/images/native-rollups/luca-donno.jpg',
  },
  {
    name: 'Justin Drake',
    org: 'Ethereum Foundation',
    href: 'https://x.com/drakefjustin',
    imagePath: '/images/native-rollups/justin-drake.jpg',
  },
]
