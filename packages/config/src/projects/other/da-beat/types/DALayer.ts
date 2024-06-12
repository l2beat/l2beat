import { ProjectId } from '@l2beat/shared-pure'
import { DABridge } from './DABridge'

export type DALayerType = 'Public blockchain' | 'DAC'

export type DALayer = {
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

  bridges: DABridge[]

  /**
   * List of projects given da layer is being used in
   */
  usedIn: ProjectId[]

  /**
   * The type of the data availability layer.
   * @see DALayerType
   */
  type: DALayerType

  /**
   * The duration of the data storage.
   * @unit seconds
   */
  storageDuration: number

  /**
   * Risks associated with the data availability layer.
   * @see DALayerRisks
   */
  risks: DALayerRisks
}

export type DALayerRisks = {
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
