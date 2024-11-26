import { avail } from './blockchain/avail/avail'
import { celestia } from './blockchain/celestia/celestia'
import { espressoDA } from './blockchain/espressoDA/espressoDA'
import { ethereum } from './blockchain/ethereum/ethereum'
import { memo } from './blockchain/memo/memo'
import { near } from './blockchain/near/near'
import { alephzeroDac } from './dac/alephzero'
import { alienxDac } from './dac/alienx'
import { apechainDac } from './dac/apechain'
import { apexDac } from './dac/apex'
import { arbitrumNovaDac } from './dac/arbitrumnova'
import { astarZkEvmDac } from './dac/astarzkEVM'
import { degenDac } from './dac/degen'
import { edgelessDac } from './dac/edgeless'
import { eigenDA } from './dac/eigenDA'
import { everclearDac } from './dac/everclear'
import { fluenceDac } from './dac/fluence'
import { fraxtalDA } from './dac/fraxtalDA'
import { gptProtocolDac } from './dac/gptProtocol'
import { galxegravityDac } from './dac/gravity'
import { hychainDac } from './dac/hychain'
import { immutableXDac } from './dac/immutablex'
import { l3xDac } from './dac/l3x'
import { mantleDA } from './dac/mantleDA'
import { moltenDac } from './dac/molten'
import { myriaDac } from './dac/myria'
import { oevnetworkDac } from './dac/oevnetwork'
import { paychainDac } from './dac/payChain'
import { playblockDac } from './dac/playblock'
import { popapexDac } from './dac/popapex'
import { popbossDac } from './dac/popboss'
import { rariDac } from './dac/rari'
import { realDac } from './dac/real'
import { redstoneDA } from './dac/redstoneDA'
import { reyaDac } from './dac/reya'
import { rhinofiDac } from './dac/rhinofi'
import { sankoDac } from './dac/sanko'
import { siliconDac } from './dac/silicon'
import { sorareDac } from './dac/sorare'
import { sxnetworkDac } from './dac/sxnetwork'
import { tanxDac } from './dac/tanx'
import { winrDac } from './dac/winr'
import { witnessDac } from './dac/witness'
import { xaiDac } from './dac/xai'
import { xchainDac } from './dac/xchain'
import { xlayerDac } from './dac/xlayer'
import { xterioDA } from './dac/xterioDA'
import { zkfairDac } from './dac/zkfair'
import { applyProcessor } from './processors'
import { DaLayer } from './types/DaLayer'

export * from './types'

export const ethereumDaLayer = ethereum

export const daLayers: DaLayer[] = applyProcessor([
  // Permissioned DACs
  galxegravityDac,
  immutableXDac,
  realDac,
  apexDac,
  arbitrumNovaDac,
  reyaDac,
  xlayerDac,
  sorareDac,
  zkfairDac,
  siliconDac,
  rhinofiDac,
  sxnetworkDac,
  winrDac,
  astarZkEvmDac,
  tanxDac,
  hychainDac,
  xchainDac,
  alienxDac,
  sankoDac,
  myriaDac,
  alephzeroDac,
  edgelessDac,
  everclearDac,
  paychainDac,
  gptProtocolDac,
  witnessDac,
  apechainDac,
  degenDac,
  l3xDac,
  moltenDac,
  playblockDac,
  popapexDac,
  popbossDac,
  rariDac,
  xaiDac,
  fluenceDac,
  oevnetworkDac,
  // DA Layers
  // ethereum,
  avail,
  celestia,
  near,
  memo,
  espressoDA,
  fraxtalDA,
  mantleDA,
  eigenDA,
  redstoneDA,
  xterioDA,
])
