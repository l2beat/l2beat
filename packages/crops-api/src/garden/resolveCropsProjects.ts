import type {
  CropKey,
  ProjectCrops,
  ProjectPrivacyInfo,
  ProjectScalingInfo,
  ResolvedCropEvaluation,
  ResolvedCrops,
} from '@l2beat/config'
import { CROPS } from '@l2beat/config'
import type { CropsAttestationsMeta } from './getAttestationsMeta'
import { getGardenProjectPath } from './getGardenProjectPath'

// Copied from the frontend's getCropsProjects until the garden helpers move
// into config, minus the ProjectService call: the generator is handed projects.

const { CROP_KEYS, qualifiesForGarden, resolveProjectCrops } =
  CROPS.canonicalCrops

// API responses link to production whatever host served them.
const BASE_URL = 'https://l2beat.com'

// Only the fields the API needs, so tests can supply plain fixtures.
export interface CropsSourceProject {
  id: string
  slug: string
  name: string
  crops: ProjectCrops
  privacyInfo?: ProjectPrivacyInfo | undefined
  scalingInfo?: ProjectScalingInfo | undefined
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

export function resolveCropsProjects(
  projects: CropsSourceProject[],
  meta: CropsAttestationsMeta,
): CropsApiProject[] {
  const attestation = toApiAttestation(meta)
  const attested = new Set(meta.current?.projectIds ?? [])

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

function toApiAttestation(
  meta: CropsAttestationsMeta,
): CropsApiAttestation | null {
  if (!meta.current) {
    return null
  }
  return {
    uid: meta.current.uid,
    revision: meta.current.revision,
    reviewedAt: meta.current.reviewedAt,
    explorerUrl: meta.current.explorerUrl,
  }
}
