import { arbitrumOrbit } from '../projects/arbitrum-orbit/arbitrum-orbit'
import { superchain } from '../projects/superchain/superchain'
import { theElasticNetwork } from '../projects/the-elastic-network/the-elastic-network'
import type { BaseProject } from '../types'

export const ecosystems: BaseProject[] = [
  superchain,
  theElasticNetwork,
  arbitrumOrbit,
]
