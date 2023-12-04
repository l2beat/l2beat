import {
  AssetId,
  ChainId,
  ProjectId,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'

import {
  KnowledgeNugget,
  Milestone,
  ProjectContracts,
  ProjectEscrow,
  ProjectLinks,
  ProjectPermission,
} from '../../common'
import { StageConfig } from '../common/stages/types'
import { Layer3LivenessConfig } from './Layer3LivenessConfig'
import { Layer3RiskView } from './Layer3RiskView'
import { Layer3StateDerivation } from './Layer3StateDerivation'
import { Layer3Technology } from './Layer3Technology'
import { Layer3TransactionApi } from './Layer3TransactionApi'

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
  /** Information displayed about the layer3 on the frontend */
  display: Layer3Display
  /** Information required to calculate the stats of the layer3 */
  config: Layer3Config
  /** Risk view values for this layer3 */
  riskView: Layer3RiskView
  /** Rollup stage */
  stage: StageConfig
  /** Deep dive into layer3 technology */
  technology: Layer3Technology
  /** Open-source node details */
  stateDerivation?: Layer3StateDerivation
  /** List of smart contracts used in the layer3 */
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
  category: Layer3Category
  /** Name of the host chain */
  hostChain: ProjectId
  /** Data availability mode of layer3 project */
  dataAvailabilityMode: 'StateDiffs' | 'TxData' | 'NotApplicable'
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
  /** A few sentences describing the layer3 */
  description: string
  /** A short (<20 characters) description of the use case */
  purpose: string
  /** Technology provider */
  provider?:
    | 'StarkEx'
    | 'OP Stack'
    | 'zkSync Lite'
    | 'ZK Stack'
    | 'Loopring'
    | 'Arbitrum'
    | 'Polygon'
    | 'OVM'
    | 'Starknet'
  /** List of links */
  links: ProjectLinks
  /** Where does the activity data come from? */
  activityDataSource?: 'Blockchain RPC' | 'Explorer API' | 'Closed API'
  /** Explanation on how liveness data is gathered for given project */
  livenessExplanation?: string
}
export interface Layer3Config {
  /** List of native and external tokens */
  tokenList?: Token[]
  /** Associated tokens are marked on TVL breakdown -- "associated token accounts for X% of TVL" */
  associatedTokens?: string[]
  /** Native tokens should be also marked as associated tokens, however often associated tokens are not native tokens. This has to be kept manually in sync with code executed in CBVUpdater.update.  */
  nativeL2TokensIncludedInTVL?: string[]
  /** Assets external to L1 which should be incorporated into the aggregated TVL report for a given project.  */
  externalAssets?: Layer3ExternalAssets
  /** List of contracts in which L1 funds are locked */
  escrows: ProjectEscrow[]
  /** API parameters used to get transaction count */
  transactionApi?: Layer3TransactionApi
  /** Configuration for getting state updates and batch submission */
  liveness?: Layer3LivenessConfig
}

export interface Layer3ExternalAssets {
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

export type Layer3Category =
  | 'Optimistic Rollup'
  | 'ZK Rollup'
  | 'Plasma'
  | 'Validium'
  | 'Optimium'
