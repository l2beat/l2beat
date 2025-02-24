import type { BaseProject } from '../types'
import { bsc } from './chains/bsc'
import { gnosis } from './chains/gnosis'
import { avail } from './da-beat/avail/avail'
import { vector } from './da-beat/avail/vector'
import { blobstream } from './da-beat/celestia/blobstream'
import { celestia } from './da-beat/celestia/celestia'
import { eigenda } from './da-beat/eigenda/eigenda'
import { espresso } from './da-beat/espresso/espresso'
import { ethereum } from './da-beat/ethereum/ethereum'
import { memo } from './da-beat/memo/memo'
import { near } from './da-beat/near/near'
import { nebraupa } from './zk-catalog/nebraupa'
import { payy } from './zk-catalog/payy'
import { risczero } from './zk-catalog/risczero'
import { soulwallet } from './zk-catalog/soulwallet'
import { sp1blobstream } from './zk-catalog/sp1blobstream'
import { sp1vector } from './zk-catalog/sp1vector'
import { worldcoinsemaphore } from './zk-catalog/worldcoinsemaphore'
import { worldcoinsmtb } from './zk-catalog/worldcoinsmtb'

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
