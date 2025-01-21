import type { DasErasureCodingProof } from './DasErasureCodingProof'
import type { DasErasureCodingScheme } from './DasErasureCodingScheme'

export type DataAvailabilitySampling = {
  /** The erasure coding scheme used by the data availability layer. */
  erasureCodingScheme: DasErasureCodingScheme
  /** The erasure coding proof type used by the data availability layer. */
  erasureCodingProof: DasErasureCodingProof
}
