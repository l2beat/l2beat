import { airbender } from '../projects/airbender/airbender'
import { avail } from '../projects/avail/avail'
import { axelar } from '../projects/axelar/axelar'
import { axelarits } from '../projects/axelar-its/axelar-its'
import { aztecv1prover } from '../projects/aztecv1prover/aztecv1prover'
import { blobstream } from '../projects/blobstream/blobstream'
import { boojum } from '../projects/boojum/boojum'
import { bsc } from '../projects/bsc/bsc'
import { ccip } from '../projects/ccip/ccip'
import { cctpv1 } from '../projects/cctpv1/cctpv1'
import { cctpv2 } from '../projects/cctpv2/cctpv2'
import { celestia } from '../projects/celestia/celestia'
import { debridgeDln } from '../projects/debridge-dln/debridge-dln'
import { eigenda } from '../projects/eigenda/eigenda'
import { eigendaV2 } from '../projects/eigenda-v2/eigenda-v2'
import { espresso } from '../projects/espresso/espresso'
import { espressoprover } from '../projects/espressoprover/espressoprover'
import { ethereum } from '../projects/ethereum/ethereum'
import { gaszip } from '../projects/gaszip/gaszip'
import { gateway } from '../projects/gateway/gateway'
import { gnosis } from '../projects/gnosis/gnosis'
import { hyperlaneHwr } from '../projects/hyperlane-hwr/hyperlane-hwr'
import { intmaxprover } from '../projects/intmaxprover/intmaxprover'
import { layerzero } from '../projects/layerzero/layerzero'
import { lighterprover } from '../projects/lighterprover/lighterprover'
import { lineaprover } from '../projects/lineaprover/lineaprover'
import { loopringprover } from '../projects/loopringprover/loopringprover'
import { memo } from '../projects/memo/memo'
import { near } from '../projects/near/near-da'
import { nebraupa } from '../projects/nebraupa/nebraupa'
import { openvmprover } from '../projects/openvmprover/openvmprover'
import { payy } from '../projects/payy/payy-zk-catalog'
import { relay } from '../projects/relay/relay'
import { risc0 } from '../projects/risc0/risc0'
import { risczero } from '../projects/risczero/risczero'
import { soulwallet } from '../projects/soulwallet/soulwallet'
import { sp1 } from '../projects/sp1/sp1'
import { sp1blobstream } from '../projects/sp1blobstream/sp1blobstream'
import { sp1vector } from '../projects/sp1vector/sp1vector'
import { squid } from '../projects/squid/squid'
import { stone } from '../projects/stone/stone'
import { stwo } from '../projects/stwo/stwo'
import { teeBridge } from '../projects/tee-bridge/tee-bridge'
import { usdt0 } from '../projects/usdt0/usdt0'
import { vector } from '../projects/vector/vector'
import { worldcoinsemaphore } from '../projects/worldcoinsemaphore/worldcoinsemaphore'
import { worldcoinsmtb } from '../projects/worldcoinsmtb/worldcoinsmtb'
import { zkprover } from '../projects/zkprover/zkprover'
import { zksyncprover } from '../projects/zksyncprover/zksyncprover'
import type { BaseProject } from '../types'

// TODO: Once all projects are refactored this will simply become `projects`
export const refactored: BaseProject[] = [
  // zk catalog
  nebraupa,
  payy,
  risczero,
  soulwallet,
  sp1blobstream,
  sp1vector,
  worldcoinsemaphore,
  worldcoinsmtb,
  // zk catalog v2
  sp1,
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
  // interop protocols
  usdt0,
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
]
