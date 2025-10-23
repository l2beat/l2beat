import { avail } from '../projects/avail/avail'
import { aztecv1prover } from '../projects/aztecv1prover/aztecv1prover'
import { blobstream } from '../projects/blobstream/blobstream'
import { boojum } from '../projects/boojum/boojum'
import { bsc } from '../projects/bsc/bsc'
import { celestia } from '../projects/celestia/celestia'
import { eigenda } from '../projects/eigenda/eigenda'
import { eigendaV2 } from '../projects/eigenda-v2/eigenda-v2'
import { espresso } from '../projects/espresso/espresso'
import { espressoprover } from '../projects/espressoprover/espressoprover'
import { ethereum } from '../projects/ethereum/ethereum'
import { gateway } from '../projects/gateway/gateway'
import { gnosis } from '../projects/gnosis/gnosis'
import { intmaxprover } from '../projects/intmaxprover/intmaxprover'
import { lighterprover } from '../projects/lighterprover/lighterprover'
import { lineaprover } from '../projects/lineaprover/lineaprover'
import { loopringprover } from '../projects/loopringprover/loopringprover'
import { memo } from '../projects/memo/memo'
import { near } from '../projects/near/near-da'
import { nebraupa } from '../projects/nebraupa/nebraupa'
import { openvmprover } from '../projects/openvmprover/openvmprover'
import { payy } from '../projects/payy/payy-zk-catalog'
import { risc0 } from '../projects/risc0/risc0'
import { risczero } from '../projects/risczero/risczero'
import { soulwallet } from '../projects/soulwallet/soulwallet'
import { sp1 } from '../projects/sp1/sp1'
import { sp1blobstream } from '../projects/sp1blobstream/sp1blobstream'
import { sp1vector } from '../projects/sp1vector/sp1vector'
import { stone } from '../projects/stone/stone'
import { teeBridge } from '../projects/tee-bridge/tee-bridge'
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
]
