import { ProjectReference } from './ProjectReference'

export interface ProjectRisk {
  /** Category of this risk */
  category: ProjectRiskCategory
  /** Description of te risk. Should form a sentence with the category */
  text: string
  /** List of references backing up the claim */
  references?: ProjectReference[]
}

export type ProjectRiskCategory =
  | 'Funds can be stolen if'
  | 'Funds can be lost if'
  | 'Funds can be frozen if'
  | 'Users can be censored if'
