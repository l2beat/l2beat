import { News } from './News'
import { Pointer } from './Pointer'
import { ProjectLinks } from './ProjectLinks'
import { ProjectTechnology } from './ProjectTechnology'
import { ProjectParameter } from './ProjectParameter'
import { ProjectRiskView } from './ProjectRiskView'

export interface ProjectDetails {
  /** A warning displayed at the top of the project page */
  warning?: string
  /** List of links */
  links: ProjectLinks
  /** A short (<20 characters) description of the use case */
  purpose: string
  // TODO: Not optional
  /** A few sentences describing the project the project */
  description?: string
  // TODO: Not optional
  /** Deep dive into project technology */
  technology?: ProjectTechnology
  /** Risk view values for this project */
  riskView: ProjectRiskView
  /** Links to recent developments */
  news?: News[]

  // DEPRECATED ITEMS BELOW
  /** @deprecated E.g. "ZK Rollup", "Payment Channels" */
  technologyName: string
  /** @deprecated Specific details e.g. ZK-SNARKS */
  technologyDetails?: string
  /** @deprecated Project research results */
  parameters: ProjectParameter[]
  /** @deprecated Additional notes */
  notes?: {
    /** Note text */
    text: string
    /** Relevant links */
    pointers?: Pointer[]
  }
}
