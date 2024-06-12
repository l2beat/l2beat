import { ProjectId } from '@l2beat/shared-pure'
import { DacBridge, NoDaBridge, OnChainDaBridge } from './DaBridge'
import { DaEconomicSecurityRisk } from './DaEconomicSecurityRisk'
import { DaFraudDetectionRisk } from './DaFraudDetectionRisk'

export type DaLayerKind = (typeof DaLayerKind)[keyof typeof DaLayerKind]

const PublicBlockchain = {
  type: 'PublicBlockchain',
  display: 'Public blockchain',
} as const

const DAC = {
  type: 'DAC',
  display: 'DAC',
} as const

export const DaLayerKind = {
  PublicBlockchain: PublicBlockchain,
  DAC: DAC,
}

export type DaLayer = BlockchainDaLayer | DacDaLayer

export type BlockchainDaLayer = CommonDaLayer & {
  kind: typeof PublicBlockchain

  bridges: (OnChainDaBridge | NoDaBridge)[]

  /**
   * The duration of the data storage.
   * @unit seconds
   */
  storageDuration: number

  /**
   * Consensus finality time.
   * @unit seconds
   */
  consensusFinality: number

  /**
   * Duration of time for unbonding in seconds
   * @unit seconds
   */
  unbondingPeriod: number
}

export type DacDaLayer = CommonDaLayer & {
  kind: typeof DAC

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
