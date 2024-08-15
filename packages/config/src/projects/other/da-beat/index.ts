import { celestia } from './blockchain/celestia/celestia'
import { ethereum } from './blockchain/ethereum/ethereum'
import { near } from './blockchain/near/near'
import { apexLayer } from './dac/apex'
import { arbitrumnovaLayer } from './dac/arbitrumnova'
import { astarzkEVMLayer } from './dac/astarzkEVM'
import { degenLayer } from './dac/degen'
import { edgelessLayer } from './dac/edgeless'
import { hychainLayer } from './dac/hychain'
import { immutableXLayer } from './dac/immutablex'
import { l3xLayer } from './dac/l3x'
import { mantleDA } from './dac/mantleDA'
import { moltenLayer } from './dac/molten'
import { myriaLayer } from './dac/myria'
import { playblockLayer } from './dac/playblock'
import { popapexLayer } from './dac/popapex'
import { rariLayer } from './dac/rari'
import { realLayer } from './dac/real'
import { redsonicLayer } from './dac/redsonic'
import { reyaLayer } from './dac/reya'
import { rhinofiLayer } from './dac/rhinofi'
import { sankoLayer } from './dac/sanko'
import { sorareLayer } from './dac/sorare'
import { tanxLayer } from './dac/tanx'
import { witnessLayer } from './dac/witness'
import { xaiLayer } from './dac/xai'
import { xlayerLayer } from './dac/xlayer'
import { zkfairLayer } from './dac/zkfair'
import { DaLayer } from './types/DaLayer'

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
  witnessLayer,
  degenLayer,
  rariLayer,
  xaiLayer,
  popapexLayer,
  moltenLayer,
  l3xLayer,
  playblockLayer,
  mantleDA
]
