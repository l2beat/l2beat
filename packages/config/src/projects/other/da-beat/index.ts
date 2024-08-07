import { celestia } from './blockchain/celestia/celestia'
import { ethereum } from './blockchain/ethereum/ethereum'
import { near } from './blockchain/near/near'
import { apexLayer } from './dac/apex'
import { arbitrumnovaLayer } from './dac/arbitrumnova'
import { astarzkEVMLayer } from './dac/astarzkEVM'
import { immutableXLayer } from './dac/immutablex'
import { realLayer } from './dac/real'
import { reyaLayer } from './dac/reya'
import { rhinofiLayer } from './dac/rhinofi'
import { xlayerLayer } from './dac/xlayer'
import { zkfairLayer } from './dac/zkfair'
import { DaLayer } from './types/DaLayer'
import { sorareLayer } from './dac/sorare'

export * from './types'

export const daLayers: DaLayer[] = [
  rhinofiLayer,
  zkfairLayer,
  arbitrumnovaLayer,
  apexLayer,
  astarzkEVMLayer,
  immutableXLayer,
  celestia,
  ethereum,
  near,
  xlayerLayer,
  realLayer,
  reyaLayer,
    sorareLayer,
]
