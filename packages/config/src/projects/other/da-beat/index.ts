import { mantle } from '../../layer2s/mantle'
import { celestia } from './blockchain/celestia/celestia'
import { ethereum } from './blockchain/ethereum/ethereum'
import { mantleDA } from './dac/mantleDA'
import { dac } from './dac/layer'
import { DaLayer } from './types/DaLayer'

export * from './types'

export const daLayers: DaLayer[] = [dac, celestia, ethereum, mantleDA]
