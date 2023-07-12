import { ProjectRiskViewEntry } from '@l2beat/config'

export interface BridgesRiskViewEntry {
  name: string
  slug: string
  type: 'layer2' | 'bridge'
  warning?: string
  isArchived?: boolean
  isVerified?: boolean
  showProjectUnderReview?: boolean
  category: string
  destination: ProjectRiskViewEntry
  validatedBy?: ProjectRiskViewEntry
  sourceUpgradeability?: ProjectRiskViewEntry
  destinationToken?: ProjectRiskViewEntry
}
