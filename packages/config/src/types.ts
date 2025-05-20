import type { TrackedTxConfigEntry } from '@l2beat/shared'
import {
  type ChainId,
  EthereumAddress,
  type ProjectId,
  type StringWithAutocomplete,
  TokenId,
  type TrackedTxsConfigSubtype,
  type UnixTime,
  stringAs,
} from '@l2beat/shared-pure'
import { z } from 'zod'

// #region shared types
export type Sentiment = 'bad' | 'warning' | 'good' | 'neutral' | 'UnderReview'
export interface WarningWithSentiment {
  value: string
  sentiment: 'bad' | 'warning' | 'neutral'
}

export interface TableReadyValue {
  value: string
  secondLine?: string
  description?: string
  sentiment?: Sentiment
  warning?: WarningWithSentiment
  /** Taken into account when sorting. Defaults to 0. */
  orderHint?: number
}

export interface ProjectTechnologyChoice {
  name: string
  description: string
  references: ReferenceLink[]
  risks: ProjectRisk[]
  isIncomplete?: boolean
  isUnderReview?: boolean
}

export interface ReferenceLink {
  title: string
  url: string
}

export interface ProjectRisk {
  category: ProjectRiskCategory
  /** Description of the risk. Should form a sentence with the category */
  text: string
  isCritical?: boolean
  _ignoreTextFormatting?: boolean
}

export type ProjectRiskCategory =
  | 'Funds can be stolen if'
  | 'Funds can be lost if'
  | 'Funds can be frozen if'
  | 'Funds can lose value if'
  | 'Users can be censored if'
  | 'MEV can be extracted if'
  | 'Withdrawals can be delayed if'
// #endregion

export interface BaseProject {
  id: ProjectId
  slug: string
  name: string
  /** Used in place of name in tables to save space. */
  shortName: string | undefined
  addedAt: UnixTime

  // common data
  statuses?: ProjectStatuses
  display?: ProjectDisplay
  colors?: ProjectColors
  milestones?: Milestone[]
  chainConfig?: ChainConfig
  escrows?: ProjectEscrow[]

  // bridge data
  bridgeInfo?: ProjectBridgeInfo
  bridgeRisks?: ProjectBridgeRisks
  bridgeTechnology?: ProjectBridgeTechnology

  // scaling data
  scalingInfo?: ProjectScalingInfo
  scalingStage?: ProjectScalingStage
  scalingRisks?: ProjectScalingRisks
  scalingDa?: ProjectScalingDa
  scalingTechnology?: ProjectScalingTechnology

  // da data
  daLayer?: ProjectDaLayer
  daBridge?: ProjectDaBridge
  customDa?: ProjectCustomDa

  // zk catalog data
  proofVerification?: ProjectProofVerification

  // feature configs
  tvsInfo?: ProjectTvsInfo
  tvsConfig?: TvsToken[]
  activityConfig?: ProjectActivityConfig
  livenessInfo?: ProjectLivenessInfo
  livenessConfig?: ProjectLivenessConfig
  costsInfo?: ProjectCostsInfo
  trackedTxsConfig?: Omit<TrackedTxConfigEntry, 'id'>[]
  finalityInfo?: ProjectFinalityInfo
  finalityConfig?: ProjectFinalityConfig
  daTrackingConfig?: ProjectDaTrackingConfig[]
  ecosystemInfo?: ProjectEcosystemInfo
  ecosystemConfig?: ProjectEcosystemConfig

  // discovery data
  permissions?: Record<string, ProjectPermissions>
  contracts?: ProjectContracts
  discoveryInfo?: ProjectDiscoveryInfo

  // tags
  isBridge?: true
  isScaling?: true
  isZkCatalog?: true
  isDaLayer?: true
  isUpcoming?: true
  archivedAt?: UnixTime
  hasActivity?: true
}

// #region common data
export interface ProjectColors {
  primary: string
  secondary: string
}

