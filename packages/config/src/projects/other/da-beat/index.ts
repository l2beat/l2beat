import { celestia } from './blockchain/celestia/celestia'
import { ethereum } from './blockchain/ethereum/ethereum'
import { near } from './blockchain/near/near'
import { apexLayer } from './dac/apex'
import { arbitrumnovaLayer } from './dac/arbitrumnova'
import { astarzkEVMLayer } from './dac/astarzkEVM'
import { edgelessLayer } from './dac/edgeless'
import { hychainLayer } from './dac/hychain'
import { immutableXLayer } from './dac/immutablex'
import { myriaLayer } from './dac/myria'
import { realLayer } from './dac/real'
import { reyaLayer } from './dac/reya'
import { rhinofiLayer } from './dac/rhinofi'
import { sankoLayer } from './dac/sanko'
import { sorareLayer } from './dac/sorare'
import { tanxLayer } from './dac/tanx'
import { xlayerLayer } from './dac/xlayer'
import { zkfairLayer } from './dac/zkfair'
import { DaLayer } from './types/DaLayer'
import { redsonicLayer } from './dac/redsonic'
import { witnessLayer } from './dac/witness'

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
  tanxLayer,
  hychainLayer,
  sankoLayer,
  myriaLayer,
  edgelessLayer,
  redsonicLayer,
  witnessLayer
]
