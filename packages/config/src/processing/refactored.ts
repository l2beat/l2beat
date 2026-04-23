import { abstractProtocol } from '../projects/abstract-protocol/abstract-protocol'
import { across } from '../projects/across/across'
import { agglayerProtocol } from '../projects/agglayer-protocol/agglayer-protocol'
import { airbender } from '../projects/airbender/airbender'
import { arbitrumProtocol } from '../projects/arbitrum-protocol/arbitrum-protocol'
import { avail } from '../projects/avail/avail'
import { avalanche } from '../projects/avalanche/avalanche'
import { avalancheProtocol } from '../projects/avalanche-protocol/avalanche-protocol'
import { axelar } from '../projects/axelar/axelar'
import { axelarits } from '../projects/axelar-its/axelar-its'
import { aztecv1prover } from '../projects/aztecv1prover/aztecv1prover'
import { barretenberg } from '../projects/barretenberg/barretenberg'
import { baseProtocol } from '../projects/base-protocol/base-protocol'
import { blobstream } from '../projects/blobstream/blobstream'
import { boojum } from '../projects/boojum/boojum'
import { bsc } from '../projects/bsc/bsc'
import { cbridge } from '../projects/cbridge/cbridge'
import { ccip } from '../projects/ccip/ccip'
import { cctpv1 } from '../projects/cctpv1/cctpv1'
import { cctpv2 } from '../projects/cctpv2/cctpv2'
import { celestia } from '../projects/celestia/celestia'
import { celoProtocol } from '../projects/celo-protocol/celo-protocol'
import { circlegateway } from '../projects/circlegateway/circlegateway'
import { debridge } from '../projects/debridge/debridge'
import { debridgeDln } from '../projects/debridge-dln/debridge-dln'
import { eigenda } from '../projects/eigenda/eigenda'
import { eigendaV2 } from '../projects/eigenda-v2/eigenda-v2'
import { espresso } from '../projects/espresso/espresso'
import { espressoprover } from '../projects/espressoprover/espressoprover'
import { ethereum } from '../projects/ethereum/ethereum'
import { freetunnel } from '../projects/freetunnel/freetunnel'
import { fusionplus } from '../projects/fusionplus/fusionplus'
import { gaszip } from '../projects/gaszip/gaszip'
import { gateway } from '../projects/gateway/gateway'
import { gnosis } from '../projects/gnosis/gnosis'
import { hyperevm } from '../projects/hyperevm/hyperevm'
import { hyperlaneHwr } from '../projects/hyperlane-hwr/hyperlane-hwr'
import { inkProtocol } from '../projects/ink-protocol/ink-protocol'
import { intmaxprover } from '../projects/intmaxprover/intmaxprover'
import { layerzero } from '../projects/layerzero/layerzero'
import { lighterprover } from '../projects/lighterprover/lighterprover'
import { lineaProtocol } from '../projects/linea-protocol/linea-protocol'
import { lineaprover } from '../projects/lineaprover/lineaprover'
import { loopringprover } from '../projects/loopringprover/loopringprover'
import { mayan } from '../projects/mayan/mayan'
import { memo } from '../projects/memo/memo'
import { meson } from '../projects/meson/meson'
import { monad } from '../projects/monad/monad'
import { near } from '../projects/near/near-da'
import { opMainnetProtocol } from '../projects/op-mainnet-protocol/op-mainnet-protocol'
import { openvmprover } from '../projects/openvmprover/openvmprover'
import { polygonPosProtocol } from '../projects/polygon-pos-protocol/polygon-pos-protocol'
import { relay } from '../projects/relay/relay'
import { risc0 } from '../projects/risc0/risc0'
import { sp1hypercube } from '../projects/sp1hypercube/sp1hypercube'
import { sp1turbo } from '../projects/sp1turbo/sp1turbo'
import { squid } from '../projects/squid/squid'
import { stargate } from '../projects/stargate/stargate'
import { stone } from '../projects/stone/stone'
import { stwo } from '../projects/stwo/stwo'
import { teeBridge } from '../projects/tee-bridge/tee-bridge'
import { tempo } from '../projects/tempo/tempo'
import { vector } from '../projects/vector/vector'
import { wormholeNtt } from '../projects/wormhole-ntt/wormhole-ntt'
import { wormholeWtt } from '../projects/wormhole-wtt/wormhole-wtt'
import { zkprover } from '../projects/zkprover/zkprover'
import { zksync2Protocol } from '../projects/zksync2-protocol/zksync2-protocol'
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
  // da-beat
  ethereum,
  avail,
  vector,
  celestia,
  blobstream,
  near,
  espresso,
  teeBridge,
  eigenda,
  eigendaV2,
  memo,
  // chains
  bsc,
  gnosis,
  gateway,
  avalanche,
  monad,
  tempo,
  // interop protocols
  abstractProtocol,
  agglayerProtocol,
  arbitrumProtocol,
  avalancheProtocol,
  baseProtocol,
  celoProtocol,
  inkProtocol,
  lineaProtocol,
  opMainnetProtocol,
  polygonPosProtocol,
  zksync2Protocol,
  debridgeDln,
  hyperlaneHwr,
  ccip,
  cctpv1,
  cctpv2,
  relay,
  gaszip,
  layerzero,
  axelar,
  axelarits,
  squid,
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
  hyperevm,
  freetunnel,
]
