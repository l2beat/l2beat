import { DasErasureCodingProof } from './DasErasureCodingProof'
import { DasErasureCodingScheme } from './DasErasureCodingScheme'

export type DataAvailabilitySampling = {
  /** The period within which full nodes must store and distribute data. @unit seconds. */
  pruningWindow: number
  /** The erasure coding scheme used by the data availability layer. */
  erasureCodingScheme: DasErasureCodingScheme
  /** The erasure coding proof type used by the data availability layer. */
  erasureCodingProof: DasErasureCodingProof
}