export interface ProjectStatuses {
  yellowWarning: string | undefined
  redWarning: string | undefined
  emergencyWarning: string | undefined
  isUnderReview: boolean
  isUnverified: boolean
  // countdowns
  otherMigration?: {
    expiresAt: number
    pretendingToBe: ProjectScalingCategory
    reasons: ReasonForBeingInOther[]
  }
}

export interface ProjectDisplay {
  description: string
  links: ProjectLinks
  badges: Badge[]
}

export interface ProjectLinks {
  /** Links to marketing landing pages. */
  websites?: string[]
  /** Links to web apps. */
  apps?: string[]
  documentation?: string[]
  explorers?: string[]
  repositories?: string[]
  socialMedia?: string[]
  rollupCodes?: string
}
export interface Badge {
  id: string
  type: string
  name: string
  description: string
  action: BadgeAction | undefined
}

export type BadgeAction =
  | BadgeScalingFilterAction
  | BadgeSelfScalingFilterAction
  | BadgePublicDaHighlightAction
  | BadgeselfDaHighlightAction

// Move to scaling/summary with given filterId and value
export type BadgeScalingFilterAction = {
  type: 'scalingFilter'
  id: BadgeFilterId
  value: string
}

// Move to scaling/summary with given filterId and name of the project as a value
export type BadgeSelfScalingFilterAction = {
  type: 'selfScalingFilter'
  id: BadgeFilterId
}

// Move to data-availability/summary and highlight project with given slug
export type BadgePublicDaHighlightAction = {
  type: 'publicDaHighlight'
  slug: string
}

// Move to data-availability/summary and highlight project with the same slug as the project
export type BadgeselfDaHighlightAction = {
  type: 'selfDaHighlight'
}

export type BadgeFilterId =
  | 'stack'
  | 'hostChain'
  | 'daLayer'
  | 'raas'
  | 'infrastructure'
  | 'vm'

export interface Milestone {
  title: string
  url: string
  date: string
  description?: string
  type: 'general' | 'incident'
}

export interface ChainConfig {
  /**
   * A lowercase a-z0-9 name of the chain. Used for uniquely identifying the
   * chain in configuration.
   */
  name: string
  /** undefined is reserved for non-evm chains that don't have a notion of chain id! */
  chainId: number | undefined
  explorerUrl?: string
  /** Tokens that can be used to pay the gas fee */
  gasTokens?: string[]
  multicallContracts?: MulticallContractConfig[]
  coingeckoPlatform?: string
  /**
   * Setting this value for a chain does not always equal to grabbing the
   * timestamp of the first block. For example Optimism had block 0 on
   * January 2021 but the block 1 on November 2021.
   */
  sinceTimestamp?: UnixTime
  untilTimestamp?: UnixTime
  apis: ChainApiConfig[]
}

export interface MulticallContractConfig {
  address: EthereumAddress
  sinceBlock: number
  batchSize: number
  version: '1' | '2' | '3' | 'optimism'
  isNativeBalanceSupported?: boolean
}

export type ChainApiConfig =
  | ChainBasicApi<'rpc'>
  | ChainBasicApi<'starknet'>
  | ChainBasicApi<'zksync'>
  | ChainBasicApi<'loopring'>
  | ChainBasicApi<'degate3'>
  | ChainBasicApi<'fuel'>
  | ChainBasicApi<'svm-rpc'>
  | ChainExplorerApi<'blockscout'>
  | ChainExplorerApi<'blockscoutV2'>
  | ChainExplorerApi<'routescan'>
  | StarkexApi
  | EtherscanApi

export interface ChainBasicApi<T extends string> {
  type: T
  url: string
  callsPerMinute?: number
  retryStrategy?: 'UNRELIABLE' | 'RELIABLE'
}

export interface ChainExplorerApi<T extends string> {
  type: T
  url: string
  contractCreationUnsupported?: boolean
}

export interface StarkexApi {
  type: 'starkex'
  product: string[]
}

export interface EtherscanApi {
  type: 'etherscan'
  chainId: number
  contractCreationUnsupported?: boolean
}

