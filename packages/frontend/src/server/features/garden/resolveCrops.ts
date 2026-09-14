import type {
  CropSentiment,
  CropStatus,
  OsiLicense,
  OsiLicenseId,
  ProjectCrops,
  ProjectOpenSourceCropEvaluation,
} from '@l2beat/config'
import { CROP_KEYS, OSI_LICENSES } from '@l2beat/config'

// Config declares a crop with optional fields and defaults left implicit; the
// site renders a fully resolved one. crops-api resolves the same way in its
// own copy of this file, so a change here is a change there.

/** An evaluation with every optional field resolved to a concrete value. */
export interface ResolvedCropEvaluation {
  sentiment: CropSentiment
  status: CropStatus
  /** Only on the open source crop, once the license is confirmed. */
  license?: OsiLicense
  points: string[]
  missing: string[]
  additionalConsiderations: string[]
  notReviewed: string[]
}

export type ResolvedCrops = Record<
  (typeof CROP_KEYS)[number],
  ResolvedCropEvaluation
>

export function resolveProjectCrops(crops: ProjectCrops): ResolvedCrops {
  const resolved = {} as ResolvedCrops
  for (const key of CROP_KEYS) {
    resolved[key] = resolveCropEvaluation(crops[key])
  }
  return resolved
}

export function resolveCropEvaluation(
  // The Open source shape is the superset; `license` is simply absent elsewhere.
  evaluation: ProjectOpenSourceCropEvaluation,
): ResolvedCropEvaluation {
  const resolved: ResolvedCropEvaluation = {
    sentiment: evaluation.sentiment ?? 'neutral',
    status: evaluation.status ?? 'reviewed',
    points: evaluation.points ?? [],
    missing: evaluation.missing ?? [],
    additionalConsiderations: evaluation.additionalConsiderations ?? [],
    notReviewed: evaluation.notReviewed ?? [],
  }
  if (evaluation.license !== undefined) {
    resolved.license = getOsiLicense(evaluation.license)
  }
  return resolved
}

/**
 * A single red crop keeps a project out, whatever the other three say. It is
 * still reviewed, and its project page still shows the evaluation.
 */
export function qualifiesForGarden(crops: ResolvedCrops): boolean {
  return CROP_KEYS.every((key) => crops[key].sentiment !== 'bad')
}

/** Throws rather than render a green Open source crop nothing backs. */
function getOsiLicense(id: OsiLicenseId): OsiLicense {
  const license: OsiLicense | undefined = OSI_LICENSES[id]
  if (!license) {
    throw new Error(
      `${id} is not an OSI-approved license. Only licenses from https://opensource.org/licenses can back the Open source crop.`,
    )
  }
  return license
}
