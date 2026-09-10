import * as attestations from './attestations'
import * as canonicalCrops from './canonicalCrops'
import * as eas from './eas'

export type {
  CropAttestation,
  CropAttestationLedger,
  RevokedCropAttestation,
} from './attestations'
export type {
  CropKey,
  CropSentiment,
  ResolvedCropEvaluation,
  ResolvedCrops,
} from './canonicalCrops'
export type { AttestationNetwork, AttestationNetworkConfig } from './eas'

/** The CROPS modules, grouped so the root index gains a single export. */
export const CROPS = { attestations, canonicalCrops, eas }
