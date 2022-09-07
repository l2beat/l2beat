import { ProjectId } from '@l2beat/types'

import { Layer2Details } from './Layer2Details'
import { Layer2Escrow } from './Layer2Escrow'
import { Layer2Event } from './Layer2Event'

export interface Layer2 {
  /** Name of the project, will be used as a display name on the website */
  name: string
  /** Url friendly project name, will be used in website urls */
  slug: string
  /** Unique, readable id, will be used in DB. DO NOT EDIT THIS PROPERTY */
  id: ProjectId
  /** Symbols of the tokens associated with this project */
  associatedTokens?: string[]
  /** List of contracts in which L1 funds are locked */
  escrows: Layer2Escrow[]
  /** Information displayed about the project on the frontend */
  details: Layer2Details
  /** Metadata about events emitted by the system */
  events: Layer2Event[]
}
