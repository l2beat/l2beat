import type {
  ChainId,
  EthereumAddress,
  ProjectId,
  StringWithAutocomplete,
  TrackedTxsConfigSubtype,
  TrackedTxsConfigType,
  UnixTime,
} from '@l2beat/shared-pure'
import type { PROJECT_COUNTDOWNS, REASON_FOR_BEING_OTHER } from './common'
import type { BadgeId } from './projects/badges'

export type Sentiment = 'bad' | 'warning' | 'good' | 'neutral' | 'UnderReview'

export type WarningSentiment = 'bad' | 'warning' | 'neutral'
export interface WarningValueWithSentiment {
  value: string
  sentiment: WarningSentiment
}

export type ProjectCountdowns = typeof PROJECT_COUNTDOWNS
export type ReasonForBeingInOther =
  (typeof REASON_FOR_BEING_OTHER)[keyof typeof REASON_FOR_BEING_OTHER]

export interface MulticallContractConfig {
  address: EthereumAddress
  sinceBlock: number
  batchSize: number
  version: '1' | '2' | '3' | 'optimism'
  isNativeBalanceSupported?: boolean
}

export interface ChainConfig {
  /**
   * A lowercase a-z0-9 name of the chain. Used for uniquely identifying the
   * chain in configuration.
   */
  name: string
  chainId: number
  explorerUrl?: string
  explorerApi?: {
    url: string
    type: 'etherscan' | 'blockscout'
    missingFeatures?: {
      getContractCreation?: boolean
    }
  }
  blockscoutV2ApiUrl?: string
  /**
   * Setting this value for a chain does not always equal to grabbing the
   * timestamp of the first block. For example Optimism had block 0 on
   * January 2021 but the block 1 on November 2021.
   */
  minTimestampForTvl?: UnixTime
  multicallContracts?: MulticallContractConfig[]
  coingeckoPlatform?: string
}

export interface KnowledgeNugget {
  title: string
  url: string
  thumbnail?: string
}

export interface Milestone {
  title: string
  url: string
  date: string
  description?: string
  type: 'general' | 'incident'
}

/** Base interface for Layer2s and Layer3s. The hope is that Layer2 and Layer3 will dissapear and only this will remain. */
export interface ScalingProject {
  /** Unique, readable id, will be used in DB. DO NOT EDIT THIS PROPERTY */
  id: ProjectId
  capability: ScalingProjectCapability
  /** Date of creation of the file (not the project) */
  addedAt: UnixTime
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
  /** Reasons why the scaling project is included in the other categories. If defined - project will be displayed as other */
  reasonsForBeingOther?: ReasonForBeingInOther[]
}

export type ScalingProjectCapability = 'universal' | 'appchain'

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
  /** List of contracts in which L1 funds are locked */
  escrows: ProjectEscrow[]
  /** API parameters used to get transaction count */
  transactionApi?: TransactionApiConfig
  /** Data availability tracking config */
  daTracking?: ProjectDaTrackingConfig
}