// #endregion

// #region bridge data
export interface ProjectBridgeInfo {
  category: BridgeCategory
  destination: string[]
  validatedBy: string
}

export type BridgeCategory =
  | 'Token Bridge'
  | 'Liquidity Network'
  | 'Hybrid'
  | 'Single-chain'

export interface ProjectBridgeRisks {
  validatedBy: TableReadyValue
  sourceUpgradeability?: TableReadyValue
  destinationToken?: TableReadyValue
  livenessFailure?: TableReadyValue
}

export interface ProjectBridgeTechnology {
  canonical?: boolean
  destination: string[]
  principleOfOperation?: ProjectTechnologyChoice
  validation?: ProjectTechnologyChoice
  destinationToken?: ProjectTechnologyChoice
  isUnderReview?: boolean
  detailedDescription?: string
  upgradesAndGovernance?: string
  upgradesAndGovernanceImage?: string
  otherConsiderations?: ProjectTechnologyChoice[]
}
// #endregion

// #region scaling data
export interface ProjectScalingInfo {
  layer: 'layer2' | 'layer3'
  type: ProjectScalingCategory
  capability: ProjectScalingCapability
  /** In the future this will be reflected as `type === 'Other'` */
  isOther: boolean
  reasonsForBeingOther: ReasonForBeingInOther[] | undefined
  hostChain: {
    id: ProjectId
    slug: string
    name: string
    shortName: string | undefined
  }
  stack: ProjectScalingStack | undefined
  raas: string | undefined
  infrastructure: string | undefined
  vm: string[]
  daLayer: string | undefined
  stage: ProjectStageName
  purposes: ProjectScalingPurpose[]
  scopeOfAssessment: ProjectScalingScopeOfAssessment | undefined
}

export type ProjectScalingCategory =
  | 'Optimistic Rollup'
  | 'ZK Rollup'
  | 'Plasma'
  | 'Validium'
  | 'Optimium'
  | 'Other'

export type ProjectScalingCapability = 'universal' | 'appchain'

export type ProjectScalingScopeOfAssessment = {
  inScope: string[]
  notInScope: string[]
}

export interface ReasonForBeingInOther {
  label: string
  shortDescription: string
  description: string
}

export type ProjectScalingStack =
  | 'OP Stack'
  | 'Arbitrum'
  | 'StarkEx'
  | 'ZKsync Lite'
  | 'ZK Stack'
  | 'Loopring'
  | 'Agglayer CDK'
  | 'OVM'
  | 'SN Stack'
  | 'Taiko'
  | 'Cartesi Rollups'

export type ProjectStageName =
  | 'Not applicable'
  | 'Under review'
  | 'Stage 0'
  | 'Stage 1'
  | 'Stage 2'

export type ProjectScalingPurpose =
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
  | 'KYC-ed DeFi'
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

export type ProjectScalingStage =
  | StageNotApplicable
  | StageUnderReview
  | StageConfigured

export interface StageConfigured {
  stage: Stage
  downgradePending: StageDowngrade | undefined
  missing?: MissingStageDetails
  message: StageConfiguredMessage | undefined
  summary: StageSummary[]
  additionalConsiderations?: {
    short: string
    long: string
  }
}

export type Stage = 'Stage 0' | 'Stage 1' | 'Stage 2'

export interface StageDowngrade {
  expiresAt: number
  reason: string
  toStage: Stage
}

export interface MissingStageDetails {
  nextStage: Stage
  principle: string | undefined
  requirements: string[]
}

export interface StageConfiguredMessage {
  type: 'underReview' | 'warning' | undefined
  text: string
}

export interface StageSummary {
  stage: Stage
  principle:
    | {
        satisfied: boolean | 'UnderReview'
        description: string
      }
    | undefined
  requirements: {
    satisfied: boolean | 'UnderReview'
    description: string
  }[]
}

export interface StageUnderReview {
  stage: 'UnderReview'
}

