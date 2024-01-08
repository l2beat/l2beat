import {
  AssetId,
  ChainId,
  ProjectId,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'

import {
  KnowledgeNugget,
  Layer2Provider,
  Milestone,
  ProjectCategory,
  ProjectContracts,
  ProjectDataAvailabilityMode,
  ProjectEscrow,
  ProjectLinks,
  ProjectPermission,
} from '../../common'
import { StageConfig } from '../common/stages/types'
import { Layer2Liveness } from './Layer2LivenessConfig'
import { Layer2RiskView } from './Layer2RiskView'
import { Layer2StateDerivation } from './Layer2StateDerivation'
import { Layer2Technology } from './Layer2Technology'
import { Layer2TransactionApi } from './Layer2TransactionApi'

export interface Layer2 {
  type: 'layer2'
  /** Unique, readable id, will be used in DB. DO NOT EDIT THIS PROPERTY */
  id: ProjectId
  /** Is this layer2 archived? */
  isArchived?: boolean
  /** Is this layer2 an upcoming rollup? */
  isUpcoming?: boolean
  /** Has this layer2 changed and is under review? */
  isUnderReview?: boolean
  /** Information displayed about the layer2 on the frontend */
  display: Layer2Display
  /** Information required to calculate the stats of the layer2 */
  config: Layer2Config
  /** Risk view values for this layer2 */
  riskView: Layer2RiskView
  /** Rollup stage */
  stage: StageConfig
  /** Deep dive into layer2 technology */
  technology: Layer2Technology
  /** Open-source node details */
  stateDerivation?: Layer2StateDerivation
  /** How project validates state? */
  stateValidation?: string
  /** List of smart contracts used in the layer2 */
  contracts: ProjectContracts
  /** List of permissioned addresses */
  permissions?: ProjectPermission[] | 'UnderReview'
  /** Links to recent developments, milestones achieved by the project */
  milestones?: Milestone[]
  /** List of knowledge nuggets: useful articles worth reading */
  knowledgeNuggets?: KnowledgeNugget[]
}

export interface Layer2Display {
  /** Name of the layer2, will be used as a display name on the website */
  name: string
  /** Short name of the layer2, will be used in some places on the website as a display name */
  shortName?: string
  /** Url friendly layer2 name, will be used in website urls */
  slug: string
  /** Name of the category the layer2 belongs to */
  category: ProjectCategory
  /** Data availability mode of layer2 project */
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
  /** A few sentences describing the layer2 */
  description: string
  /** A short (<20 characters) description of the use case */
  purpose: string
  /** Technology provider */
  provider?: Layer2Provider
  /** List of links */
  links: ProjectLinks
  /** Where does the activity data come from? */
  activityDataSource?: 'Blockchain RPC' | 'Explorer API' | 'Closed API'
  /** Explanation on how liveness data is gathered for given project */
  liveness?: Layer2LivenessDisplay
}
export interface Layer2LivenessDisplay {
  explanation?: string
  warnings?: {
    stateUpdates?: string
    batchSubmissions?: string
    proofSubmissions?: string
  }
}

export interface Layer2Config {
  /** List of native and external tokens */
  tokenList?: Token[]
  /** Associated tokens are marked on TVL breakdown -- "associated token accounts for X% of TVL" */
  associatedTokens?: string[]
  /** Native tokens should be also marked as associated tokens, however often associated tokens are not native tokens. This has to be kept manually in sync with code executed in CBVUpdater.update.  */
  nativeL2TokensIncludedInTVL?: string[]
  /** Assets external to L1 which should be incorporated into the aggregated TVL report for a given project.  */
  externalAssets?: Layer2ExternalAssets
  /** List of contracts in which L1 funds are locked */
  escrows: ProjectEscrow[]
  /** API parameters used to get transaction count */
  transactionApi?: Layer2TransactionApi
  /** Configuration for getting state updates and batch submission */
  liveness?: Layer2Liveness
}

export interface Layer2ExternalAssets {
  /** Id of the external chain on which assets are held. */
  chainId: ChainId
  /** List of assets to include. */
  assets: {
    /** Id of a given asset. */
    assetId: AssetId
    /** L2 contract address of the asset. */
    tokenAddress: string
    /** "Creation time" of a given asset, we assume that it did not exists before that time. */
    sinceTimestamp: UnixTime
    /** How fine grained the asset is */
    decimals: number
  }[]
}
