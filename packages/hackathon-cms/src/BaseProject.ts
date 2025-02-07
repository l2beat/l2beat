type Sentiment = 'bad' | 'warning' | 'good' | 'neutral' | 'UnderReview'

type WarningSentiment = 'bad' | 'warning' | 'neutral'

interface WarningWithSentiment {
  value: string
  sentiment: WarningSentiment
}

interface Milestone {
  title: string
  url: string
  date: string
  description?: string
  type: 'general' | 'incident'
}

type ScalingProjectCapability = 'universal' | 'appchain'

type ScalingProjectCategory =
  | 'Optimistic Rollup'
  | 'ZK Rollup'
  | 'Plasma'
  | 'Validium'
  | 'Optimium'
  | 'Other'

interface ScalingProjectUpgradeability {
  proxyType: string
  immutable?: boolean
  admins: string[]
  implementations: string[]
}

interface ProjectPermissions {
  /** List of roles */
  roles?: ProjectPermission[]
  /** List of actors */
  actors?: ProjectPermission[]
}

interface ProjectPermission {
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

interface ProjectPermissionedAccount {
  name: string
  url: string
  address: string
  isVerified: boolean
  type: 'EOA' | 'Contract'
}

type ScalingProjectStack =
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

type ScalingProjectPurpose =
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

interface ReferenceLink {
  title: string
  url: string
}

interface ScalingProjectRisk {
  /** Category of this risk */
  category: ScalingProjectRiskCategory
  /** Description of the risk. Should form a sentence with the category */
  text: string
  /** If the risk is particularly bad */
  isCritical?: boolean
  /** Ignore tests for formatting */
  _ignoreTextFormatting?: boolean
}

type ScalingProjectRiskCategory =
  | 'Funds can be stolen if'
  | 'Funds can be lost if'
  | 'Funds can be frozen if'
  | 'Funds can lose value if'
  | 'Users can be censored if'
  | 'MEV can be extracted if'
  | 'Withdrawals can be delayed if'

interface TableReadyValue {
  value: string
  secondLine?: string
  description?: string
  sentiment?: Sentiment
  warning?: WarningWithSentiment
  /** Taken into account when sorting. Defaults to 0. */
  orderHint?: number
}

interface ScalingProjectRiskView {
  stateValidation: TableReadyValue
  dataAvailability: TableReadyValue
  exitWindow: TableReadyValue
  sequencerFailure: TableReadyValue
  proposerFailure: TableReadyValue
}

interface ProjectDataAvailability {
  layer: TableReadyValue & { number?: number }
  bridge: TableReadyValue & { number?: number }
  mode: TableReadyValue
}

interface ProjectLivenessInfo {
  explanation?: string
  warnings?: {
    stateUpdates?: string
    batchSubmissions?: string
    proofSubmissions?: string
  }
}

interface Layer2FinalityDisplay {
  /** Warning tooltip content for finality tab for given project */
  warnings?: {
    timeToInclusion?: WarningWithSentiment
    stateUpdateDelay?: WarningWithSentiment
  }
  /** Finalization period displayed in table for given project (time in seconds) */
  finalizationPeriod?: number
}

/**
 * Determines how the state update should be handled.
 * - `analyze`: The state update delay should be analyzed as a part of the update.
 * - `zeroed`: The state update delay should be zeroed, analyzer will not be run.
 * - `disabled`: The state update analyzer will not be run.
 */
type StateUpdateMode = 'analyze' | 'zeroed' | 'disabled'

type Layer2FinalityConfig =
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

      minTimestamp: number
      lag: number
      stateUpdate: StateUpdateMode
    }
  | {
      type: 'OPStack'
      minTimestamp: number
      lag: number
      // https://specs.optimism.io/protocol/holocene/derivation.html#span-batches
      // you can get this values by calling the RPC method optimism_rollupConfig
      // rollup config: curl -X POST -H "Content-Type: application/json" --data \
      // '{"jsonrpc":"2.0","method":"optimism_rollupConfig","params":[],"id":1}'  \
      // <rpc-url> | jq
      genesisTimestamp: number
      l2BlockTimeSeconds: number
      stateUpdate: StateUpdateMode
    }

interface ProofVerification {
  shortDescription?: string
  aggregation: boolean
  verifiers: OnchainVerifier[]
  requiredTools: RequiredTool[]
}

