import type { ScalingProjectTechnologyChoice } from '../../../common'
import type { DataAvailabilityLayer as ScalingDaLayerOption } from '../../../common'
import type { DaEconomicSecurity } from '../common/DaEconomicSecurity'
import type { DaEconomicSecurityRisk } from '../common/DaEconomicSecurityRisk'
import type { DaFraudDetectionRisk } from '../common/DaFraudDetectionRisk'
import type { DasErasureCodingProof } from '../common/DasErasureCodingProof'
import type { DasErasureCodingScheme } from '../common/DasErasureCodingScheme'
import type { EthereumDaLayerRisks } from '../common/EthereumDaRisks'
import type {
  EnshrinedBridge,
  IntegratedDacBridge,
  NoDaBridge,
  NoDacBridge,
  OnChainDaBridge,
  StandaloneDacBridge,
} from './DaBridge'
import type { DaLayerThroughput } from './DaLayerThroughput'
import type { DaLinks } from './DaLinks'
import type { DaRiskWithSentiment } from './DaRiskView'
import type { DaTechnology } from './DaTechnology'

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
}

export type EthereumDaLayer = CommonDaLayer & {
  kind: 'EthereumDaLayer'
  bridges: [EnshrinedBridge]
  /** Risks associated with the data availability layer. */
  risks: EthereumDaLayerRisks
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
  otherConsiderations?: ScalingProjectTechnologyChoice[]
}

export type DaLayerRisks = {
  economicSecurity: DaEconomicSecurityRisk
  fraudDetection: DaFraudDetectionRisk
}

interface DaLayerDisplay {
  /** The name of the data availability layer. */
  name: string
  /** Slug of the data availability layer. */
  slug: string
  /** A short description of the data availability layer. */
  description: string
  /** Links related to the data availability layer. */
  links?: DaLinks
}
export type DaConsensusAlgorithm = {
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

type DaAttribute = Omit<DaRiskWithSentiment, 'sentiment'>
export type DaAttributes = Record<string, DaAttribute>

export type DataAvailabilitySampling = {
  /** The erasure coding scheme used by the data availability layer. */
  erasureCodingScheme: DasErasureCodingScheme
  /** The erasure coding proof type used by the data availability layer. */
  erasureCodingProof: DasErasureCodingProof
}
