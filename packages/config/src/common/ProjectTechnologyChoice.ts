import { ProjectReference } from './ProjectReference'
import { ProjectRisk } from './ProjectRisk'

export interface ProjectTechnologyChoice {
  /** Name of the specific technology choice */
  name: string
  /** Description of the specific technology choice. Null means missing information */
  description: string
  /** List of references backing up the claim */
  references: ProjectReference[]
  /** List of risks associated with the technology choice */
  risks: ProjectRisk[]
  /** The description and research is incomplete */
  isIncomplete?: boolean
  /** The description and research is under review */
  isUnderReview?: boolean
}
