import { ProjectId } from '@l2beat/shared-pure'
import { DacBridge, NoDaBridge, OnChainDaBridge } from './DaBridge'
import { DaEconomicSecurityRisk } from './DaEconomicSecurityRisk'
import { DaFraudDetectionRisk } from './DaFraudDetectionRisk'

export type DaLayerType = 'Public blockchain' | 'DaC'

export type DaLayer = BlockchainDaLayer | DacDaLayer

export type BlockchainDaLayer = CommonDaLayer & {
  type: 'Public blockchain'

  bridges: (OnChainDaBridge | NoDaBridge)[]

  /**
   * The duration of the data storage.
   * @unit seconds
   */
  storageDuration: number

  /**
   * Risks associated with the data availability layer.
   * @see DaLayerRisks
   */
  risks: DaLayerRisks
}

export type DacDaLayer = CommonDaLayer & {
  type: 'DAC'

  bridges: DacBridge[]
}

export type CommonDaLayer = {
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

    /**
     * The logo of the data availability layer.
     * Will be resolved automatically by the frontend.
     * @override if the logo has different name
     */
    logo?: string
  }

  /**
   * List of projects given da layer is being used in
   */
  usedIn: ProjectId[]
}

export type DaLayerRisks = {
  economicSecurity: DaEconomicSecurityRisk
  fraudDetection: DaFraudDetectionRisk
}