export interface StageNotApplicable {
  stage: 'NotApplicable'
}
export interface ProjectScalingRisks {
  self: ProjectScalingRiskView
  host: ProjectScalingRiskView | undefined
  stacked: ProjectScalingRiskView | undefined
}

export interface ProjectScalingRiskView {
  stateValidation: TableReadyValue
  dataAvailability: TableReadyValue
  exitWindow: TableReadyValue
  sequencerFailure: TableReadyValue
  proposerFailure: TableReadyValue
}

export interface ProjectScalingDa {
  layer: TableReadyValue & { projectId?: ProjectId }
  bridge: TableReadyValue & { projectId?: ProjectId }
  mode: TableReadyValue
}

export interface ProjectScalingTechnology {
  warning?: string
  detailedDescription?: string
  architectureImage?: string
  dataAvailability?: ProjectTechnologyChoice
  operator?: ProjectTechnologyChoice
  sequencing?: ProjectTechnologyChoice
  sequencingImage?: string
  forceTransactions?: ProjectTechnologyChoice
  exitMechanisms?: ProjectTechnologyChoice[]
  massExit?: ProjectTechnologyChoice
  otherConsiderations?: ProjectTechnologyChoice[]
  upgradesAndGovernance?: string
  upgradesAndGovernanceImage?: string
  stateDerivation?: ProjectScalingStateDerivation
  stateValidation?: ProjectScalingStateValidation
  stateValidationImage?: string
  isUnderReview?: boolean
}

export interface ProjectScalingStateDerivation {
  nodeSoftware: string
  compressionScheme?: string
  genesisState: string
  dataFormat: string
  isUnderReview?: boolean
}

export interface ProjectScalingStateValidation {
  description?: string
  categories: ProjectScalingStateValidationCategory[]
  proofVerification?: ProjectProofVerification
  isUnderReview?: boolean
}

export interface ProjectScalingStateValidationCategory {
  title: // ZK
    | 'ZK Circuits'
    | 'Prover Architecture'
    | 'Verification Keys Generation'
    | 'Proven Program'
    | 'Validity proofs'
    // Optimistic
    | 'State root proposals'
    | 'Challenges'
    | 'Fast confirmations'
    | 'Pessimistic Proofs'
    | 'Fraud proofs'
    // Other
    | 'No state validation'
  description: string
  risks?: ProjectRisk[]
  references?: ReferenceLink[]
  isIncomplete?: boolean
}
// #endregion

// #region da data
export interface ProjectDaLayer {
  name?: string
  description?: string
  type: string
  systemCategory: 'public' | 'custom'
  risks: DaLayerRisks
  technology: DaTechnology
  usedWithoutBridgeIn: UsedInProject[]

  /** The period within which full nodes must store and distribute data. @unit seconds */
  pruningWindow?: number
  consensusAlgorithm?: DaConsensusAlgorithm
  throughput?: DaLayerThroughput[]
  /** The time it takes to finalize the data. @unit seconds */
  finality?: number
  dataAvailabilitySampling?: DataAvailabilitySampling
  economicSecurity?: DaEconomicSecurity
}

export interface AdjustableEconomicSecurityRisk {
  value: TableReadyValue
  adjustSecurityRisk: boolean
}

export interface DaLayerRisks {
  daLayer?: TableReadyValue
  economicSecurity?: AdjustableEconomicSecurityRisk
  fraudDetection?: TableReadyValue
}

export interface DaTechnology {
  /** Description of technology used by the data availability layer. [MARKDOWN] */
  description: string
  risks?: ProjectRisk[] // scaling risks on purpose
  references?: ReferenceLink[]
}

export interface UsedInProject {
  id: ProjectId
  name: string
  slug: string
}

export interface DaConsensusAlgorithm {
  name: string
  description: string
  /** @unit seconds. */
  blockTime: number
  /** Consensus finality time. @unit seconds. */
  consensusFinality: number
  /** Duration of time for unbonding in seconds. Intended to capture the weak subjectivity period. @unit seconds. */
  unbondingPeriod: number
}

