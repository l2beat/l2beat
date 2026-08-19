import {
  getCropAttestation,
  getCropAttestationLedger,
} from '@l2beat/config/build/crops/attestations'
import type {
  CropKey,
  ResolvedCropEvaluation,
} from '@l2beat/config/build/crops/canonicalCrops'
import {
  CROP_KEYS,
  resolveCropEvaluation,
} from '@l2beat/config/build/crops/canonicalCrops'
import {
  ATTESTATION_NETWORK,
  ATTESTATION_NETWORKS,
  ATTESTATION_SCHEMA,
  ATTESTATION_SCHEMA_UID,
  getAttestationUrl,
} from '@l2beat/config/build/crops/eas'
import { ps } from '~/server/projects'
import { getGardenProjectPath } from './getGardenProjectPath'

const BASE_URL = 'https://l2beat.com'

/** Where consumers can verify a rating for themselves. */
export function getAttestationsMeta() {
  const network = ATTESTATION_NETWORKS[ATTESTATION_NETWORK]
  const ledger = getCropAttestationLedger(ATTESTATION_NETWORK)
  return {
    network: network.name,
    chainId: network.chainId,
    // Testnet attestations are a rehearsal, not a production claim. Consumers
    // must be able to tell without reading our docs.
    isTestnet: network.isTestnet,
    eas: network.eas,
    schemaUid: ATTESTATION_SCHEMA_UID,
    schema: ATTESTATION_SCHEMA,
    attester: ledger?.attester ?? null,
  }
}

/** The vocabulary, so a consumer can render every value we might send. */
export const CROPS_FRAMEWORK = {
  crops: CROP_KEYS,
  sentiments: ['good', 'warning', 'bad', 'neutral', 'UnderReview'],
  statuses: ['reviewed', 'partiallyReviewed', 'notReviewed'],
} as const

export interface CropsApiAttestation {
  uid: string
  revision: number
  reviewedAt: number
  evaluationHash: string
  txHash: string
  explorerUrl: string
}

export interface CropsApiProject {
  id: string
  slug: string
  name: string
  /** Absolute url of the project page. Null for projects without one. */
  href: string | null
  crops: Record<CropKey, ResolvedCropEvaluation>
  attestation: CropsApiAttestation | null
}

/** Sentiment and status only - the prose lives on the per-project endpoint. */
export type CropsApiSummary = Record<
  CropKey,
  Pick<ResolvedCropEvaluation, 'sentiment' | 'status'>
>

export async function getCropsProjects(): Promise<CropsApiProject[]> {
  const projects = await ps.getProjects({
    where: ['crops'],
    select: ['crops'],
    optional: ['scalingInfo', 'privacyInfo'],
  })

  return projects
    .map((project) => {
      const path = getGardenProjectPath(project)
      const crops = {} as Record<CropKey, ResolvedCropEvaluation>
      for (const key of CROP_KEYS) {
        crops[key] = resolveCropEvaluation(project.crops[key])
      }
      return {
        id: project.id,
        slug: project.slug,
        name: project.name,
        href: path ? `${BASE_URL}${path}` : null,
        crops,
        attestation: getAttestation(project.id),
      }
    })
    .sort((a, b) => a.id.localeCompare(b.id))
}

export function toCropsSummary(
  crops: Record<CropKey, ResolvedCropEvaluation>,
): CropsApiSummary {
  const summary = {} as CropsApiSummary
  for (const key of CROP_KEYS) {
    summary[key] = {
      sentiment: crops[key].sentiment,
      status: crops[key].status,
    }
  }
  return summary
}

function getAttestation(projectId: string): CropsApiAttestation | null {
  const attestation = getCropAttestation(ATTESTATION_NETWORK, projectId)
  if (!attestation) {
    // Reviewed but not attested yet. Null rather than omitted, so consumers do
    // not have to distinguish "no field" from "not attested".
    return null
  }
  return {
    uid: attestation.uid,
    revision: attestation.revision,
    reviewedAt: attestation.reviewedAt,
    evaluationHash: attestation.evaluationHash,
    txHash: attestation.txHash,
    explorerUrl: getAttestationUrl(
      ATTESTATION_NETWORKS[ATTESTATION_NETWORK],
      attestation.uid,
    ),
  }
}
