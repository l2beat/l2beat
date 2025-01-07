import { ScalingProjectTechnologyChoice } from '../../../../common'
import { DataAvailabilityLayer as ScalingDaLayerOption } from '../../../../common'
import {
  DacBridge,
  EnshrinedBridge,
  NoDaBridge,
  OnChainDaBridge,
} from './DaBridge'
import { DaChallengeMechanism } from './DaChallengeMechanism'
import { DaConsensusAlgorithm } from './DaConsensusAlgorithm'
import { DaEconomicSecurity } from './DaEconomicSecurity'
import { DaEconomicSecurityRisk } from './DaEconomicSecurityRisk'
import { DaFraudDetectionRisk } from './DaFraudDetectionRisk'
import { DaLinks } from './DaLinks'
import { DaTechnology } from './DaTechnology'
import { DataAvailabilitySampling } from './DataAvailabilitySampling'
import { EthereumDaLayerRisks } from './EthereumDaRisks'

export type DaLayer = BlockchainDaLayer | DacDaLayer | EthereumDaLayer

export type BlockchainDaLayer = CommonDaLayer & {
  kind: 'PublicBlockchain'
  bridges: (OnChainDaBridge | NoDaBridge)[]
  /** The period within which full nodes must store and distribute data. @unit seconds */
  pruningWindow: number
  /**
   * Space available for data availability.
   * @notice Evaluated in context of single blob/block.
   * @unit KB
   */
  spaceAvailable?: number
  /** Details about data availability sampling. */
  dataAvailabilitySampling?: DataAvailabilitySampling
  /** The consensus algorithm used by the data availability layer. */
  consensusAlgorithm: DaConsensusAlgorithm
  /** Economic security configuration. */
  economicSecurity?: DaEconomicSecurity
  /** Risks associated with the data availability layer. */
  risks: DaLayerRisks
}

export type EthereumDaLayer = CommonDaLayer & {
  kind: 'EthereumDaLayer'
  bridges: [EnshrinedBridge]
  risks: EthereumDaLayerRisks
  /** The consensus algorithm used by the data availability layer. */
  consensusAlgorithm: DaConsensusAlgorithm
  /** Economic security configuration. */
  economicSecurity?: DaEconomicSecurity
  /** The period within which full nodes must store and distribute data. @unit seconds */
  pruningWindow: number
  /**
   * Space available for data availability.
   * @notice Evaluated in context of single blob/block.
   * @unit KB
   */
  spaceAvailable?: number
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