export interface DaLayerThroughput {
  /**
   * Batch size for data availability. Together with batchFrequency it determines max throughput.
   * @unit B - bytes
   */
  size: number
  /**
   * Desired size of blob data per block. Should be less than or equal to size.
   * @unit B - bytes
   */
  target?: number
  /**
   * Batch frequency for data availability. Together with batchSize it determines max throughput.
   * @unit seconds
   */
  frequency: number
  /**
   * Inclusive timestamp of when this throughput was introduced.
   * If more than one throughput is provided, it will be used as the end time of previous one
   */
  sinceTimestamp: number
}

export interface DataAvailabilitySampling {
  erasureCodingScheme: '1D Reed-Solomon' | '2D Reed-Solomon'
  erasureCodingProof: 'Validity proofs' | 'Fraud proofs' | 'None'
}

export interface DaEconomicSecurity {
  name: string
  token: {
    symbol: string
    decimals: number
    coingeckoId: string
  }
}

export interface ProjectDaBridge {
  name: string
  daLayer: ProjectId
  technology: DaTechnology
  risks: DaBridgeRisks
  usedIn: UsedInProject[]
  dac?: DacInfo
}

export interface DaBridgeRisks {
  isNoBridge?: boolean
  /** Replaces risk grissini */
  callout?: string
  daBridge?: TableReadyValue
  committeeSecurity?: TableReadyValue
  upgradeability?: TableReadyValue
  relayerFailure?: TableReadyValue
}

export interface DacInfo {
  membersCount: number
  knownMembers?: {
    external: boolean
    name: string
    href: string
    key?: string
  }[]
  requiredMembers: number
  /** TEMP: Members field will turn into N/A badge if this is true */
  hideMembers?: boolean
}

export interface ProjectCustomDa {
  /** Will show the project name if not provided. */
  name?: string
  description?: string
  type: string
  risks: DaLayerRisks & DaBridgeRisks
  technology: DaTechnology
  dac?: DacInfo
  fallback?: TableReadyValue
  challengeMechanism?: DaChallengeMechanism
}

export type DaChallengeMechanism = 'DA Challenges' | 'None'
// #endregion

// #region zk catalog data
export interface ProjectProofVerification {
  shortDescription?: string
  aggregation: boolean
  verifiers: OnchainVerifier[]
  requiredTools: RequiredTool[]
}

export type OnchainVerifier = {
  name: string
  description: string
  contractAddress: EthereumAddress
  /** Link to the smart contract code on an explorer. Automatically set. */
  url?: string
  chainId: ChainId
  subVerifiers: SubVerifier[]
} & (
  | {
      verified: 'yes' | 'failed'
      /** Details of entity that performed verification */
      performedBy: {
        name: string
        link: string
      }
    }
  | { verified: 'no' }
)

export interface SubVerifier {
  name: string
  proofSystem: string
  mainArithmetization: string
  mainPCS: string
  trustedSetup?: StringWithAutocomplete<'None'>
  link?: string
}

export interface RequiredTool {
  name: string
  version: string
  link?: string
}
// #endregion

// #region feature configs
export interface ProjectTvsInfo {
  associatedTokens: string[]
  warnings: WarningWithSentiment[]
}

export type ProjectEscrowSource = 'canonical' | 'external' | 'native'

export type SharedEscrow = AggLayerEscrow | ElasticChainEscrow

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

export type ProjectActivityConfig =
  | BlockActivityConfig
  | DayActivityConfig
  | SlotActivityConfig

export interface BlockActivityConfig {
  type: 'block'
  adjustCount?: AdjustCount
  startBlock?: number
  // how many blocks to fetch in single indexer tick
  batchSize?: number
}

export interface SlotActivityConfig {
  type: 'slot'
  startSlot: number
  // how many slots to fetch in single indexer tick
  batchSize?: number
}

export type AdjustCount =
  | { type: 'SubtractOne' }
  | { type: 'SubtractOneSinceBlock'; blockNumber: number }

