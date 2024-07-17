import { ProjectId } from '@l2beat/shared-pure'
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
import { DataAvailabilitySampling } from './DataAvailabilitySampling'

export const DaLayerKind = {
  PublicBlockchain: 'PublicBlockchain',
  DAC: 'DAC',
} as const

export type DaLayerKind = (typeof DaLayerKind)[keyof typeof DaLayerKind]

export type DaLayer = BlockchainDaLayer | DacDaLayer

export const DaLayerKindDisplay: Record<DaLayerKind, string> = {
  PublicBlockchain: 'Public blockchain',
  DAC: 'DAC',
}

export type BlockchainDaLayer = CommonDaLayer & {
  kind: typeof DaLayerKind.PublicBlockchain

  bridges: (OnChainDaBridge | EnshrinedBridge | NoDaBridge)[]

  dataAvailabilitySampling: DataAvailabilitySampling

  /**
   * The consensus algorithm used by the data availability layer.
   */
  consensusAlgorithm: DaConsensusAlgorithm

  /**
   * Economic security configuration.
   */
  economicSecurity?: DaEconomicSecurity
}

export type DacDaLayer = CommonDaLayer & {
  kind: typeof DaLayerKind.DAC

  bridges: DacBridge[]
}

export type CommonDaLayer = {
  /**
   * Unique identifier of the data availability layer
   */
  id: string

  display: {
    /**
     * The name of the data availability layer.
     */
    name: string

    /**
     * Slug of the data availability bridge
     */
    slug: string

    /**
     * A short description of the data availability layer.
     */
    description?: string
  }

  /**
   * List of projects given da layer is being used in
   */
  usedIn: ProjectId[]

  /**
   * Risks associated with the data availability layer.
   * @see DaLayerRisks
   */
  risks: DaLayerRisks
}

export type DaLayerRisks = {
  economicSecurity: DaEconomicSecurityRisk
  fraudDetection: DaFraudDetectionRisk
}
