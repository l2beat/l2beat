import { avail } from '../projects/avail/avail'
import { blobstream } from '../projects/blobstream/blobstream'
import { boojum } from '../projects/boojum/boojum'
import { bsc } from '../projects/bsc/bsc'
import { celestia } from '../projects/celestia/celestia'
import { eigenda } from '../projects/eigenda/eigenda'
import { espresso } from '../projects/espresso/espresso'
import { ethereum } from '../projects/ethereum/ethereum'
import { gateway } from '../projects/gateway/gateway'
import { gnosis } from '../projects/gnosis/gnosis'
import { lineaprover } from '../projects/lineaprover/lineaprover'
import { loopringprover } from '../projects/loopringprover/loopringprover'
import { memo } from '../projects/memo/memo'
import { near } from '../projects/near/near-da'
import { nebraupa } from '../projects/nebraupa/nebraupa'
import { openvmprover } from '../projects/openvmprover/openvmprover'
import { payy } from '../projects/payy/payy-zk-catalog'
import { polygonzkevmprover } from '../projects/polygonzkevmprover/polygonzkevmprover'
import { risc0 } from '../projects/risc0/risc0'
import { risczero } from '../projects/risczero/risczero'
import { soulwallet } from '../projects/soulwallet/soulwallet'
import { sp1 } from '../projects/sp1/sp1'
import { sp1blobstream } from '../projects/sp1blobstream/sp1blobstream'
import { sp1vector } from '../projects/sp1vector/sp1vector'
import { stone } from '../projects/stone/stone'
import { vector } from '../projects/vector/vector'
import { worldcoinsemaphore } from '../projects/worldcoinsemaphore/worldcoinsemaphore'
import { worldcoinsmtb } from '../projects/worldcoinsmtb/worldcoinsmtb'
import { zircuitprover } from '../projects/zircuitprover/zircuitprover'
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
  polygonzkevmprover,
  stone,
  lineaprover,
  openvmprover,
  zircuitprover,
  risc0,
  loopringprover,
  zksyncprover,
  // da-beat
  ethereum,
  avail,
  vector,
  celestia,
  blobstream,
  near,
  espresso,
  eigenda,
  memo,
  // chains
  bsc,
  gnosis,
  gateway,
]
