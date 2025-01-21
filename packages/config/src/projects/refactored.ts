import type { BaseProject } from './project/BaseProject'
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
  nebraupa,
  payy,
  risczero,
  soulwallet,
  sp1blobstream,
  sp1vector,
  worldcoinsemaphore,
  worldcoinsmtb,
]
