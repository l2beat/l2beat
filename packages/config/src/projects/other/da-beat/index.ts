import { celestia } from './blockchain/celestia/celestia'
import { ethereum } from './blockchain/ethereum/ethereum'
import { near } from './blockchain/near/near'
import { immutableXLayer } from './dac/immutablex'
import { DaLayer } from './types/DaLayer'

export * from './types'

export const daLayers: DaLayer[] = [immutableXLayer, celestia, ethereum, near]
