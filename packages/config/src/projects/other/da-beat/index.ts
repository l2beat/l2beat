import { ethereum } from './blockchain/ethereum/ethereum'
import { DaLayer } from './types/DaLayer'

export * from './types'

export const ethereumDaLayer = ethereum
export const daLayers: DaLayer[] = []
