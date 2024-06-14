import { ProjectId } from '@l2beat/shared-pure'
import { DacBridge, NoDaBridge, OnChainDaBridge } from './DaBridge'
import { DaEconomicSecurityRisk } from './DaEconomicSecurityRisk'
import { DaFraudDetectionRisk } from './DaFraudDetectionRisk'
import { DaEconomicSecurity } from './DaEconomicSecurity'

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
