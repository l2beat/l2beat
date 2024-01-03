import { ProjectId } from '@l2beat/shared-pure'

import {
  KnowledgeNugget,
  Milestone,
  ProjectCategory,
  ProjectContracts,
  ProjectDataAvailabilityMode,
  ProjectLinks,
  ProjectPermission,
  ProjectProvider,
} from '../../common'

export interface Layer3 {
  type: 'layer3'
  /** Unique, readable id, will be used in DB. DO NOT EDIT THIS PROPERTY */
  id: ProjectId
  /** Is this layer3 archived? */
  isArchived?: boolean
  /** Is this layer3 an upcoming rollup? */
  isUpcoming?: boolean
  /** Has this layer3 changed and is under review? */
  isUnderReview?: boolean
  /** ProjectId of hostChain */
  hostChain?: ProjectId
  /** Information displayed about the layer3 on the frontend */
  display: Layer3Display
  /** Risk view values for this layer3 */
  contracts: ProjectContracts
  /** List of permissioned addresses */
  permissions?: ProjectPermission[] | 'UnderReview'
  /** Links to recent developments, milestones achieved by the project */
  milestones?: Milestone[]
  /** List of knowledge nuggets: useful articles worth reading */
  knowledgeNuggets?: KnowledgeNugget[]
}

export interface Layer3Display {
  /** Name of the layer3, will be used as a display name on the website */
  name: string
  /** Url friendly layer3 name, will be used in website urls */
  slug: string
  /** Name of the category the layer3 belongs to */
  category: ProjectCategory
  /** Data availability mode of layer3 project */
  dataAvailabilityMode: ProjectDataAvailabilityMode
  /** A warning displayed in the header of the project */
  headerWarning?:
    | {
        /** Warning text */
        text: string
        /** Link to the warning source */
        href: string
      }
    | string
  /** A warning displayed above the description of the project */
  warning?: string
  /** Project raw with red warning will turn into red, and there will be red warning icon with this message */
  redWarning?: string
  /** A few sentences describing the layer3 */
  description: string
  /** A short (<20 characters) description of the use case */
  purpose: string
  /** Technology provider */
  provider?: ProjectProvider
  /** List of links */
  links: ProjectLinks
  /** Where does the activity data come from? */
  activityDataSource?: 'Blockchain RPC' | 'Explorer API' | 'Closed API'
}
