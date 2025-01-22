import type {
  ScalingProjectContract,
  ScalingProjectReference,
  ScalingProjectRisk,
} from '../../../common'

export interface DaBridgeContracts {
  /** List of risks associated with the contracts */
  risks: ScalingProjectRisk[]
  /** List of the contracts on each chain */
  addresses: Record<string, ScalingProjectContract[]>
  /** List of references backing up the claim */
  references?: ScalingProjectReference[]
  /** The description and research is incomplete */
  isIncomplete?: boolean
  /** The description and research is under review */
  isUnderReview?: boolean
}
