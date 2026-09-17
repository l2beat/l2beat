import type {
  OsiLicense,
  OsiLicenseId,
  ProjectCrops,
  ProjectOpenSourceCropEvaluation,
} from '@l2beat/config'
import { OSI_LICENSES } from '@l2beat/config'
import type {
  ResolvedCropEvaluation,
  ResolvedCrops,
} from '~/components/garden/crops'

// Config leaves a crop's defaults implicit; the site renders a fully resolved
// one. crops-api resolves the same way in its own copy of this file, so a
// change here is a change there.

export function resolveProjectCrops(crops: ProjectCrops): ResolvedCrops {
  return {
    censorshipResistance: resolveCropEvaluation(crops.censorshipResistance),
    openSource: resolveCropEvaluation(crops.openSource),
    privacy: resolveCropEvaluation(crops.privacy),
    security: resolveCropEvaluation(crops.security),
  }
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
  return Object.values(crops).every((crop) => crop.sentiment !== 'bad')
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
