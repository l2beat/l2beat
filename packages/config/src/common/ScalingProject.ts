import type {
  AssetId,
  ChainId,
  EthereumAddress,
  ProjectId,
  StringWithAutocomplete,
  UnixTime,
  ValueWithSentiment,
  WarningValueWithSentiment,
} from '@l2beat/shared-pure'
import type {
  BadgeId,
  DacDaLayer,
  ProofVerification,
  StageConfig,
  WarningWithSentiment,
} from '../projects'
import type { ChainConfig } from './ChainConfig'
import type { KnowledgeNugget } from './KnowledgeNugget'
import type { Milestone } from './Milestone'
import type { ReasonForBeingInOther } from './ReasonForBeingInOther'
import type {
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  ProjectDataAvailability,
} from './dataAvailability'

/** Base interface for Layer2s and Layer3s. The hope is that Layer2 and Layer3 will dissapear and only this will remain. */
export interface ScalingProject {
  /** Unique, readable id, will be used in DB. DO NOT EDIT THIS PROPERTY */
  id: ProjectId
  /** Date of creation of the file (not the project) */
  createdAt: UnixTime
  /** Is this project archived? */
  isArchived?: boolean
  /** Is this project an upcoming rollup? */
  isUpcoming?: boolean
  /** Has this project changed and is under review? */
  isUnderReview?: boolean
  /** Information displayed about the project on the frontend */
  display: ScalingProjectDisplay
  /** Information required to calculate the stats of the project */
  config: ScalingProjectConfig
  /** Technical chain configuration */
  chainConfig?: ChainConfig
  /** Data availability of scaling project */
  dataAvailability?: ProjectDataAvailability
  /** Data availability solution */
  dataAvailabilitySolution?: DacDaLayer
  /** Risk view values for this layer2 */
  riskView: ScalingProjectRiskView
  /** Rollup stage */
  stage: StageConfig
  /** Deep dive into layer2 technology */
  technology: ScalingProjectTechnology
  /** Open-source node details */
  stateDerivation?: ScalingProjectStateDerivation
  /** Explains how project validates state */
  stateValidation?: ScalingProjectStateValidation
  /** List of smart contracts used in the layer2 */
  contracts: ScalingProjectContracts
  /** List of permissioned addresses */
  permissions?: ScalingProjectPermission[] | 'UnderReview'
  /** List of permissioned addresses on the chain itself */
  nativePermissions?: Record<string, ScalingProjectPermission[]> | 'UnderReview'
  /** Links to recent developments, milestones achieved by the project */
  milestones?: Milestone[]
  /** List of knowledge nuggets: useful articles worth reading */
  knowledgeNuggets?: KnowledgeNugget[]
  /** List of badges */
  badges?: BadgeId[]
}

export type ScalingProjectCategory =
  | 'Optimistic Rollup'
  | 'ZK Rollup'
  | 'Plasma'
  | 'Validium'
  | 'Optimium'
  | 'Other'

export interface ScalingProjectConfig {
  /** Associated tokens are marked on TVL breakdown -- "associated token accounts for X% of TVL" */
  associatedTokens?: string[]
  /** Tokens that can be used to pay the gas fee */
  gasTokens?: string[]
  /** Native tokens should be also marked as associated tokens, however often associated tokens are not native tokens. This has to be kept manually in sync with code executed in CBVUpdater.update.  */
  nativeL2TokensIncludedInTVL?: string[]
  /** Assets external to L1 which should be incorporated into the aggregated TVL report for a given project.  */
  externalAssets?: ProjectExternalAssets
  /** List of contracts in which L1 funds are locked */
  escrows: ScalingProjectEscrow[]
  /** API parameters used to get transaction count */
  transactionApi?: ScalingProjectTransactionApi
}

