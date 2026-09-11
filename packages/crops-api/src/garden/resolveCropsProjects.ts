import type {
  ProjectCrops,
  ProjectPrivacyInfo,
  ProjectScalingInfo,
  ResolvedCrops,
} from '@l2beat/config'
import {
  CROP_KEYS,
  qualifiesForGarden,
  resolveProjectCrops,
} from '@l2beat/config'
import type {
  CropsApiAttestation,
  CropsApiProject,
  CropsApiSummary,
  CropsAttestationsMeta,
} from '../schemas'
import { getGardenProjectPath } from './getGardenProjectPath'

// Copied from the frontend's getCropsProjects until the garden helpers move
// into config, minus the ProjectService call: the generator is handed projects.

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

export function resolveCropsProjects(
  projects: CropsSourceProject[],
  meta: CropsAttestationsMeta,
): CropsApiProject[] {
  return projects
    .map((project) => resolveCropsProject(project, meta))
    .sort((a, b) => a.id.localeCompare(b.id))
}

function resolveCropsProject(
  project: CropsSourceProject,
  meta: CropsAttestationsMeta,
): CropsApiProject {
  const path = getGardenProjectPath(project)
  const crops = resolveProjectCrops(project.crops)
  const attested = meta.current?.projectIds.includes(project.id) ?? false
  return {
    id: project.id,
    slug: project.slug,
    name: project.name,
    href: path ? `${BASE_URL}${path}` : null,
    crops,
    inGarden: qualifiesForGarden(crops),
    attested,
    attestation: attested ? toApiAttestation(meta) : null,
  }
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
