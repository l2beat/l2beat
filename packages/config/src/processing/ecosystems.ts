import type { Ecosystem } from '../internalTypes'
import { agglayer } from '../projects/agglayer/agglayer'
import { arbitrumOrbit } from '../projects/arbitrum-orbit/arbitrum-orbit'
import { superchain } from '../projects/superchain/superchain'
import { theElasticNetwork } from '../projects/the-elastic-network/the-elastic-network'

export const ecosystems: Ecosystem[] = [
  agglayer,
  arbitrumOrbit,
  superchain,
  theElasticNetwork,
]
