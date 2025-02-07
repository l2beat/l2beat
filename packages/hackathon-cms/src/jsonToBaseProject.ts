import type { BaseProject } from './BaseProject'
import type { ProjectJSON } from './types'

export function jsonToBaseProject(_: ProjectJSON): BaseProject {
  return {
    id: 'arbitrum',
    addedAt: 0,
    name: 'Arbitrum',
    slug: 'arbitrum',
    shortName: undefined,
  }
}