export interface ScalingProjectContracts {
  /** List of the contracts on hosted chain */
  addresses: ScalingProjectContract[]
  /** List of risks associated with the contracts */
  risks: ScalingProjectRisk[]
  /** List of the contracts on the chain itself */
  nativeAddresses?: Record<string, ScalingProjectContract[]>
  /** List of references backing up the claim */
  references?: ReferenceLink[]
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
  references?: ReferenceLink[]
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

export interface DataAvailabilityMode {
  value: string
  secondLine?: string
}

export interface DataAvailabilityLayer {
  value: string
  sentiment: Sentiment
  secondLine?: string
  description: string
  fallbackDescription?: string
}

export interface DataAvailabilityBridge {
  value: string
  description: string
  sentiment: Sentiment
}

export type ScalingProjectDisplay = {
  /** Name of the scaling project, will be used as a display name on the website */
  name: string
  /** Short name of the scaling project, will be used in some places on the website as a display name */
  shortName?: string
  /** Url friendly scaling project name, will be used in website urls */
  slug: string
  /** Name of the category the scaling project belongs to */
  category: ScalingProjectCategory
  /** Technological stack */
  stack?: ScalingProjectStack
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
  /** Name of the architecture image to show in the contract section if present, otherwise use slug */
  architectureImage?: string
  /** Name of the state validation image to show in the state validation section if present, otherwise use slug */
  stateValidationImage?: string
  /** Name of the upgrades and governance image to show in the upgrades and governance section if present, otherwise use slug */
  upgradesAndGovernanceImage?: string
}

export interface ProjectEscrow {
  chain: string
  /** Address of the escrow. Use etherscan to verify its correctness. */
  address: EthereumAddress
  /** Should use name of the contract for escrow name */
  useContractName?: boolean
  /** All the data about the escrow contract */
  contract?: Omit<ScalingProjectContract, 'address'>
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
  references?: ReferenceLink[]
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

export interface ReferenceLink {
  title: string
  url: string
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

export interface ScalingProjectRiskViewEntry {
  value: string
  description: string
  secondLine?: string // second line in risk view
  sentiment: Sentiment
  warning?: WarningValueWithSentiment
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
  references?: ReferenceLink[]
}

export interface ScalingProjectStateValidation {
  description: string
  categories: ScalingProjectStateValidationCategory[]
  proofVerification?: ProofVerification
}

export interface ScalingProjectTechnology {
  /** What state correctness mechanism is used in the project */
  stateCorrectness?: ProjectTechnologyChoice
  /** What is the new cryptography used in the project */
  newCryptography?: ProjectTechnologyChoice
  /** What is the data availability choice for the project */
  dataAvailability?: ProjectTechnologyChoice
  /** What are the details about project operator(s) */
  operator?: ProjectTechnologyChoice
  /** What are the details about force transactions (censorship resistance) */
  forceTransactions?: ProjectTechnologyChoice
  /** A description of the available exit mechanisms */
  exitMechanisms?: ProjectTechnologyChoice[]
  /** What is solution to the mass exit problem */
  massExit?: ProjectTechnologyChoice
  /** Other considerations */
  otherConsiderations?: ProjectTechnologyChoice[]
  /** Is the technology section under review */
  isUnderReview?: boolean
}

export interface ProjectTechnologyChoice {
  /** Name of the specific technology choice */
  name: string
  /** Description of the specific technology choice. Null means missing information */
  description: string
  /** List of references backing up the claim */
  references: ReferenceLink[]
  /** List of risks associated with the technology choice */
  risks: ScalingProjectRisk[]
  /** The description and research is incomplete */
  isIncomplete?: boolean
  /** The description and research is under review */
  isUnderReview?: boolean
}

export type TransactionApiConfig =
  | RpcTransactionApi
  | StarkexTransactionApi
  | CustomTransactionApi<'starknet'>
  | CustomTransactionApi<'zksync'>
  | CustomTransactionApi<'loopring'>
  | CustomTransactionApi<'degate3'>
  | CustomTransactionApi<'fuel'>

export interface RpcTransactionApi {
  type: 'rpc'
  defaultUrl: string
  defaultCallsPerMinute?: number
  adjustCount?: AdjustCount
  startBlock?: number
}

export type AdjustCount =
  | { type: 'SubtractOne' }
  | { type: 'SubtractOneSinceBlock'; blockNumber: number }

export interface StarkexTransactionApi {
  type: 'starkex'
  product: string[]
  sinceTimestamp: UnixTime
  resyncLastDays?: number
}

export interface CustomTransactionApi<T extends string> {
  type: T
  defaultUrl: string
  defaultCallsPerMinute?: number
}

export interface ProjectDataAvailability {
  layer: DataAvailabilityLayer
  bridge: DataAvailabilityBridge
  mode: DataAvailabilityMode
}

export interface Layer2 extends ScalingProject {
  type: 'layer2'
  display: Layer2Display
  config: Layer2Config
  /** Upgrades and governance explained */
  upgradesAndGovernance?: string
}

export interface Layer2Display extends ScalingProjectDisplay {
  /** Tooltip contents for liveness tab for given project */
  liveness?: ProjectLivenessInfo
  finality?: Layer2FinalityDisplay
  /** Warning for Costs */
  costsWarning?: WarningWithSentiment
}

export interface ProjectLivenessInfo {
  explanation?: string
  warnings?: {
    stateUpdates?: string
    batchSubmissions?: string
    proofSubmissions?: string
  }
}

export interface Layer2FinalityDisplay {
  /** Warning tooltip content for finality tab for given project */
  warnings?: {
    timeToInclusion?: WarningValueWithSentiment
    stateUpdateDelay?: WarningValueWithSentiment
  }
  /** Finalization period displayed in table for given project (time in seconds) */
  finalizationPeriod?: number
}

export interface Layer2Config extends ScalingProjectConfig {
  /** List of transactions that are tracked by our backend */
  trackedTxs?: Layer2TxConfig[]
  /** Configuration for getting liveness data */
  liveness?: Layer2LivenessConfig
  /** Configuration for getting finality data */
  finality?: Layer2FinalityConfig
}

export interface WarningWithSentiment {
  /** Content of the warning */
  content: string
  /** Color with which the warning should be displayed */
  sentiment: Extract<Sentiment, 'bad' | 'warning' | 'neutral'>
}

export type Layer2TxConfig = {
  uses: Layer2TrackedTxUse[]
  query: TrackedTxQuery
  _hackCostMultiplier?: number
}

export type Layer2TrackedTxUse = {
  type: TrackedTxsConfigType
  subtype: TrackedTxsConfigSubtype
}

type TrackedTxQuery = FunctionCall | Transfer | SharpSubmission | SharedBridge

interface FunctionCall {
  formula: 'functionCall'
  address: EthereumAddress
  selector: `0x${string}`
  functionSignature: `function ${string}`
  /** Inclusive */
  sinceTimestamp: UnixTime
  /** Inclusive */
  untilTimestamp?: UnixTime
}

interface Transfer {
  formula: 'transfer'
  from: EthereumAddress
  to: EthereumAddress
  /** Inclusive */
  sinceTimestamp: UnixTime
  /** Inclusive */
  untilTimestamp?: UnixTime
}

interface SharpSubmission {
  formula: 'sharpSubmission'
  programHashes: string[]
  /** Inclusive */
  sinceTimestamp: UnixTime
  /** Inclusive */
  untilTimestamp?: UnixTime
}

interface SharedBridge {
  formula: 'sharedBridge'
  chainId: number
  address: EthereumAddress
  selector: `0x${string}`
  functionSignature: `function ${string}`
  /** Inclusive */
  sinceTimestamp: UnixTime
  /** Inclusive */
  untilTimestamp?: UnixTime
}

export interface Layer2LivenessConfig {
  duplicateData: {
    from: TrackedTxsConfigSubtype
    to: TrackedTxsConfigSubtype
  }
}

/**
 * Determines how the state update should be handled.
 * - `analyze`: The state update delay should be analyzed as a part of the update.
 * - `zeroed`: The state update delay should be zeroed, analyzer will not be run.
 * - `disabled`: The state update analyzer will not be run.
 */
export type StateUpdateMode = 'analyze' | 'zeroed' | 'disabled'

export type Layer2FinalityConfig =
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

export type FinalityType = Layer2FinalityConfig['type']

export interface ProofVerification {
  shortDescription?: string
  aggregation: boolean
  verifiers: OnchainVerifier[]
  requiredTools: RequiredTool[]
}

export type OnchainVerifier = {
  name: string
  description: string
  contractAddress: EthereumAddress
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

export interface RequiredTool {
  name: string
  version: string
  link?: string
}

export interface SubVerifier {
  name: string
  proofSystem: string
  mainArithmetization: string
  mainPCS: string
  trustedSetup?: StringWithAutocomplete<'None'>
  link?: string
}

export interface Layer3 extends ScalingProject {
  type: 'layer3'
  /** ProjectId of hostChain */
  hostChain: ProjectId
  /** Stacked risk view values for this layer3 and it's base chain */
  stackedRiskView: ScalingProjectRiskView
}

export interface Bridge {
  type: 'bridge'
  id: ProjectId
  /** Date of creation of the file (not the project) */
  addedAt: UnixTime
  isArchived?: boolean
  isUpcoming?: boolean
  isUnderReview?: boolean
  display: BridgeDisplay
  config: BridgeConfig
  riskView: BridgeRiskView
  technology: BridgeTechnology
  contracts?: ScalingProjectContracts
  permissions?: ScalingProjectPermission[] | 'UnderReview'
  nativePermissions?: Record<string, ScalingProjectPermission[]> | 'UnderReview'
  milestones?: Milestone[]
  knowledgeNuggets?: KnowledgeNugget[]
}

export interface BridgeDisplay {
  name: string
  shortName?: string
  slug: string
  warning?: string
  description: string
  detailedDescription?: string
  category: 'Token Bridge' | 'Liquidity Network' | 'Hybrid'
  links: Partial<ScalingProjectLinks>
  architectureImage?: string
}

export interface BridgeConfig {
  associatedTokens?: string[]
  escrows: ProjectEscrow[]
}

export interface BridgeRiskView {
  validatedBy: ScalingProjectRiskViewEntry
  sourceUpgradeability?: ScalingProjectRiskViewEntry
  destinationToken?: ScalingProjectRiskViewEntry
}

export interface BridgeTechnology {
  canonical?: boolean
  destination: string[]
  principleOfOperation?: ProjectTechnologyChoice
  validation?: ProjectTechnologyChoice
  destinationToken?: ProjectTechnologyChoice
  isUnderReview?: boolean
}
export type DaLayer = BlockchainDaLayer | EthereumDaLayer | DaServiceDaLayer

export type BlockchainDaLayer = CommonDaLayer & {
  kind: 'PublicBlockchain'
  bridges: (OnChainDaBridge | NoDaBridge)[]
  /** Risks associated with the data availability layer. */
  risks: DaLayerRisks
  /** The period within which full nodes must store and distribute data. @unit seconds */
  pruningWindow: number
  /** The consensus algorithm used by the data availability layer. */
  consensusAlgorithm: DaConsensusAlgorithm
  /** Details about data availability throughput. */
  throughput?: DaLayerThroughput
  /** Details about data availability sampling. */
  dataAvailabilitySampling?: DataAvailabilitySampling
  /** Economic security configuration. */
  economicSecurity?: DaEconomicSecurity
  /** Data availability tracking config */
  daTracking?: DaLayerTrackingConfig
}

export type EthereumDaLayer = CommonDaLayer & {
  kind: 'EthereumDaLayer'
  bridges: [EnshrinedBridge]
  /** Risks associated with the data availability layer. */
  risks: DaRisk
  /** The period within which full nodes must store and distribute data. @unit seconds */
  pruningWindow: number
  /** The consensus algorithm used by the data availability layer. */
  consensusAlgorithm: DaConsensusAlgorithm
  /** Details about data availability throughput. */
  throughput?: DaLayerThroughput
  /** Economic security configuration. */
  economicSecurity?: DaEconomicSecurity
}

export type DacDaLayer = Omit<CommonDaLayer, 'id' | 'display'> & {
  display?: {
    // Rest will be linked dynamically from scaling
    description?: string
    name?: string
  }
  kind: 'DAC' | 'No DAC'
  bridge: IntegratedDacBridge | NoDacBridge
  /** Risks associated with the data availability layer. */
  risks: DaLayerRisks
  /** Fallback */
  fallback?: DataAvailabilityLayer
  /** Supported challenge mechanism in place */
  challengeMechanism: DaChallengeMechanism
  /** Number of operators in the data availability layer. */
  numberOfOperators?: number
}

export type DaChallengeMechanism = 'DA Challenges' | 'None'

export type DaServiceDaLayer = CommonDaLayer & {
  kind: 'DA Service'
  bridges: (StandaloneDacBridge | NoDaBridge)[]
  /** Risks associated with the data availability layer. */
  risks: DaLayerRisks
}

export type CommonDaLayer = {
  type: 'DaLayer'
  /** Unique identifier of the data availability layer. */
  id: string
  /** Classification layers will be split based on */
  systemCategory: 'public' | 'custom'
  /** Display information for the data availability layer. */
  display: DaLayerDisplay
  /** Is the DA layer upcoming? */
  isUpcoming?: boolean
  /** Is the DA layer under review? */
  isUnderReview?: boolean
  /** The technology used by the data availability layer. */
  technology: DaTechnology
  /** Other considerations */
  otherConsiderations?: ProjectTechnologyChoice[]
  /** Links to recent developments, milestones achieved by the project */
  milestones?: Milestone[]
}

export interface DaLayerRisks {
  economicSecurity: DaRisk
  fraudDetection: DaRisk
}

export interface DaLayerDisplay {
  /** The name of the data availability layer. */
  name: string
  /** Slug of the data availability layer. */
  slug: string
  /** A short description of the data availability layer. */
  description: string
  /** Links related to the data availability layer. */
  links?: DaLinks
}

export interface DaConsensusAlgorithm {
  /** The name of the consensus algorithm. */
  name: string
  /** A description of the consensus algorithm. */
  description: string
  /** The time it takes to produce a new block. @unit seconds. */
  blockTime: number
  /** Consensus finality time. @unit seconds. */
  consensusFinality: number
  /** Duration of time for unbonding in seconds. Intended to capture the weak subjectivity period. @unit seconds. */
  unbondingPeriod: number
}

export interface DataAvailabilitySampling {
  erasureCodingScheme: '1D Reed-Solomon' | '2D Reed-Solomon'
  erasureCodingProof: 'Validity proofs' | 'Fraud proofs' | 'None'
}

export interface DaLayerThroughput {
  /**
   * Batch size for data availability. Together with batchFrequency it determines max throughput.
   * @unit KB - kilobytes
   */
  size: number
  /**
   * Batch frequency for data availability. Together with batchSize it determines max throughput.
   * @unit seconds
   */
  frequency: number
}

export interface DaLinks extends Omit<ScalingProjectLinks, 'rollupCodes'> {}

export interface DaTechnology {
  /** Description of technology used by the data availability layer. [MARKDOWN] */
  description: string
  /** List of risks associated with the technology */
  risks?: ScalingProjectRisk[] // scaling risks on purpose

  /** List of references put underneath the technology section */
  references?: ReferenceLink[]
}

export type DaBridge =
  | NoDaBridge
  | OnChainDaBridge
  | StandaloneDacBridge
  | EnshrinedBridge

export type NoDaBridge = CommonDaBridge & {
  type: 'NoBridge'
  /** Risks related to given data availability bridge. */
  risks: DaBridgeRisks
}

export type NoDacBridge = Omit<CommonDaBridge, 'id' | 'display' | 'usedIn'> & {
  type: 'NoDacBridge'
  /** Risks related to given data availability bridge. */
  risks: DaBridgeRisks
}

export type EnshrinedBridge = CommonDaBridge & {
  type: 'Enshrined'
  risks: DaRisk
  callout: string
}

export type OnChainDaBridge = CommonDaBridge & {
  type: 'OnChainBridge'
  /** Data about related permissions - preferably from discovery. */
  permissions: Record<string, ScalingProjectPermission[]> | 'UnderReview'
  /** Data about the validation type of the bridge */
  validation: {
    type: string
  }
  /** Data about the contracts used in the bridge - preferably from discovery. */
  contracts: DaBridgeContracts
  /** Risks related to given data availability bridge. */
  risks: DaBridgeRisks
}
type CommonDacBridge = {
  /**  Total members count.  */
  membersCount: number
  /** Data about the DAC members. */
  knownMembers?: {
    external: boolean
    name: string
    href: string
    key?: string
  }[]
  /** Minimum number of members required to sign and attest the data. */
  requiredMembers: number
  /** TEMP: Members field will turn into N/A badge if this is true */
  hideMembers?: boolean
  /** The type of data. */
  transactionDataType: DacTransactionDataType
  /** Risks related to given data availability bridge. */
  risks: DaBridgeRisks
}

export type DacTransactionDataType =
  | 'Transaction data (compressed)'
  | 'Transaction data'
  | 'State diffs (compressed)'
  | 'State diffs'
// Used in DacDaLayers integrated into projects

export type IntegratedDacBridge = Omit<
  CommonDaBridge,
  'id' | 'display' | 'usedIn'
> &
  CommonDacBridge & {
    type: 'IntegratedDacBridge'
  }
// Used in DaServices

export type StandaloneDacBridge = CommonDaBridge &
  CommonDacBridge & {
    type: 'StandaloneDacBridge'
    /**
     * Data about related permissions - preferably from discovery.
     * It makes less sense to have permissions for NoBridge, but it's here in case we need to
     * add some complementary information.
     */
    permissions: Record<string, ScalingProjectPermission[]> | 'UnderReview'
    /**
     * Data about the contracts used in the bridge - preferably from discovery.
     * It makes less sense to have contracts for NoBridge, but it's here in case we need to
     * add some complementary information.
     */
    contracts: DaBridgeContracts
  }
type CommonDaBridge = {
  /** Unique identifier of the data availability bridge. */
  id: string
  /** Date of creation of the file (not the project) */
  addedAt: UnixTime
  display: DaBridgeDisplay
  /** Is the DA bridge under review? */
  isUnderReview?: boolean
  /** Description of technology used by the data availability bridge. */
  technology: DaTechnology
  /** List of projects given bridge is being used in. */
  usedIn: UsedInProject[]
  /** Other considerations */
  otherConsiderations?: ProjectTechnologyChoice[]
}
interface DaBridgeDisplay {
  /** The name of the data availability bridge. */
  name: string
  /** Slug of the data availability bridge. */
  slug: string
  /** Description of the data availability bridge. */
  description: string
  /** A warning displayed on the table and project page */
  warning?: string
  /** Project raw with red warning will turn into red, and there will be red warning icon with this message */
  redWarning?: string
  /** Links related to the data availability bridge. */
  links: DaLinks
}

export interface DaBridgeRisks {
  committeeSecurity: DaRisk
  upgradeability: DaRisk
  relayerFailure: DaRisk
}

export interface DaBridgeContracts {
  /** List of risks associated with the contracts */
  risks: ScalingProjectRisk[]
  /** List of the contracts on each chain */
  addresses: Record<string, ScalingProjectContract[]>
  /** List of references backing up the claim */
  references?: ReferenceLink[]
  /** The description and research is incomplete */
  isIncomplete?: boolean
  /** The description and research is under review */
  isUnderReview?: boolean
}

export interface DaRisk {
  type: string
  value: string
  sentiment: Sentiment
  description: string
  secondLine?: string
}

export interface UsedInProject {
  id: ProjectId
  name: string
  slug: string
}

export interface DaEconomicSecurity {
  name: string
  token: {
    symbol: string
    decimals: number
    coingeckoId: string
  }
}
// General da-layer tracking

export type DaLayerTrackingConfig = 'ethereum' | 'celestia' | 'avail'
// Per-project da-layer tracking

export interface EthereumDaTrackingConfig {
  type: 'ethereum'
  inbox: string
  sequencers?: string[]
}

export interface CelestiaDaTrackingConfig {
  type: 'celestia'
  namespace: string
  signers?: string[]
}

export interface AvailDaTrackingConfig {
  type: 'avail'
  appId: string
}

export type ProjectDaTrackingConfig =
  | EthereumDaTrackingConfig
  | CelestiaDaTrackingConfig
  | AvailDaTrackingConfig

export type StageBlueprint = Record<
  string,
  {
    name: Stage
    items: Record<
      string,
      {
        positive: string
        negative: string
        negativeMessage?: string
        underReviewMessage?: string
      }
    >
  }
>

export type Satisfied = boolean | 'UnderReview'

export type ChecklistValue = Satisfied | null | [Satisfied, string]

export type ChecklistTemplate<T extends StageBlueprint> = {
  [K in keyof T]: {
    [L in keyof T[K]['items']]: ChecklistValue
  }
}

export type Stage = 'Stage 0' | 'Stage 1' | 'Stage 2'

export interface StageSummary {
  stage: Stage
  requirements: {
    satisfied: Satisfied
    description: string
  }[]
}

export interface MissingStageRequirements {
  nextStage: Stage
  requirements: string[]
}

export type StageConfig =
  | StageNotApplicable
  | StageUnderReview
  | StageConfigured
export type UsableStageConfig = StageUnderReview | StageConfigured

export interface StageConfigured {
  stage: Stage
  missing?: MissingStageRequirements
  message: StageConfiguredMessage | undefined
  summary: StageSummary[]
  notice?: string
}

export interface StageConfiguredMessage {
  type: 'underReview' | 'warning' | undefined
  text: string
}

interface StageUnderReview {
  stage: 'UnderReview'
}

interface StageNotApplicable {
  stage: 'NotApplicable'
}

export interface BaseProject {
  id: ProjectId
  slug: string
  name: string
  shortName: string | undefined
  addedAt: UnixTime
  // data
  statuses?: ProjectStatuses
  bridgeInfo?: ProjectBridgeInfo
  bridgeRisks?: BridgeRiskView
  scalingInfo?: ProjectScalingInfo
  scalingStage?: StageConfig | undefined
  scalingRisks?: ProjectScalingRisks
  scalingDa?: ProjectDataAvailability
  tvlInfo?: ProjectTvlInfo
  // tvlConfig
  /** Display information for the liveness feature. If present liveness is enabled for this project. */
  livenessInfo?: ProjectLivenessInfo
  /** Display information for the costs feature. If present costs is enabled for this project. */
  costsInfo?: ProjectCostsInfo
  // trackedTxsConfig
  /** Configuration for the finality feature. If present finality is enabled for this project. */
  finalityInfo?: Layer2FinalityDisplay
  /** Configuration for the finality feature. If present finality is enabled for this project. */
  finalityConfig?: Layer2FinalityConfig
  proofVerification?: ProofVerification
  daBridges?: (
    | OnChainDaBridge
    | EnshrinedBridge
    | NoDaBridge
    | StandaloneDacBridge
  )[]
  countdowns?: ProjectCountdowns
  // tags
  isBridge?: true
  isScaling?: true
  isZkCatalog?: true
  isDaLayer?: true
  isUpcoming?: true
  isArchived?: true
  hasActivity?: true
}

export interface ProjectStatuses {
  yellowWarning: string | undefined
  redWarning: string | undefined
  isUnderReview: boolean
  isUnverified: boolean
  // countdowns
  otherMigration?: {
    expiresAt: number
    pretendingToBe: ScalingProjectCategory
    reasons: ReasonForBeingInOther[]
  }
}

export interface ProjectBridgeInfo {
  category: BridgeDisplay['category']
  destination: string[]
  validatedBy: string
}

export interface ProjectScalingInfo {
  layer: 'layer2' | 'layer3'
  type: ScalingProjectCategory
  /** In the future this will be reflected as `type === 'Other'` */
  isOther: boolean
  reasonsForBeingOther: ReasonForBeingInOther[] | undefined
  hostChain: {
    id: ProjectId
    slug: string
    name: string
    shortName: string | undefined
  }
  stack: ScalingProjectStack | undefined
  raas: string | undefined
  daLayer: string
  stage: ScalingProjectStage
  purposes: string[]
}

export type ScalingProjectStage =
  | 'Not applicable'
  | 'Under review'
  | 'Stage 0'
  | 'Stage 1'
  | 'Stage 2'

export interface ProjectScalingRisks {
  self: ScalingProjectRiskView
  host: ScalingProjectRiskView | undefined
  stacked: ScalingProjectRiskView | undefined
}

export interface ProjectTvlInfo {
  associatedTokens: string[]
  warnings: WarningWithSentiment[]
}

export interface ProjectCostsInfo {
  warning?: WarningWithSentiment
}
