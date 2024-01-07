import { ProjectId } from '@l2beat/shared-pure'

import {
  KnowledgeNugget,
  Layer3Provider,
  Milestone,
  ProjectCategory,
  ProjectLinks,
  ProjectContracts,
  ProjectEscrow
} from '../../common'

export interface Layer3 {
  type: 'layer3'
  /** Unique, readable id, will be used in DB. DO NOT EDIT THIS PROPERTY */
  id: ProjectId
  /** Is this layer3 an upcoming rollup? */
  isUpcoming?: boolean
  /** Information required to calculate the stats of the layer2 */
  config: Layer3Config
  /** Has this layer3 changed and is under review? */
  isUnderReview?: boolean
  /** ProjectId of hostChain */
  hostChain: ProjectId
  /** Information displayed about the layer3 on the frontend */
  display: Layer3Display
  /** Links to recent developments, milestones achieved by the project */
  milestones?: Milestone[]
  /** List of knowledge nuggets: useful articles worth reading */
  knowledgeNuggets?: KnowledgeNugget[]
  /** List of permissioned addresses */
  contracts: ProjectContracts

}

export interface Layer3Display {
  /** Name of the layer3, will be used as a display name on the website */
  name: string
  /** Url friendly layer3 name, will be used in website urls */
  slug: string
  /** Name of the category the layer3 belongs to */
  category: ProjectCategory
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
  provider?: Layer3Provider
  /** List of links */
  links: ProjectLinks
}

export interface Layer3Config {
  // /** List of native and external tokens */
  // tokenList?: Token[]
  // /** Associated tokens are marked on TVL breakdown -- "associated token accounts for X% of TVL" */
  // associatedTokens?: string[]
  // /** Native tokens should be also marked as associated tokens, however often associated tokens are not native tokens. This has to be kept manually in sync with code executed in CBVUpdater.update.  */
  // nativeL2TokensIncludedInTVL?: string[]
  // /** Assets external to L1 which should be incorporated into the aggregated TVL report for a given project.  */
  // externalAssets?: Layer2ExternalAssets
  /** List of contracts in which L1 funds are locked */
  escrows: ProjectEscrow[]
  // /** API parameters used to get transaction count */
  // transactionApi?: Layer2TransactionApi
  // /** Configuration for getting state updates and batch submission */
  // liveness?: Layer2Liveness
}