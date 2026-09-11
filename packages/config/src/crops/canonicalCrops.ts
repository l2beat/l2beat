import type {
  ProjectCropSentiment,
  ProjectCropStatus,
  ProjectCrops,
  ProjectOpenSourceCropEvaluation,
} from '../types'
import { getOsiLicense, type OsiLicense } from './osiLicenses'

// Deep-imported by the frontend and the l2b CLI; keep it dependency-free.

/** The four crops, in the order they are rendered and served. */
export const CROP_KEYS = [
  'censorshipResistance',
  'openSource',
  'privacy',
  'security',
] as const

export type CropKey = (typeof CROP_KEYS)[number]

/** `neutral` is never declared in config: it is what an ungraded crop resolves to. */
export type CropSentiment = ProjectCropSentiment | 'neutral'

/** Statuses that make no claim about quality, so they never carry a colour. */
const GREY_STATUSES: ProjectCropStatus[] = ['notReviewed', 'fullyTransparent']

/** An evaluation with every optional field resolved to a concrete value. */
export interface ResolvedCropEvaluation {
  sentiment: CropSentiment
  status: ProjectCropStatus
  /** Only on the Open source crop, and only when the license is confirmed; absent otherwise. */
  license?: OsiLicense
  points: string[]
  missing: string[]
  additionalConsiderations: string[]
  notReviewed: string[]
}

/**
 * The single place the implicit defaults of a config entry are resolved, so
 * the API, the attestations and the garden badge cannot disagree.
 */
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

export type ResolvedCrops = Record<CropKey, ResolvedCropEvaluation>

export function resolveProjectCrops(crops: ProjectCrops): ResolvedCrops {
  const resolved = {} as ResolvedCrops
  for (const key of CROP_KEYS) {
    resolved[key] = resolveCropEvaluation(crops[key])
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
