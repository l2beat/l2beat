import { ScalingProjectRiskViewEntry } from '@l2beat/config'

export interface BridgesRiskViewEntry {
  name: string
  shortName: string | undefined
  slug: string
  type: 'layer2' | 'bridge'
  warning?: string
  isArchived?: boolean
  isVerified?: boolean
  showProjectUnderReview?: boolean
  category: string
  destination: ScalingProjectRiskViewEntry
  validatedBy?: ScalingProjectRiskViewEntry
  sourceUpgradeability?: ScalingProjectRiskViewEntry
  destinationToken?: ScalingProjectRiskViewEntry
}
