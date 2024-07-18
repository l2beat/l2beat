import { ProjectId } from '@l2beat/shared-pure'
import {
  DacBridge,
  EnshrinedBridge,
  NoDaBridge,
  OnChainDaBridge,
} from './DaBridge'
import { DaConsensusAlgorithm } from './DaConsensusAlgorithm'
import { DaDisplay } from './DaDisplay'
import { DaEconomicSecurity } from './DaEconomicSecurity'
import { DaEconomicSecurityRisk } from './DaEconomicSecurityRisk'
import { DaFraudDetectionRisk } from './DaFraudDetectionRisk'
import { DataAvailabilitySampling } from './DataAvailabilitySampling'

export type DaLayer = BlockchainDaLayer | DacDaLayer

export type BlockchainDaLayer = CommonDaLayer & {
  kind: 'public-blockchain'
  bridges: (OnChainDaBridge | EnshrinedBridge | NoDaBridge)[]
  /** The period within which full nodes must store and distribute data. @unit seconds */
  pruningWindow: number
  /** Details about data availability sampling. */
  dataAvailabilitySampling?: DataAvailabilitySampling
  /** The consensus algorithm used by the data availability layer. */
  consensusAlgorithm: DaConsensusAlgorithm
  /** Economic security configuration. */
  economicSecurity?: DaEconomicSecurity
}

export type DacDaLayer = CommonDaLayer & {
  kind: 'dac'
  bridges: DacBridge[]
}

export type CommonDaLayer = {
  type: 'da-layer'
  /** Unique identifier of the data availability layer. */
  id: string
  /** Display information for the data availability layer. */
  display: DaDisplay
  /** Is the DA layer upcoming? */
  isUpcoming?: boolean
  /** Is the DA layer under review? */
  isUnderReview?: boolean
  /** The technology used by the data availability layer. [MARKDOWN] */
  technology: string
  /** List of projects given da layer is being used in. */
  usedIn: ProjectId[]
  /** Risks associated with the data availability layer. */
  risks: DaLayerRisks
}

export type DaLayerRisks = {
  economicSecurity: DaEconomicSecurityRisk
  fraudDetection: DaFraudDetectionRisk
}
