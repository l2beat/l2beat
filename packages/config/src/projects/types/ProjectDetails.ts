import { News } from './News'
import { ProjectLinks } from './ProjectLinks'
import { ProjectRiskView } from './ProjectRiskView'
import { ProjectTechnology } from './ProjectTechnology'

export interface ProjectDetails {
  /** A warning displayed at the top of the project page */
  warning?: string
  /** A few sentences describing the project the project */
  description: string
  /** A short (<20 characters) description of the use case */
  purpose: string
  /** List of links */
  links: ProjectLinks
  /** Technology provider */
  provider?: 'StarkEx' | 'Optimism'
  /** Deep dive into project technology */
  technology: ProjectTechnology
  /** Risk view values for this project */
  riskView: ProjectRiskView
  /** Links to recent developments */
  news: News[]
}
