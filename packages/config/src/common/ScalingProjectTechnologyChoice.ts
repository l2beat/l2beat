import type { ScalingProjectReference } from './ScalingProjectReference'
import type { ScalingProjectRisk } from './ScalingProjectRisk'

export interface ScalingProjectTechnologyChoice {
  /** Name of the specific technology choice */
  name: string
  /** Description of the specific technology choice. Null means missing information */
  description: string
  /** List of references backing up the claim */
  references: ScalingProjectReference[]
  /** List of risks associated with the technology choice */
  risks: ScalingProjectRisk[]
  /** The description and research is incomplete */
  isIncomplete?: boolean
  /** The description and research is under review */
  isUnderReview?: boolean
}
