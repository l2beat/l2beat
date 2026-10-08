import { across } from '../projects/across/across'
import { airbender } from '../projects/airbender/airbender'
import { avalanche } from '../projects/avalanche/avalanche'
import { axelar } from '../projects/axelar/axelar'
import { axelarits } from '../projects/axelar-its/axelar-its'
import { aztecv1prover } from '../projects/aztecv1prover/aztecv1prover'
import { barretenberg } from '../projects/barretenberg/barretenberg'
import { basesolbridge } from '../projects/basesolbridge/basesolbridge'
import { boojum } from '../projects/boojum/boojum'
import { bsc } from '../projects/bsc/bsc'
import { butternetwork } from '../projects/butternetwork/butternetwork'
import { cbridge } from '../projects/cbridge/cbridge'
import { ccip } from '../projects/ccip/ccip'
import { cctpv1 } from '../projects/cctpv1/cctpv1'
import { cctpv2 } from '../projects/cctpv2/cctpv2'
import { chainlink } from '../projects/chainlink/chainlink'
import { circlegateway } from '../projects/circlegateway/circlegateway'
import { cloaked } from '../projects/cloaked/cloaked'
import { debridge } from '../projects/debridge/debridge'
import { debridgeDln } from '../projects/debridge-dln/debridge-dln'
import { espressoprover } from '../projects/espressoprover/espressoprover'
import { ethereum } from '../projects/ethereum/ethereum'
import { etherfi } from '../projects/etherfi/etherfi'
import { fluidkey } from '../projects/fluidkey/fluidkey'
import { frankencoin } from '../projects/frankencoin/frankencoin'
import { freetunnel } from '../projects/freetunnel/freetunnel'
import { fusionplus } from '../projects/fusionplus/fusionplus'
import { gaszip } from '../projects/gaszip/gaszip'
import { gateway } from '../projects/gateway/gateway'
import { hyperevm } from '../projects/hyperevm/hyperevm'
import { hyperlaneHwr } from '../projects/hyperlane-hwr/hyperlane-hwr'
import { intmaxprover } from '../projects/intmaxprover/intmaxprover'
import { layerzero } from '../projects/layerzero/layerzero'
import { lido } from '../projects/lido/lido'
import { lifi } from '../projects/lifi/lifi'
import { lighterprover } from '../projects/lighterprover/lighterprover'
import { lineaprover } from '../projects/lineaprover/lineaprover'
import { liquityv2 } from '../projects/liquityv2/liquityv2'
import { loopringprover } from '../projects/loopringprover/loopringprover'
import { mayan } from '../projects/mayan/mayan'
import { meson } from '../projects/meson/meson'
import { monad } from '../projects/monad/monad'
import { moneroCakeWallet } from '../projects/monero-cake-wallet/monero-cake-wallet'
import { openvmprover } from '../projects/openvmprover/openvmprover'
import { polymarket } from '../projects/polymarket/polymarket'
import { privacyBoost } from '../projects/privacy-boost/privacy-boost'
import { privacyPools } from '../projects/privacy-pools/privacy-pools'
import { railgun } from '../projects/railgun/railgun'
import { relay } from '../projects/relay/relay'
import { risc0 } from '../projects/risc0/risc0'
import { rocketpool } from '../projects/rocketpool/rocketpool'
import { sp1hypercube } from '../projects/sp1hypercube/sp1hypercube'
import { sp1turbo } from '../projects/sp1turbo/sp1turbo'
import { stargate } from '../projects/stargate/stargate'
import { stone } from '../projects/stone/stone'
import { strk20 } from '../projects/strk20/strk20'
import { stwo } from '../projects/stwo/stwo'
import { tempo } from '../projects/tempo/tempo'
import { tornadoCash } from '../projects/tornado-cash/tornado-cash'
import { umbra } from '../projects/umbra/umbra'
import { uniswapv3 } from '../projects/uniswapv3/uniswapv3'
import { uniswapv4 } from '../projects/uniswapv4/uniswapv4'
import { wbeth } from '../projects/wbeth/wbeth'
import { wormholeNtt } from '../projects/wormhole-ntt/wormhole-ntt'
import { wormholeWtt } from '../projects/wormhole-wtt/wormhole-wtt'
import { zama } from '../projects/zama/zama'
import { zamaCw } from '../projects/zama-cw/zama-cw'
import { zcash } from '../projects/zcash/zcash'
import { zcashNearIntents } from '../projects/zcash-near-intents/zcash-near-intents'
import { zkmoney } from '../projects/zkmoney/zkmoney'
import { zkprover } from '../projects/zkprover/zkprover'
import { zksyncprover } from '../projects/zksyncprover/zksyncprover'
import type { BaseProject } from '../types'

// TODO: Once all projects are refactored this will simply become `projects`
export const refactored: BaseProject[] = [
  // zk catalog
  sp1turbo,
  sp1hypercube,
  boojum,
  airbender,
  zkprover,
  stone,
  lineaprover,
  openvmprover,
  risc0,
  loopringprover,
  zksyncprover,
  intmaxprover,
  aztecv1prover,
  espressoprover,
  lighterprover,
  stwo,
  barretenberg,
  zcash,
  // da-beat
  ethereum,
  // chains
  bsc,
  gateway,
  avalanche,
  monad,
  tempo,
  zama,
  // interop protocols
  debridgeDln,
  hyperlaneHwr,
  ccip,
  cctpv1,
  cctpv2,
  relay,
  gaszip,
  lifi,
  layerzero,
  axelar,
  axelarits,
  fusionplus,
  circlegateway,
  wormholeWtt,
  wormholeNtt,
  mayan,
  meson,
  across,
  debridge,
  stargate,
  cbridge,
  butternetwork,
  hyperevm,
  freetunnel,
  basesolbridge,
  // defi
  frankencoin,
  liquityv2,
  chainlink,
  uniswapv3,
  lido,
  etherfi,
  uniswapv4,
  wbeth,
  polymarket,
  rocketpool,
  // privacy
  cloaked,
  fluidkey,
  privacyPools,
  railgun,
  strk20,
  tornadoCash,
  umbra,
  zamaCw,
  moneroCakeWallet,
  zcashNearIntents,
  privacyBoost,
  zkmoney,
]
