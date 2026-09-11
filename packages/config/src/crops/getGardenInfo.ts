import type {
  ProjectCropStatus,
  ProjectCrops,
  ProjectGardenInfo,
  ProjectOpenSourceCropEvaluation,
  ResolvedCropEvaluation,
  ResolvedCrops,
} from '../types'
import { getOsiLicense } from './osiLicenses'

/** Statuses that make no claim about quality, so they never carry a colour. */
const GREY_STATUSES: ProjectCropStatus[] = ['notReviewed', 'fullyTransparent']

/**
 * Runs once, in the config build. It is the single place the implicit
 * defaults of a config entry and the garden rule are applied, so the site,
 * the API and the attestations cannot disagree.
 */
export function getGardenInfo(crops: ProjectCrops): ProjectGardenInfo {
  const resolved: ResolvedCrops = {
    censorshipResistance: resolveCropEvaluation(crops.censorshipResistance),
    openSource: resolveCropEvaluation(crops.openSource),
    privacy: resolveCropEvaluation(crops.privacy),
    security: resolveCropEvaluation(crops.security),
  }
  return { inGarden: qualifiesForGarden(resolved), crops: resolved }
}

export function resolveCropEvaluation(
  // The Open source shape is the superset; `license` is simply absent elsewhere.
  evaluation: ProjectOpenSourceCropEvaluation,
): ResolvedCropEvaluation {
  const status: ProjectCropStatus = evaluation.status ?? 'reviewed'
  const resolved: ResolvedCropEvaluation = {
    sentiment: GREY_STATUSES.includes(status)
      ? 'neutral'
      : (evaluation.sentiment ?? 'neutral'),
    status,
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
function qualifiesForGarden(crops: ResolvedCrops): boolean {
  return Object.values(crops).every((crop) => crop.sentiment !== 'bad')
}
