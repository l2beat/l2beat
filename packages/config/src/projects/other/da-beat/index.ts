import { celestia } from './blockchain/celestia/layer'
import { dac } from './dac/layer'
import { DaLayer } from './types/DALayer'

export const daLayers: DaLayer[] = [dac, celestia]

console.dir({ daLayers }, { depth: null })
