import { ProjectId } from '@l2beat/types'

import { ProjectDetails } from './ProjectDetails'
import { ProjectEscrow } from './ProjectEscrow'
import { ProjectEvent } from './ProjectEvent'

export interface Project {
  /** Name of the project, will be used as a display name on the website */
  name: string
  /** Url friendly project name, will be used in website urls */
  slug: string
  /** Unique, readable id, will be used in DB. DO NOT EDIT THIS PROPERTY */
  id: ProjectId
  /** Symbols of the tokens associated with this project */
  associatedTokens?: string[]
  /** List of contracts in which L1 funds are locked */
  escrows: ProjectEscrow[]
  /** Information displayed about the project on the frontend */
  details: ProjectDetails
  /** Metadata about events emitted by the system */
  events: ProjectEvent[]
}
