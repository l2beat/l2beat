import { notUndefined } from '@l2beat/shared-pure'

import type { ChainConfig } from '../common/ChainConfig'
import { layer2s } from '../projects/layer2s'
import { layer3s } from '../projects/layer3s'
import { avalanche } from './avalanche'
import { bsc } from './bsc'
import { celo } from './celo'
import { ethereum } from './ethereum'
import { gnosis } from './gnosis'
import { polygonpos } from './polygonpos'

export const chains: ChainConfig[] = [
  ...layer2s.map((layer2) => layer2.chainConfig).filter(notUndefined),
  ...layer3s.map((layer3) => layer3.chainConfig).filter(notUndefined),
  avalanche,
  bsc,
  celo,
  ethereum,
  gnosis,
  polygonpos,
]
