import type { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type {
  Milestone,
  ProjectTechnologyChoice,
  ReferenceLink,
  DataAvailabilityLayer as ScalingDaLayerOption,
  ScalingProjectContract,
  ScalingProjectLinks,
  ScalingProjectPermission,
  ScalingProjectRisk,
  Sentiment,
} from '../../types'

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
  fallback?: ScalingDaLayerOption
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