export interface DayActivityConfig {
  type: 'day'
  sinceTimestamp: UnixTime
  resyncLastDays?: number
}

export interface ProjectLivenessInfo {
  explanation?: string
  warnings?: {
    stateUpdates?: string
    batchSubmissions?: string
    proofSubmissions?: string
  }
}

export interface ProjectLivenessConfig {
  duplicateData: {
    from: TrackedTxsConfigSubtype
    to: TrackedTxsConfigSubtype
  }
}

export interface ProjectCostsInfo {
  warning?: WarningWithSentiment
}

export interface ProjectFinalityInfo {
  /** Warning tooltip content for finality tab for given project */
  warnings?: {
    timeToInclusion?: WarningWithSentiment
    stateUpdateDelay?: WarningWithSentiment
  }
  /** Finalization period displayed in table for given project (time in seconds) */
  finalizationPeriod?: number
}

export type ProjectFinalityConfig =
  // We require the minTimestamp to be set for all types that will be processed in FinalityIndexer
  | {
      type:
        | 'Linea'
        | 'zkSyncEra'
        | 'Scroll'
        | 'zkSyncLite'
        | 'Starknet'
        | 'Arbitrum'
        | 'Loopring'
        | 'Degate'
        | 'PolygonZkEvm'

      minTimestamp: UnixTime
      lag: number
      stateUpdate: StateUpdateMode
    }
  | {
      type: 'OPStack'
      minTimestamp: UnixTime
      lag: number
      // https://specs.optimism.io/protocol/holocene/derivation.html#span-batches
      // you can get this values by calling the RPC method optimism_rollupConfig
      // rollup config: curl -X POST -H "Content-Type: application/json" --data \
      // '{"jsonrpc":"2.0","method":"optimism_rollupConfig","params":[],"id":1}'  \
      // <rpc-url> | jq
      genesisTimestamp: UnixTime
      l2BlockTimeSeconds: number
      stateUpdate: StateUpdateMode
    }

/**
 * Determines how the state update should be handled.
 * - `analyze`: The state update delay should be analyzed as a part of the update.
 * - `zeroed`: The state update delay should be zeroed, analyzer will not be run.
 * - `disabled`: The state update analyzer will not be run.
 */
export type StateUpdateMode = 'analyze' | 'zeroed' | 'disabled'

export type ProjectDaTrackingConfig =
  | EthereumDaTrackingConfig
  | CelestiaDaTrackingConfig
  | AvailDaTrackingConfig

export interface EthereumDaTrackingConfig {
  type: 'ethereum'
  daLayer: ProjectId
  inbox: string
  sequencers?: string[]
  sinceBlock: number
  untilBlock?: number
}

export interface CelestiaDaTrackingConfig {
  type: 'celestia'
  daLayer: ProjectId
  namespace: string
  sinceBlock: number
  untilBlock?: number
}

export interface AvailDaTrackingConfig {
  type: 'avail'
  daLayer: ProjectId
  appId: string
  sinceBlock: number
  untilBlock?: number
}

export interface ProjectEcosystemInfo {
  id: ProjectId
  sinceTimestamp?: UnixTime
  untilTimestamp?: UnixTime
}

export interface ProjectEcosystemConfig {
  token: {
    tokenId: string
    projectId: ProjectId
    description: string
  }
  links: {
    buildOn: string
    learnMore: string
    governanceTopDelegates: string
    governanceProposals: string
    tools?: string[]
    grants?: string
  }
}
// #endregion

// #region discovery data
export interface ProjectPermissions {
  /** List of roles */
  roles?: ProjectPermission[]
  /** List of actors */
  actors?: ProjectPermission[]
}

export interface ProjectPermission {
  /** List of the accounts */
  accounts: ProjectPermissionedAccount[]
  /** Name of this group */
  name: string
  /** Description of the permissions */
  description: string
  /** Name of the chain of this address. Optional for backwards compatibility */
  chain: string
  /** List of source code permalinks and useful materials */
  references?: ReferenceLink[]
  /** List of accounts that are participants in this permission, mainly used for MultiSigs */
  participants?: ProjectPermissionedAccount[]
  /** Indicates whether the generation of contained data was driven by discovery */
  discoveryDrivenData?: boolean
}

