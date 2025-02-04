import type { BaseProject } from '../types'
import { avail } from './da-beat/avail/avail'
import { celestia } from './da-beat/celestia/celestia'
import { eigenDA } from './da-beat/eigen-da/eigen-da'
import { espressoDA } from './da-beat/espressoDA/espressoDA'
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

// TODO: this shouldn't be a separate array but some places were harder to refactor
export const daLayers = [
  ethereum,
  avail,
  celestia,
  near,
  memo,
  espressoDA,
  eigenDA,
]

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
  ...daLayers,
]
