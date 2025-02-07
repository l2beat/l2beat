import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from './BaseProject'
import type { ProjectJSON } from './types'

export function jsonToBaseProject(_: ProjectJSON): BaseProject {


  return {
    id: ProjectId("arbitrum"),
    addedAt: UnixTime.now(),
    name: "Arbitrum",
    slug: "arbitrum",
    shortName: undefined
  }
}
