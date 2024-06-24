import { ZkCatalogProject } from './types/ZkCatalogProject'
import { worldcoinsemaphore } from './worldcoinsemaphore'
import { worldcoinsmtb } from './worldcoinsmtb'

export * from './types'

export const zkCatalogProjects: ZkCatalogProject[] = [
  worldcoinsemaphore,
  worldcoinsmtb,
]

export const PERFORMED_BY = {
  l2beat: {
    name: 'L2BEAT',
    link: 'https://l2beat.com',
  },
}
