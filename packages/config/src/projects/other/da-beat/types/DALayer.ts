import { ProjectId } from '@l2beat/shared-pure'
import { DaBridge, DacBridge } from './DABridge'

export type DaLayerType = 'Public blockchain' | 'DaC'

export type DaLayer = BlockchainDaLayer | DacDaLayer

export type BlockchainDaLayer = CommonDaLayer & {
  type: 'Public blockchain'
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
    description: string

    /**
     * The logo of the data availability layer.
     * Will be resolved automatically by the frontend.
     * @override if the logo has different name
     */
    logo?: string
  }

  bridges: DaBridge[]

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

  dacs: DacBridge[]
}

export type CommonDaLayer = {
  /**
   * List of projects given da layer is being used in
   */
  usedIn: ProjectId[]
}

export type DaLayerRisks = {
  economicSecurity: EconomicSecurityRisk
  fraudDetection: FraudDetectionRisk
}

export type EconomicSecurityRisk =
  | {
      type: 'OnchainQuantifiable'
    }
  | {
      type: 'OffchainVerifiable'
    }
  | {
      type: 'Unknown'
    }

export type FraudDetectionRisk =
  | {
      type: 'DAS with block reconstruction'
    }
  | {
      type: 'DAS with no block reconstruction'
    }
  | {
      type: 'Erasure coding proof'
    }
  | {
      type: 'No fraud detection'
    }
