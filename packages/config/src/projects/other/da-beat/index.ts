import { celestia } from './blockchain/celestia/celestia'
import { ethereum } from './blockchain/ethereum/ethereum'
import { near } from './blockchain/near/near'
import { dac } from './dac/layer'
import { DaLayer } from './types/DaLayer'

export * from './types'

export const daLayers: DaLayer[] = [
    dac, 
    celestia, 
    ethereum, 
    near
]
