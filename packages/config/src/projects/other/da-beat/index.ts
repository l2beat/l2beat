import { celestia } from './blockchain/celestia/celestia'
import { ethereum } from './blockchain/ethereum/ethereum'
import { near } from './blockchain/near/near'
import { apexLayer } from './dac/apex'
import { astarzkEVMLayer } from './dac/astarzkEVM'
import { immutableXLayer } from './dac/immutablex'
import { realLayer } from './dac/real'
import { reyaLayer } from './dac/reya'
import { xlayerLayer } from './dac/xlayer'
import { DaLayer } from './types/DaLayer'

export * from './types'

export const daLayers: DaLayer[] = [apexLayer, astarzkEVMLayer, immutableXLayer, celestia, ethereum, near, xlayerLayer, realLayer, reyaLayer]
