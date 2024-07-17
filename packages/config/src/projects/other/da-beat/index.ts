import { celestia } from './blockchain/celestia/celestia'
import { dac } from './dac/layer'
import { DaLayer } from './types/DaLayer'

export * from './types'

export const daLayers: DaLayer[] = [dac, celestia]
