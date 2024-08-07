import { DaLayer } from './types/DaLayer'
import { celestia } from './blockchain/celestia/celestia'
import { ethereum } from './blockchain/ethereum/ethereum'
import { near } from './blockchain/near/near'
import { immutableXLayer } from './dac/immutablex'
import { astarzkEVMLayer } from './dac/astarzkEVM'
import { xlayerLayer } from './dac/xlayer'
import { apexLayer } from './dac/apex'

export * from './types'

export const daLayers: DaLayer[] = [apexLayer, astarzkEVMLayer, immutableXLayer, celestia, ethereum, near, xlayerLayer]
