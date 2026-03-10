import { across } from '../projects/across/across'
import { airbender } from '../projects/airbender/airbender'
import { avail } from '../projects/avail/avail'
import { avalanche } from '../projects/avalanche/avalanche'
import { axelar } from '../projects/axelar/axelar'
import { axelarits } from '../projects/axelar-its/axelar-its'
import { aztecv1prover } from '../projects/aztecv1prover/aztecv1prover'
import { blobstream } from '../projects/blobstream/blobstream'
import { boojum } from '../projects/boojum/boojum'
import { bsc } from '../projects/bsc/bsc'
import { cbridge } from '../projects/cbridge/cbridge'
import { ccip } from '../projects/ccip/ccip'
import { cctpv1 } from '../projects/cctpv1/cctpv1'
import { cctpv2 } from '../projects/cctpv2/cctpv2'
import { celestia } from '../projects/celestia/celestia'
import { circlegateway } from '../projects/circlegateway/circlegateway'
import { debridge } from '../projects/debridge/debridge'
import { debridgeDln } from '../projects/debridge-dln/debridge-dln'
import { eigenda } from '../projects/eigenda/eigenda'
import { eigendaV2 } from '../projects/eigenda-v2/eigenda-v2'
import { espresso } from '../projects/espresso/espresso'
import { espressoprover } from '../projects/espressoprover/espressoprover'
import { ethereum } from '../projects/ethereum/ethereum'
import { fusionplus } from '../projects/fusionplus/fusionplus'
import { gaszip } from '../projects/gaszip/gaszip'
import { gateway } from '../projects/gateway/gateway'
import { gnosis } from '../projects/gnosis/gnosis'
import { hyperlaneHwr } from '../projects/hyperlane-hwr/hyperlane-hwr'
import { intmaxprover } from '../projects/intmaxprover/intmaxprover'
import { layerzero } from '../projects/layerzero/layerzero'
import { lighterprover } from '../projects/lighterprover/lighterprover'
import { lineaprover } from '../projects/lineaprover/lineaprover'
import { loopringprover } from '../projects/loopringprover/loopringprover'
import { mayan } from '../projects/mayan/mayan'
import { memo } from '../projects/memo/memo'
import { meson } from '../projects/meson/meson'
import { near } from '../projects/near/near-da'
import { openvmprover } from '../projects/openvmprover/openvmprover'
import { relay } from '../projects/relay/relay'
import { risc0 } from '../projects/risc0/risc0'
import { sp1hypercube } from '../projects/sp1hypercube/sp1hypercube'
import { sp1turbo } from '../projects/sp1turbo/sp1turbo'
import { squid } from '../projects/squid/squid'
import { stargate } from '../projects/stargate/stargate'
import { stone } from '../projects/stone/stone'
import { stwo } from '../projects/stwo/stwo'
import { teeBridge } from '../projects/tee-bridge/tee-bridge'
import { vector } from '../projects/vector/vector'
import { wormholeNtt } from '../projects/wormhole-ntt/wormhole-ntt'
import { wormholeWtt } from '../projects/wormhole-wtt/wormhole-wtt'
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
  // interop protocols
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
]
