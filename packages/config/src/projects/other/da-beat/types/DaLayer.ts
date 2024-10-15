import {
  DacBridge,
  EnshrinedBridge,
  NoDaBridge,
  OnChainDaBridge,
} from './DaBridge'
import { DaConsensusAlgorithm } from './DaConsensusAlgorithm'
import { DaEconomicSecurity } from './DaEconomicSecurity'
import { DaEconomicSecurityRisk } from './DaEconomicSecurityRisk'
import { DaFraudDetectionRisk } from './DaFraudDetectionRisk'
import { DaLinks } from './DaLinks'
import { DaTechnology } from './DaTechnology'
import { DataAvailabilitySampling } from './DataAvailabilitySampling'
import { UsedInProject } from './UsedInProject'

export type DaLayer = BlockchainDaLayer | DacDaLayer

export type BlockchainDaLayer = CommonDaLayer & {
  kind: 'PublicBlockchain'
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
  kind: 'DAC'
  bridges: (DacBridge | NoDaBridge)[]
}

export type CommonDaLayer = {
  type: 'DaLayer'
  /** Unique identifier of the data availability layer. */
  id: string
  /** Display information for the data availability layer. */
  display: DaLayerDisplay
  /** Is the DA layer upcoming? */
  isUpcoming?: boolean
  /** Is the DA layer under review? */
  isUnderReview?: boolean
  /** The technology used by the data availability layer. */
  technology: DaTechnology
  /** List of projects given da layer is being used in. */
  usedIn: UsedInProject[]
  /** Risks associated with the data availability layer. */
  risks: DaLayerRisks
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
