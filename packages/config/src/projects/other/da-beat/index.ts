import { celestia } from './blockchain/celestia/celestia'
import { ethereum } from './blockchain/ethereum/ethereum'
import { near } from './blockchain/near/near'
import { apexDac } from './dac/apex'
import { arbitrumNovaDac } from './dac/arbitrumnova'
import { astarZkEvmDac } from './dac/astarzkevm'
import { degenDac } from './dac/degen'
import { edgelessDac } from './dac/edgeless'
import { eigenDA } from './dac/eigenDA'
import { hychainDac } from './dac/hychain'
import { immutableXDac } from './dac/immutablex'
import { l3xDac } from './dac/l3x'
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
  arbitrumNovaDac,
  apexDac,
  astarZkEvmDac,
  immutableXDac,
  celestia,
  ethereum,
  near,
  xlayerLayer,
  realLayer,
  reyaLayer,
  sorareLayer,
  tanxLayer,
  hychainDac,
  sankoLayer,
  myriaLayer,
  edgelessDac,
  redsonicLayer,
  witnessLayer,
  degenDac,
  rariLayer,
  xaiLayer,
  popapexLayer,
  moltenLayer,
  l3xDac,
  playblockLayer,
  mantleDA,
  eigenDA,
]
