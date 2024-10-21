import { avail } from './blockchain/avail/avail'
import { celestia } from './blockchain/celestia/celestia'
import { ethereum } from './blockchain/ethereum/ethereum'
import { memo } from './blockchain/memo/memo'
import { near } from './blockchain/near/near'
import { apexDac } from './dac/apex'
import { arbitrumNovaDac } from './dac/arbitrumnova'
import { astarZkEvmDac } from './dac/astarzkEVM'
import { degenDac } from './dac/degen'
import { edgelessDac } from './dac/edgeless'
import { eigenDA } from './dac/eigenDA'
import { fraxtalDA } from './dac/fraxtalDA'
import { hychainDac } from './dac/hychain'
import { immutableXDac } from './dac/immutablex'
import { l3xDac } from './dac/l3x'
import { mantleDA } from './dac/mantleDA'
import { moltenDac } from './dac/molten'
import { myriaDac } from './dac/myria'
import { playblockDac } from './dac/playblock'
import { popapexDac } from './dac/popapex'
import { rariDac } from './dac/rari'
import { realDac } from './dac/real'
import { redsonicDac } from './dac/redsonic'
import { redstoneDA } from './dac/redstoneDA'
import { reyaDac } from './dac/reya'
import { rhinofiDac } from './dac/rhinofi'
import { sankoDac } from './dac/sanko'
import { sorareDac } from './dac/sorare'
import { tanxDac } from './dac/tanx'
import { witnessDac } from './dac/witness'
import { xaiDac } from './dac/xai'
import { xlayerDac } from './dac/xlayer'
import { xterioDA } from './dac/xterioDA'
import { zkfairDac } from './dac/zkfair'
import { applyProcessor } from './processors'
import { DaLayer } from './types/DaLayer'

export * from './types'

export const daLayers: DaLayer[] = applyProcessor([
  avail,
  rhinofiDac,
  zkfairDac,
  arbitrumNovaDac,
  apexDac,
  astarZkEvmDac,
  immutableXDac,
  celestia,
  ethereum,
  near,
  memo,
  xlayerDac,
  realDac,
  reyaDac,
  sorareDac,
  tanxDac,
  hychainDac,
  fraxtalDA,
  sankoDac,
  myriaDac,
  edgelessDac,
  redsonicDac,
  witnessDac,
  degenDac,
  rariDac,
  xaiDac,
  popapexDac,
  moltenDac,
  l3xDac,
  playblockDac,
  mantleDA,
  eigenDA,
  redstoneDA,
  xterioDA,
])