export interface ProjectPermissionedAccount {
  name: string
  url: string
  address: EthereumAddress
  isVerified: boolean
  type: 'EOA' | 'Contract'
}

export interface ProjectContracts {
  /** List of the contracts on a given chain */
  addresses: Record<string, ProjectContract[]>
  /** List of risks associated with the contracts */
  risks: ProjectRisk[]
  escrows?: ProjectEscrow[]
}

export interface ProjectContract {
  /** Address of the contract */
  address: EthereumAddress
  /** Verification status of the contract */
  isVerified: boolean
  /** Name of the chain of this address. Optional for backwards compatibility */
  chain: string
  /** Explorer url for the code of that contract. Set automatically */
  url?: string
  /** Solidity name of the contract */
  name: string
  /** Description of the contract's role in the system */
  description?: string
  /** Details about upgradeability */
  upgradeability?: ProjectContractUpgradeability
  /** Which actors from permissions can upgrade */
  upgradableBy?: ProjectUpgradeableActor[]
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
  references?: ReferenceLink[]
  /** Indicates whether the generation of contained data was driven by discovery */
  discoveryDrivenData?: boolean
}

export interface ProjectContractUpgradeability {
  proxyType: string
  immutable?: boolean
  admins: EthereumAddress[]
  implementations: EthereumAddress[]
}

export interface ProjectUpgradeableActor {
  /** Actor from permissions that can upgrade */
  name: string
  /** Upgrade delay. Can be simple "21 days" or more complex "8 days shortened to 0 by security council" */
  delay: string
}

