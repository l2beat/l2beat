import type { ScalingProjectTechnologyChoice } from '../../../common'
import type { DataAvailabilityLayer as ScalingDaLayerOption } from '../../../common'
import type {
  DacBridge,
  EnshrinedBridge,
  NoDaBridge,
  OnChainDaBridge,
} from './DaBridge'
import type { DaChallengeMechanism } from './DaChallengeMechanism'
import type { DaConsensusAlgorithm } from './DaConsensusAlgorithm'
import type { DaEconomicSecurity } from './DaEconomicSecurity'
import type { DaEconomicSecurityRisk } from './DaEconomicSecurityRisk'
import type { DaFraudDetectionRisk } from './DaFraudDetectionRisk'
import type { DaLayerThroughput } from './DaLayerThroughput'
import type { DaLinks } from './DaLinks'
import type { DaTechnology } from './DaTechnology'
import type { DataAvailabilitySampling } from './DataAvailabilitySampling'
import type { EthereumDaLayerRisks } from './EthereumDaRisks'

export type DaLayer = BlockchainDaLayer | DacDaLayer | EthereumDaLayer

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

export type DacDaLayer = CommonDaLayer & {
  kind: 'DAC' | 'DA Service' | 'No DAC'
  bridges: (DacBridge | NoDaBridge)[]
  /** Risks associated with the data availability layer. */
  risks: DaLayerRisks
}

export type CommonDaLayer = {
  type: 'DaLayer'
  /** Unique identifier of the data availability layer. */
  id: string
  /** Classification layers will be split based on */
  systemCategory: 'public' | 'custom'
  /** Supported challenge mechanism in place */
  challengeMechanism?: DaChallengeMechanism
  /** Fallback */
  fallback?: ScalingDaLayerOption
  /** Number of operators in the data availability layer. */
  numberOfOperators?: number
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
  /** Slug of the data availability bridge. */
  slug: string
  /** A short description of the data availability layer. */
  description: string
  /** Links related to the data availability layer. */
  links: DaLinks
}