type OnchainVerifier = {
  name: string
  description: string
  contractAddress: string
  number: number
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

interface RequiredTool {
  name: string
  version: string
  link?: string
}

interface SubVerifier {
  name: string
  proofSystem: string
  mainArithmetization: string
  mainPCS: string
  trustedSetup?: string
  link?: string
}

interface BridgeDisplay {
  name: string
  shortName?: string
  slug: string
  warning?: string
  description: string
  detailedDescription?: string
  category: 'Token Bridge' | 'Liquidity Network' | 'Hybrid'
  links: ProjectLinks
  architectureImage?: string
}

interface BridgeRiskView {
  validatedBy: TableReadyValue
  sourceUpgradeability?: TableReadyValue
  destinationToken?: TableReadyValue
}

interface DaLayer {
  name?: string
  description?: string
  type: string
  systemCategory: 'public' | 'custom'
  risks: DaLayerRisks
  technology: DaTechnology
  usedWithoutBridgeIn: UsedInProject[]

  /** The period within which full nodes must store and distribute data. @unit seconds */
  pruningWindow?: number
  /** The time it takes to finalize the data. @unit seconds */
  finality?: number
  consensusAlgorithm?: DaConsensusAlgorithm
  throughput?: DaLayerThroughput
  dataAvailabilitySampling?: DataAvailabilitySampling
  economicSecurity?: DaEconomicSecurity
  daTracking?: DaLayerTrackingConfig
}

interface DaLayerRisks {
  daLayer?: TableReadyValue
  economicSecurity?: TableReadyValue
  fraudDetection?: TableReadyValue
}

interface DaBridgeRisks {
  isNoBridge?: boolean
  /** Replaces risk grissini */
  callout?: string
  daBridge?: TableReadyValue
  committeeSecurity?: TableReadyValue
  upgradeability?: TableReadyValue
  relayerFailure?: TableReadyValue
}

interface DaConsensusAlgorithm {
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

interface DataAvailabilitySampling {
  erasureCodingScheme: '1D Reed-Solomon' | '2D Reed-Solomon'
  erasureCodingProof: 'Validity proofs' | 'Fraud proofs' | 'None'
}

interface DaLayerThroughput {
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

interface DaTechnology {
  /** Description of technology used by the data availability layer. [MARKDOWN] */
  description: string
  /** List of risks associated with the technology */
  risks?: ScalingProjectRisk[] // scaling risks on purpose

  /** List of references put underneath the technology section */
  references?: ReferenceLink[]
}

interface DaBridge {
  id: number
  /** Date of creation of the file (not the project) */
  addedAt: number
  display: DaBridgeDisplay
  isUnderReview?: boolean
  technology: DaTechnology
  usedIn: UsedInProject[]
  risks: DaBridgeRisks
  dac?: DacInfo
  /** Data about related permissions - preferably from discovery. */
  permissions?: Record<string, ProjectPermissions>
  /** Data about the contracts used in the bridge - preferably from discovery. */
  contracts?: ProjectContracts
}

interface DacInfo {
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

interface DaBridgeDisplay {
  name: string
  slug: string
  description: string
}

interface UsedInProject {
  id: number
  name: string
  slug: string
}

interface DaEconomicSecurity {
  name: string
  token: {
    symbol: string
    decimals: number
    coingeckoId: string
  }
}
// General da-layer tracking

type DaLayerTrackingConfig = 'ethereum' | 'celestia' | 'avail'
// Per-project da-layer tracking

type Stage = 'Stage 0' | 'Stage 1' | 'Stage 2'

interface StageSummary {
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

interface MissingStageDetails {
  nextStage: Stage
  principle: string | undefined
  requirements: string[]
}

type StageConfig = StageNotApplicable | StageUnderReview | StageConfigured

interface StageDowngrade {
  expiresAt: number
  reason: string
  toStage: Stage
}

interface StageConfigured {
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

interface StageConfiguredMessage {
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
  id: string
  slug: string
  name: string
  /** Used in place of name in tables to save space. */
  shortName: string | undefined
  addedAt: number
  // data
  badges?: string[]
  statuses?: ProjectStatuses
  display?: ProjectDisplay
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
  daLayer?: DaLayer
  daBridges?: DaBridge[]
  milestones?: Milestone[]
  contracts?: ProjectContracts
  permissions?: Record<string, ProjectPermission>
  // tags
  isBridge?: true
  isScaling?: true
  isZkCatalog?: true
  isDaLayer?: true
  isUpcoming?: true
  isArchived?: true
  hasActivity?: true
}

interface ProjectContract {
  /** Address of the contract */
  address: string
  /** Verification status of the contract */
  isVerified: boolean
  /** Name of the chain of this address. Optional for backwards compatibility */
  chain: string
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

interface ProjectContracts {
  /** List of the contracts on a given chain */
  addresses: Record<string, ProjectContract[]>
  /** List of risks associated with the contracts */
  risks: ScalingProjectRisk[]
}

interface ProjectStatuses {
  yellowWarning: string | undefined
  redWarning: string | undefined
  isUnderReview: boolean
  isUnverified: boolean
}

interface ProjectDisplay {
  description: string
  links: ProjectLinks
}

interface ProjectLinks {
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

interface ProjectBridgeInfo {
  category: BridgeDisplay['category']
  destination: string[]
  validatedBy: string
}

interface ProjectScalingInfo {
  layer: 'layer2' | 'layer3'
  type: ScalingProjectCategory
  capability: ScalingProjectCapability
  /** In the future this will be reflected as `type === 'Other'` */
  isOther: boolean
  hostChain: {
    id: number
    slug: string
    name: string
    shortName: string | undefined
  }
  stack: ScalingProjectStack | undefined
  raas: string | undefined
  daLayer: string
  stage: ScalingProjectStage
  purposes: ScalingProjectPurpose[]
}

type ScalingProjectStage =
  | 'Not applicable'
  | 'Under review'
  | 'Stage 0'
  | 'Stage 1'
  | 'Stage 2'

interface ProjectScalingRisks {
  self: ScalingProjectRiskView
  host: ScalingProjectRiskView | undefined
  stacked: ScalingProjectRiskView | undefined
}

interface ProjectTvlInfo {
  associatedTokens: string[]
  warnings: WarningWithSentiment[]
}

interface ProjectCostsInfo {
  warning?: WarningWithSentiment
}