export interface ProjectEscrow {
  chain: string
  /** Automatically set in config based on chain name. */
  chainId?: number
  /** Address of the escrow. Use etherscan to verify its correctness. */
  address: EthereumAddress
  /** Should use name of the contract for escrow name */
  useContractName?: boolean
  /** All the data about the escrow contract */
  contract?: Omit<ProjectContract, 'address'>
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
  /** Upcoming projects needs upcoming escrows (needed for TVL) */
  isUpcoming?: boolean
  /** Inclusive */
  untilTimestamp?: UnixTime
  includeInTotal?: boolean
  source?: ProjectEscrowSource
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

export interface ProjectDiscoveryInfo {
  isDiscoDriven: boolean
  permissionsDiscoDriven: boolean
  contractsDiscoDriven: boolean
}
// #endregion

// #region TVS
export const BaseCalculationFormulaSchema = z.object({
  type: z.literal('calculation'),
  operator: z.enum(['sum', 'diff', 'max', 'min']),
})

// type hint needed due to zod limitations on recursive types
export type CalculationFormula = z.infer<
  typeof BaseCalculationFormulaSchema
> & {
  arguments: (CalculationFormula | ValueFormula | AmountFormula)[]
}

// biome-ignore lint/suspicious/noExplicitAny: zod limitations on recursive types
export const CalculationFormulaSchema: any =
  BaseCalculationFormulaSchema.extend({
    arguments: z.array(
      z.union([
        z.lazy(() => CalculationFormulaSchema),
        z.lazy(() => ValueFormulaSchema),
        z.lazy(() => AmountFormulaSchema),
      ]),
    ),
  })

export type ValueFormula = z.infer<typeof ValueFormulaSchema>
export const ValueFormulaSchema = z.object({
  type: z.literal('value'),
  amount: z.union([
    z.lazy(() => AmountFormulaSchema),
    z.lazy(() => CalculationFormulaSchema),
  ]),
  priceId: z.string(),
})

export type BalanceOfEscrowAmountFormula = z.infer<
  typeof BalanceOfEscrowAmountFormulaSchema
>
export const BalanceOfEscrowAmountFormulaSchema = z.object({
  type: z.literal('balanceOfEscrow'),
  chain: z.string(),
  sinceTimestamp: z.number(),
  untilTimestamp: z.number().optional(),
  address: z.union([stringAs(EthereumAddress), z.literal('native')]),
  decimals: z.number(),
  escrowAddress: stringAs(EthereumAddress),
})

export type TotalSupplyAmountFormula = z.infer<
  typeof TotalSupplyAmountFormulaSchema
>
export const TotalSupplyAmountFormulaSchema = z.object({
  type: z.literal('totalSupply'),
  chain: z.string(),
  sinceTimestamp: z.number(),
  untilTimestamp: z.number().optional(),
  address: stringAs(EthereumAddress),
  decimals: z.number(),
})

export type StarknetTotalSupplyAmountFormula = z.infer<
  typeof StarknetTotalSupplyAmountFormulaSchema
>
export const StarknetTotalSupplyAmountFormulaSchema = z.object({
  type: z.literal('starknetTotalSupply'),
  chain: z.string(),
  sinceTimestamp: z.number(),
  untilTimestamp: z.number().optional(),
  address: z.string(),
  decimals: z.number(),
})

export type CirculatingSupplyAmountFormula = z.infer<
  typeof CirculatingSupplyAmountFormulaSchema
>
export const CirculatingSupplyAmountFormulaSchema = z.object({
  type: z.literal('circulatingSupply'),
  sinceTimestamp: z.number(),
  untilTimestamp: z.number().optional(),
  apiId: z.string(),
  decimals: z.number(),
  address: stringAs(EthereumAddress), // for frontend only
  chain: z.string(), // for frontend only
})

export type ConstAmountFormula = z.infer<typeof ConstAmountFormulaSchema>
export const ConstAmountFormulaSchema = z.object({
  type: z.literal('const'),
  sinceTimestamp: z.number(),
  untilTimestamp: z.number().optional(),
  value: z.string(),
  decimals: z.number(),
})

export type AmountFormula = z.infer<typeof AmountFormulaSchema>
export const AmountFormulaSchema = z.union([
  BalanceOfEscrowAmountFormulaSchema,
  TotalSupplyAmountFormulaSchema,
  CirculatingSupplyAmountFormulaSchema,
  ConstAmountFormulaSchema,
  StarknetTotalSupplyAmountFormulaSchema,
])

export type Formula = CalculationFormula | ValueFormula | AmountFormula
export function isAmountFormula(formula: Formula): boolean {
  return formula.type !== 'calculation' && formula.type !== 'value'
}

export type OnchainAmountFormula =
  | BalanceOfEscrowAmountFormula
  | TotalSupplyAmountFormula
  | StarknetTotalSupplyAmountFormula

export function isOnchainAmountFormula(
  formula: Formula,
): formula is OnchainAmountFormula {
  return (
    formula.type === 'totalSupply' ||
    formula.type === 'balanceOfEscrow' ||
    formula.type === 'starknetTotalSupply'
  )
}

// token deployed to single chain
export type TvsToken = z.infer<typeof TvsTokenSchema>
export const TvsTokenSchema = z.object({
  mode: z.enum(['auto', 'custom']),
  id: stringAs(TokenId),
  priceId: z.string(),
  symbol: z.string(),
  displaySymbol: z.string().optional(),
  name: z.string(),
  iconUrl: z.string().optional(),
  amount: z.union([CalculationFormulaSchema, AmountFormulaSchema]),
  valueForProject: z
    .union([CalculationFormulaSchema, ValueFormulaSchema])
    .optional(),
  valueForSummary: z
    .union([CalculationFormulaSchema, ValueFormulaSchema])
    .optional(),
  category: z.enum(['ether', 'stablecoin', 'other']),
  source: z.enum(['canonical', 'external', 'native']),
  isAssociated: z.boolean(),
})

export const ProjectTvsConfigSchema = z.object({
  projectId: z.string(),
  tokens: z.array(TvsTokenSchema),
})
