import { ScalingProjectTechnologyChoice } from '../../../../common'
import { DataAvailabilityLayer as ScalingDaLayerOption } from '../../../../common'
import {
  EnshrinedBridge,
  IntegratedDacBridge,
  NoDaBridge,
  OnChainDaBridge,
  StandaloneDacBridge,
} from './DaBridge'
import { DaChallengeMechanism } from './DaChallengeMechanism'
import { DaConsensusAlgorithm } from './DaConsensusAlgorithm'
import { DaEconomicSecurity } from './DaEconomicSecurity'
import { DaEconomicSecurityRisk } from './DaEconomicSecurityRisk'
import { DaFraudDetectionRisk } from './DaFraudDetectionRisk'
import { DaLayerThroughput } from './DaLayerThroughput'
import { DaLinks } from './DaLinks'
import { DaTechnology } from './DaTechnology'
import { DataAvailabilitySampling } from './DataAvailabilitySampling'
import { EthereumDaLayerRisks } from './EthereumDaRisks'

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
  name: string
  kind: 'DAC' | 'No DAC'
  bridge: IntegratedDacBridge | NoDaBridge
  /** Risks associated with the data availability layer. */
  risks: DaLayerRisks
  /** Fallback */
  fallback?: ScalingDaLayerOption
  /** Supported challenge mechanism in place */
  challengeMechanism?: DaChallengeMechanism
  /** Number of operators in the data availability layer. */
  numberOfOperators?: number
}

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
  /** Slug of the data availability bridge. */
  slug: string
  /** A short description of the data availability layer. */
  description: string
  /** Links related to the data availability layer. */
  links?: DaLinks
}
