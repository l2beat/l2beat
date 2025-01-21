import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'

export interface Layer2LivenessConfig {
  duplicateData: {
    from: TrackedTxsConfigSubtype
    to: TrackedTxsConfigSubtype
  }
}
