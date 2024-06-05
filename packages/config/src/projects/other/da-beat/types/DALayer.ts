import { DABridge } from './DABridge'

export type DALayerType = 'Public blockchain' | 'DAC'

export type DALayer = {
  /**
   * The name of the data availability layer.
   */
  name: string

  /**
   * A short description of the data availability layer.
   */
  description: string

  /**
   * The logo of the data availability layer.
   */
  logo: string

  daBridges: DABridge[]

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
      type: 'EconomicSecurity'
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