export interface ProjectExternalAssets {
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

export interface ScalingProjectContracts {
  /** List of the contracts on hosted chain */
  addresses: ScalingProjectContract[]
  /** List of risks associated with the contracts */
  risks: ScalingProjectRisk[]
  /** List of the contracts on the chain itself */
  nativeAddresses?: Record<string, ScalingProjectContract[]>
  /** List of references backing up the claim */
  references?: ScalingProjectReference[]
  /** The description and research is incomplete */
  isIncomplete?: boolean
  /** The description and research is under review */
  isUnderReview?: boolean
}

export interface ScalingProjectContract {
  /** Address of the contract */
  address: EthereumAddress
  /** Verification status of the contract */
  isVerified: boolean
  /** Name of the chain of this address. Optional for backwards compatibility */
  chain?: string
  /** Solidity name of the contract */
  name: string
  /** Description of the contract's role in the system */
  description?: string
  /** Details about upgradeability */
  upgradeability?: ScalingProjectUpgradeability
  /** Upgrade delay. Can be simple "21 days" or more complex "8 days shortened to 0 by security council" */
  upgradeDelay?: string
  /** Which actors from permissions can upgrade */
  upgradableBy?: string[]
  /** Other considerations worth mentioning about the upgrade process */
  upgradeConsiderations?: string
  /** Pasuable contract */
  pausable?: {
    /** Is it paused? **/
    paused: boolean
    /** Who can pause/unpause the contract */
    pausableBy: string[]
  }
  /** List of references */
  references?: ScalingProjectReference[]
  /** Indicates whether the generation of contained data was driven by discovery */
  discoveryDrivenData?: boolean
}

export interface ScalingProjectUpgradeability {
  proxyType: string
  immutable?: boolean
  admins: EthereumAddress[]
  implementations: EthereumAddress[]
}

export interface DataAvailabilityConfig {
  layers: DataAvailabilityLayer[]
  bridge: DataAvailabilityBridge
  mode: DataAvailabilityMode
}

export type DataAvailabilityMode = (typeof DA_MODES)[keyof typeof DA_MODES]
export type DataAvailabilityLayer = (typeof DA_LAYERS)[keyof typeof DA_LAYERS]
type MappedDataAvailabilityBridge = {
  [key in keyof typeof DA_BRIDGES]: (typeof DA_BRIDGES)[key] extends (
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    ...args: any[]
  ) => infer R
    ? R
    : (typeof DA_BRIDGES)[key]
}

export type DataAvailabilityBridge =
  MappedDataAvailabilityBridge[keyof MappedDataAvailabilityBridge]

export type ScalingProjectDisplay = {
  /** Name of the scaling project, will be used as a display name on the website */
  name: string
  /** Short name of the scaling project, will be used in some places on the website as a display name */
  shortName?: string
  /** Url friendly scaling project name, will be used in website urls */
  slug: string
  /** Name of the category the scaling project belongs to */
  category: ScalingProjectCategory
  /** Technology provider */
  provider?: ScalingProjectStack
  /** Reasons why the scaling project is included in the other categories. If defined - project will be displayed as other */
  reasonsForBeingOther?: ReasonForBeingInOther[]
  mainPermissions?: {
    proposer: {
      value: string
      secondLine?: string
    }
    challenger: {
      value: StringWithAutocomplete<'None'>
      secondLine?: string
    }
    upgrader: {
      value: string
      secondLine?: string
    }
  }
  /** A warning displayed in the header of the project. Also will be displayed as yellow shield next to project name (table view) */
  headerWarning?: string
  /** Warning for TVL */
  tvlWarning?: WarningWithSentiment
  /** A warning displayed above the description of the project */
  warning?: string
  /** Project raw with red warning will turn into red, and there will be red warning icon with this message */
  redWarning?: string
  /** A few sentences describing the scaling project */
  description: string
  /** Detailed description of the scaling project, will be visible in detailed description section */
  detailedDescription?: string
  /** A short (<20 characters) description of the use case */
  purposes: ScalingProjectPurpose[]
  /** List of links */
  links: ScalingProjectLinks
  /** Where does the activity data come from? */
  activityDataSource?: 'Blockchain RPC' | 'Explorer API' | 'Closed API'
  /** Name of the architecture image to show in the contract section if present, otherwise use slug */
  architectureImage?: string
  /** Name of the state validation image to show in the state validation section if present, otherwise use slug */
  stateValidationImage?: string
  /** Name of the upgrades and governance image to show in the upgrades and governance section if present, otherwise use slug */
  upgradesAndGovernanceImage?: string
}

export type ScalingProjectEscrow = OldProjectEscrow | NewProjectEscrow

export interface AggLayerEscrow {
  type: 'AggLayer'
  nativeAsset: 'etherPreminted' | 'etherWrapped'
  wethAddress?: EthereumAddress
  /** It has to be string because frontend need to serialize it as cache key */
  premintedAmount?: string
  /** Which tokens from L1 shared bridge should be assigned to this project,
   * this is a heuristic and works only until other projects using this bridge
   * are not bridging this token. This flag was added to handle
   * non-ETH gas tokens e.g. OKB, GPT
   */
  tokensToAssignFromL1?: string[]
}

export interface ElasticChainEscrow {
  type: 'ElasticChain'
  l2BridgeAddress: EthereumAddress
  /** ERC20 address of ether on L2 */
  l2EtherAddress: EthereumAddress
  /** Which tokens from L1 shared bridge should be assigned to this project,
   * this is a heuristic and works only until other projects using this bridge
   * are not bridging this token. This flag was added to handle
   * non-ETH gas tokens e.g. OKB, GPT
   */
  tokensToAssignFromL1?: string[]
}

export type SharedEscrow = AggLayerEscrow | ElasticChainEscrow

interface OldProjectEscrow {
  address: EthereumAddress
  /** Timestamp of the deployment transaction of the escrow contract. */
  sinceTimestamp: UnixTime
  /** List of token tickers (e.g. ETH, DAI) to track. Use '*' for all tokens */
  tokens: string[] | '*'
  /** List of token tickers (e.g. ETH, DAI) to exclude from tracking */
  excludedTokens?: string[]
  /** List of token tickers to track as preminted (min(circulating,lockedInEscrow)) */
  premintedTokens?: string[]
  /** Hiding an escrow when it's not used anymore but we need to keep it to calculate past TVL correctly */
  isHistorical?: boolean
  /** Temporary flag meaning that escrow config was migrated to new format */
  newVersion?: false
  /** Upcoming projects needs upcoming escrows (needed for TVL) */
  isUpcoming?: boolean
  chain: string
  /** Inclusive */
  untilTimestamp?: UnixTime
  includeInTotal?: boolean
  source?: 'canonical' | 'external' | 'native'
  /** Bridge used for this escrow */
  bridgedUsing?: {
    bridges: {
      name: string
      /** Slug is used for the URL of the bridge on L2BEAT */
      slug?: string
    }[]
    warning?: string
  }
  sharedEscrow?: SharedEscrow
}

interface NewProjectEscrow {
  /** Address of the escrow. Use etherscan to verify its correctness. */
  address: EthereumAddress
  /** All the data about the escrow contract */
  contract: Omit<ScalingProjectContract, 'address'>
  /** Timestamp of the deployment transaction of the escrow contract. */
  sinceTimestamp: UnixTime
  /** List of token tickers (e.g. ETH, DAI) to track. Use '*' for all tokens */
  tokens: string[] | '*'
  /** List of token tickers (e.g. ETH, DAI) to exclude from tracking */
  excludedTokens?: string[]
  /** List of token tickers to track as preminted (min(circulating,lockedInEscrow)) */
  premintedTokens?: string[]
  /** Hiding an escrow when it's not used anymore but we need to keep it to calculate past TVL correctly */
  isHistorical?: boolean
  /** Temporary flag meaning that escrow config was migrated to new format */
  newVersion?: true
  /** Upcoming projects needs upcoming escrows (needed for TVL) */
  isUpcoming?: boolean
  /** Should use name of the contract for escrow name */
  useContractName?: boolean
  chain: string
  /** Inclusive */
  untilTimestamp?: UnixTime
  includeInTotal?: boolean
  source?: 'canonical' | 'external' | 'native'
  /** Bridge used for this escrow */
  bridgedUsing?: {
    bridges: {
      name: string
      /** Slug is used for the URL of the bridge on L2BEAT */
      slug?: string
    }[]
    warning?: string
  }
  sharedEscrow?: SharedEscrow
}

export interface ScalingProjectLinks {
  /** Links to marketing landing pages. */
  websites: string[]
  /** Links to web apps connected to the layer2. */
  apps: string[]
  /** Links to documentation pages. */
  documentation: string[]
  /** Links to transaction explorers. */
  explorers: string[]
  /** Links to source code repositories. */
  repositories: string[]
  /** Links to social media pages. */
  socialMedia: string[]
  /** Link to rollup codes. */
  rollupCodes?: string
}

export interface ScalingProjectPermission {
  /** List of the accounts */
  accounts: ScalingProjectPermissionedAccount[]
  /** Name of this group */
  name: string
  /** Description of the permissions */
  description: string
  /** Name of the chain of this address. Optional for backwards compatibility */
  chain?: string
  /** List of source code permalinks and useful materials */
  references?: ScalingProjectReference[]
  /** List of accounts that are participants in this permission, mainly used for MultiSigs */
  participants?: ScalingProjectPermissionedAccount[]
  /** Indicates whether the permission comes from a role like Proposer or Guardian */
  fromRole?: boolean
  /** Indicates whether the generation of contained data was driven by discovery */
  discoveryDrivenData?: boolean
}

export interface ScalingProjectPermissionedAccount {
  address: EthereumAddress
  type: 'EOA' | 'MultiSig' | 'Contract'
}

export type ScalingProjectStack =
  | 'OP Stack'
  | 'Arbitrum'
  | 'StarkEx'
  | 'ZKsync Lite'
  | 'ZK Stack'
  | 'Loopring'
  | 'Polygon'
  | 'OVM'
  | 'SN Stack'
  | 'Taiko'
  | 'Cartesi Rollups'

export type ScalingProjectPurpose =
  | 'AI'
  | 'Auctions'
  | 'Betting'
  | 'Bitcoin DApps'
  | 'Bug bounty'
  | 'Exchange'
  | 'Gaming'
  | 'Identity'
  | 'Information'
  | 'Interoperability'
  | 'Launchpad'
  | 'Lending'
  | 'Music'
  | 'NFT'
  | 'Oracles'
  | 'Payments'
  | 'Privacy'
  | 'Universal'
  | 'Social'
  | 'Storage'
  | 'RWA'
  | 'IoT'
  | 'Restaking'

export interface ScalingProjectReference {
  /** Short text describing link contents */
  text: string
  /** URL of the link, preferably https */
  href: string
}

export interface ScalingProjectRisk {
  /** Category of this risk */
  category: ScalingProjectRiskCategory
  /** Description of the risk. Should form a sentence with the category */
  text: string
  /** If the risk is particularly bad */
  isCritical?: boolean
  /** Ignore tests for formatting */
  _ignoreTextFormatting?: boolean
}

export type ScalingProjectRiskCategory =
  | 'Funds can be stolen if'
  | 'Funds can be lost if'
  | 'Funds can be frozen if'
  | 'Funds can lose value if'
  | 'Users can be censored if'
  | 'MEV can be extracted if'
  | 'Withdrawals can be delayed if'

export interface ScalingProjectRiskViewEntry
  extends ValueWithSentiment<string> {
  description: string
  warning?: WarningValueWithSentiment
  // second line in risk view
  secondLine?: string
  sources?: {
    contract: string
    references: string[]
  }[]
  definingMetric?: number
}

export interface ScalingProjectRiskView {
  stateValidation: ScalingProjectRiskViewEntry
  dataAvailability: ScalingProjectRiskViewEntry
  exitWindow: ScalingProjectRiskViewEntry
  sequencerFailure: ScalingProjectRiskViewEntry
  proposerFailure: ScalingProjectRiskViewEntry
}

export interface ScalingProjectStateDerivation {
  nodeSoftware: string
  compressionScheme?: string
  genesisState: string
  dataFormat: string
}

type CategoryTitle =
  // ZK
  | 'ZK Circuits'
  | 'Prover Architecture'
  | 'Verification Keys Generation'
  | 'Proven Program'
  // Optimistic
  | 'State root proposals'
  | 'Challenges'
  | 'Fast confirmations'

export type ScalingProjectStateValidationCategory = {
  title: CategoryTitle
  description: string
  risks?: ScalingProjectRisk[]
  references?: ScalingProjectReference[]
}

export interface ScalingProjectStateValidation {
  description: string
  categories: ScalingProjectStateValidationCategory[]
  proofVerification?: ProofVerification
}

export interface ScalingProjectTechnology {
  /** What state correctness mechanism is used in the project */
  stateCorrectness?: ScalingProjectTechnologyChoice
  /** What is the new cryptography used in the project */
  newCryptography?: ScalingProjectTechnologyChoice
  /** What is the data availability choice for the project */
  dataAvailability?: ScalingProjectTechnologyChoice
  /** What are the details about project operator(s) */
  operator?: ScalingProjectTechnologyChoice
  /** What are the details about force transactions (censorship resistance) */
  forceTransactions?: ScalingProjectTechnologyChoice
  /** A description of the available exit mechanisms */
  exitMechanisms?: ScalingProjectTechnologyChoice[]
  /** What is solution to the mass exit problem */
  massExit?: ScalingProjectTechnologyChoice
  /** Other considerations */
  otherConsiderations?: ScalingProjectTechnologyChoice[]
  /** Is the technology section under review */
  isUnderReview?: boolean
}

export interface ScalingProjectTechnologyChoice {
  /** Name of the specific technology choice */
  name: string
  /** Description of the specific technology choice. Null means missing information */
  description: string
  /** List of references backing up the claim */
  references: ScalingProjectReference[]
  /** List of risks associated with the technology choice */
  risks: ScalingProjectRisk[]
  /** The description and research is incomplete */
  isIncomplete?: boolean
  /** The description and research is under review */
  isUnderReview?: boolean
}

export type AssessCount = (count: number, blockNumber: number) => number

export interface SimpleTransactionApi<T extends string> {
  type: T
  defaultUrl: string
  defaultCallsPerMinute?: number
}

export interface RpcTransactionApi {
  type: 'rpc'
  defaultUrl: string
  defaultCallsPerMinute?: number
  assessCount?: AssessCount
  startBlock?: number
}

export interface StarkexTransactionApi {
  type: 'starkex'
  product: string[]
  sinceTimestamp: UnixTime
  resyncLastDays?: number
}

export type ScalingProjectTransactionApi =
  | SimpleTransactionApi<'starknet'>
  | SimpleTransactionApi<'zksync'>
  | SimpleTransactionApi<'loopring'>
  | SimpleTransactionApi<'degate3'>
  | SimpleTransactionApi<'fuel'>
  | RpcTransactionApi
  | StarkexTransactionApi
