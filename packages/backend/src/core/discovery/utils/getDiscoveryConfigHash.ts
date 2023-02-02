import { Hash256 } from '@l2beat/types'

import { hashJson } from '../../../tools/hashJson'
import { DiscoveryConfig } from '../DiscoveryConfig'

export function getDiscoveryConfigHash(config: DiscoveryConfig): Hash256 {
  return hashJson(JSON.stringify(config))
}
