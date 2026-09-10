import type {
  CropKey,
  ResolvedCropEvaluation,
  ResolvedCrops,
} from '@l2beat/config'
import { CROPS } from '@l2beat/config'
import { ps } from '~/server/projects'
import { getGardenProjectPath } from './getGardenProjectPath'

const { getCropAttestationLedger, getCurrentCropAttestation } =
  CROPS.attestations
const { CROP_KEYS, qualifiesForGarden, resolveProjectCrops } =
  CROPS.canonicalCrops
const {
  ATTESTATION_NETWORK,
  ATTESTATION_NETWORKS,
  ATTESTATION_SCHEMA,
  ATTESTATION_SCHEMA_UID,
  getAttestationUrl,
} = CROPS.eas

// API responses link to production whatever host served them.
export const BASE_URL = 'https://l2beat.com'

export interface CropsAttestationsMeta {
  network: string
  chainId: number
  isTestnet: boolean
  eas: string
  schemaUid: string
  schema: string
  attester: string | null
  current: {
    uid: string
    revision: number
    reviewedAt: number
    projectIds: string[]
    txHash: string
    explorerUrl: string
  } | null
}

export function getAttestationsMeta(): CropsAttestationsMeta {
  const network = ATTESTATION_NETWORKS[ATTESTATION_NETWORK]
  const ledger = getCropAttestationLedger(ATTESTATION_NETWORK)
  const current = getCurrentCropAttestation(ATTESTATION_NETWORK)
  return {
    network: network.name,
    chainId: network.chainId,
    isTestnet: network.isTestnet,
    eas: network.eas,
    schemaUid: ATTESTATION_SCHEMA_UID,
    schema: ATTESTATION_SCHEMA,
    attester: ledger?.attester ?? null,
    current: current
      ? {
          uid: current.uid,
          revision: current.revision,
          reviewedAt: current.reviewedAt,
          projectIds: current.projectIds,
          txHash: current.txHash,
          explorerUrl: getAttestationUrl(network, current.uid),
        }
      : null,
  }
}

export interface CropsApiAttestation {
  uid: string
  revision: number
  reviewedAt: number
  explorerUrl: string
}

export interface CropsApiProject {
  id: string
  slug: string
  name: string
  /** Null for projects without a page. */
  href: string | null
  crops: ResolvedCrops
  /** False while any crop is red - see `qualifiesForGarden`. */
  inGarden: boolean
  attested: boolean
  /** One attestation names the whole set, so this is the same for every attested project. */
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
  const attestation = getAttestation()
  const attested = new Set(
    getCurrentCropAttestation(ATTESTATION_NETWORK)?.projectIds ?? [],
  )

  return projects
    .map((project) => {
      const path = getGardenProjectPath(project)
      const crops = resolveProjectCrops(project.crops)
      const isAttested = attested.has(project.id)
      return {
        id: project.id,
        slug: project.slug,
        name: project.name,
        href: path ? `${BASE_URL}${path}` : null,
        crops,
        inGarden: qualifiesForGarden(crops),
        attested: isAttested,
        attestation: isAttested ? attestation : null,
      }
    })
    .sort((a, b) => a.id.localeCompare(b.id))
}

export function toCropsSummary(crops: ResolvedCrops): CropsApiSummary {
  const summary = {} as CropsApiSummary
  for (const key of CROP_KEYS) {
    summary[key] = {
      sentiment: crops[key].sentiment,
      status: crops[key].status,
    }
  }
  return summary
}

function getAttestation(): CropsApiAttestation | null {
  const attestation = getCurrentCropAttestation(ATTESTATION_NETWORK)
  if (!attestation) {
    return null
  }
  return {
    uid: attestation.uid,
    revision: attestation.revision,
    reviewedAt: attestation.reviewedAt,
    explorerUrl: getAttestationUrl(
      ATTESTATION_NETWORKS[ATTESTATION_NETWORK],
      attestation.uid,
    ),
  }
}
