import { ProjectId } from '@l2beat/shared-pure'
import { DacBridge, NoDaBridge, OnChainDaBridge } from './DaBridge'
import { DaEconomicSecurity } from './DaEconomicSecurity'
import { DaEconomicSecurityRisk } from './DaEconomicSecurityRisk'
import { DaFraudDetectionRisk } from './DaFraudDetectionRisk'

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

export type DataAvailabilitySampling =
  | {
      supportsDAS: false
    }
  | {
      /**
       * Whether the data availability layer supports data availability sampling.
       */
      supportsDAS: true
      /**
       * The period within which full nodes must store and distribute data.
       * @unit seconds
       */
      pruningWindow: number
      /**
       * The erasure coding scheme used by the data availability layer.
       */
      erasureCodingScheme: string
      /**
       * The erasure coding proof type used by the data availability layer.
       */
      erasureCodingProof: string
    }

export type BlockchainDaLayer = CommonDaLayer & {
  kind: typeof DaLayerKind.PublicBlockchain

  bridges: (OnChainDaBridge | NoDaBridge)[]

  dataAvailabilitySampling: DataAvailabilitySampling

  /**
   * The consensus algorithm used by the data availability layer.
   */
  consensusAlgorithm: {
    /**
     * The name of the consensus algorithm.
     */
    name: string

    /**
     * A description of the consensus algorithm.
     */
    description: string

    /**
     * The time it takes to produce a new block.
     * @unit seconds
     */
    blockTime: number

    /**
     * Consensus finality time.
     * @unit seconds
     */
    consensusFinality: number

    /**
     * Duration of time for unbonding in seconds. Intended to capture the weak subjectivity period.
     * @unit seconds
     */
    unbondingPeriod: number
  }

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
