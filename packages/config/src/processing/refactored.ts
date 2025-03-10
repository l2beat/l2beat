import { avail } from '../projects/avail/avail'
import { blobstream } from '../projects/blobstream/blobstream'
import { celestia } from '../projects/celestia/celestia'
import { bsc } from '../projects/chains/bsc'
import { gnosis } from '../projects/chains/gnosis'
import { eigenda } from '../projects/eigenda/eigenda'
import { espresso } from '../projects/espresso/espresso'
import { ethereum } from '../projects/ethereum/ethereum'
import { memo } from '../projects/memo/memo'
import { near } from '../projects/near/near'
import { vector } from '../projects/vector/vector'
import { nebraupa } from '../projects/zk-catalog/nebraupa'
import { payy } from '../projects/zk-catalog/payy'
import { risczero } from '../projects/zk-catalog/risczero'
import { soulwallet } from '../projects/zk-catalog/soulwallet'
import { sp1blobstream } from '../projects/zk-catalog/sp1blobstream'
import { sp1vector } from '../projects/zk-catalog/sp1vector'
import { worldcoinsemaphore } from '../projects/zk-catalog/worldcoinsemaphore'
import { worldcoinsmtb } from '../projects/zk-catalog/worldcoinsmtb'
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
  // da-beat
  ethereum,
  avail,
  vector,
  celestia,
  blobstream,
  near,
  memo,
  espresso,
  eigenda,
  // chains
  bsc,
  gnosis,
]
