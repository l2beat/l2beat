import { ProjectId } from '@l2beat/shared-pure'

type Data = number

export interface Project {
  id: ProjectId
  slug: string
  tvl?: Data
  activity?: Data
  display?: Data
  permissions?: Data
  contracts?: Data
  // tags
  isLayer2?: true
  isLayer3?: true
  isScaling?: true
  isZkCatalog?: true
  isUpcoming?: true
  isUnderReview?: true
  isArchived?: true
}
