import { ProjectId } from '@l2beat/shared-pure'
import { DacBridge, NoDaBridge, OnChainDaBridge } from './DaBridge'
import { DaEconomicSecurity } from './DaEconomicSecurity'
import { DaEconomicSecurityRisk } from './DaEconomicSecurityRisk'
import { DaFraudDetectionRisk } from './DaFraudDetectionRisk'
import { DaDisplay } from './DaDisplay'

export type DaLayer = BlockchainDaLayer | DacDaLayer

export type BlockchainDaLayer = CommonDaLayer & {
  kind: 'public-blockchain'
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
  kind: 'dac'
  bridges: DacBridge[]
}

export type CommonDaLayer = {
  type: 'da-beat'
  /**
   * Unique identifier of the data availability layer
   */
  id: string
  /**
   * Display information for the data availability layer
   */
  display: DaDisplay
  /**
   * Is the DA layer upcoming?
   */
  isUpcoming?: boolean
  /**
   * Is the DA layer under review?
   */
  isUnderReview?: boolean
  /**
   * The technology used by the data availability layer. [MARKDOWN]
   */
  technology: string
  /**
   * List of projects given da layer is being used in
   */
  usedIn: ProjectId[]
  /**
   * Risks associated with the data availability layer.
   */
  risks: DaLayerRisks
}

export type DaLayerRisks = {
  economicSecurity: DaEconomicSecurityRisk
  fraudDetection: DaFraudDetectionRisk
}
