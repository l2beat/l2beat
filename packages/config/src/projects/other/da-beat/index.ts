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
import { automataDA } from './dac/automataDA'
import { blessnetDac } from './dac/blessnet'
import { cyberDA } from './dac/cyberDA'
import { degenDac } from './dac/degen'
import { ebichainDac } from './dac/ebichain'
import { edgelessDac } from './dac/edgeless'
import { educhainDac } from './dac/educhain'
import { eigenDA } from './dac/eigenDA'
import { everclearDac } from './dac/everclear'
import { fluenceDac } from './dac/fluence'
import { fraxtalDA } from './dac/fraxtalDA'
import { gmnetworkDA } from './dac/gmnetworkDA'
import { gptProtocolDac } from './dac/gptProtocol'
import { galxegravityDac } from './dac/gravity'
import { hychainDac } from './dac/hychain'
import { immutableXDac } from './dac/immutablex'
import { inEVMDac } from './dac/inEVM'
import { l3xDac } from './dac/l3x'
import { mantleDA } from './dac/mantleDA'
import { moltenDac } from './dac/molten'
import { musterDac } from './dac/muster'
import { myriaDac } from './dac/myria'
import { oevnetworkDac } from './dac/oevnetwork'
import { paychainDac } from './dac/payChain'
import { playblockDac } from './dac/playblock'
import { popapexDac } from './dac/popapex'
import { popbossDac } from './dac/popboss'
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

export * from './types'

export const ethereumDaLayer = ethereum
export const daLayers = applyProcessor([
  // Permissioned DACs
  alienxDac,
  alephzeroDac,
  apexDac,
  apechainDac,
  arbitrumNovaDac,
  astarZkEvmDac,
  blessnetDac,
  cyberDA,
  degenDac,
  ebichainDac,
  edgelessDac,
  educhainDac,
  everclearDac,
  fluenceDac,
  galxegravityDac,
  gptProtocolDac,
  hychainDac,
  immutableXDac,
  inEVMDac,
  l3xDac,
  mantleDA,
  moltenDac,
  musterDac,
  myriaDac,
  oevnetworkDac,
  paychainDac,
  playblockDac,
  popapexDac,
  popbossDac,
  realDac,
  reyaDac,
  rhinofiDac,
  sankoDac,
  siliconDac,
  sorareDac,
  sxnetworkDac,
  tanxDac,
  winrDac,
  witnessDac,
  xaiDac,
  xchainDac,
  xlayerDac,
  zkfairDac,
  // DA Challenges
  automataDA,
  gmnetworkDA,
  redstoneDA,
  xterioDA,
  // DA Layers
  avail,
  celestia,
  near,
  memo,
  espressoDA,
  eigenDA,
  fraxtalDA,
])
