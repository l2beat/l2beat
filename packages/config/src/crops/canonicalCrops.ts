import type {
  ProjectCropStatus,
  ProjectCrops,
  ProjectOpenSourceCropEvaluation,
  Sentiment,
} from '../types'
import { getOsiLicense, type OsiLicense } from './osiLicenses'

// Deliberately dependency-free: this module is deep-imported by the frontend
// and by the l2b CLI. Keep it pure.

/**
 * The four crops, in the order they are rendered and served. Fixed on purpose:
 * consumers index into responses by position as often as by key.
 */
export const CROP_KEYS = [
  'censorshipResistance',
  'openSource',
  'privacy',
  'security',
] as const

export type CropKey = (typeof CROP_KEYS)[number]

/** Statuses that make no claim about quality, so they never carry a colour. */
const GREY_STATUSES: ProjectCropStatus[] = ['notReviewed', 'fullyTransparent']

/** An evaluation with every optional field resolved to a concrete value. */
export interface ResolvedCropEvaluation {
  sentiment: Sentiment
  status: ProjectCropStatus
  /**
   * The OSI-approved license the Open source crop rests on, looked up from the
   * declared `license` id. Undefined on the other three crops, and on an Open
   * source crop whose license we have not confirmed.
   */
  license: OsiLicense | undefined
  points: string[]
  missing: string[]
  additionalConsiderations: string[]
  notReviewed: string[]
}

/**
 * Resolves the defaults a `ProjectCropEvaluation` leaves implicit. Consumers of
 * the API and of the attestations must never have to reimplement these rules,
 * and the garden badge must agree with what we sign, so this is the single
 * place the rules live.
 */
export function resolveCropEvaluation(
  // The Open source shape, because it is the superset - `license` is simply
  // absent on the other three crops.
  evaluation: ProjectOpenSourceCropEvaluation,
): ResolvedCropEvaluation {
  const status: ProjectCropStatus = evaluation.status ?? 'reviewed'
  return {
    // A crop with no quality to grade is grey regardless of what sentiment the
    // config happens to carry - whether that is because nobody has reviewed it
    // or because the protocol makes no claim to the property at all.
    sentiment: GREY_STATUSES.includes(status)
      ? 'neutral'
      : (evaluation.sentiment ?? 'neutral'),
    status,
    // Throws on an id the OSI has not approved rather than quietly dropping
    // it: a green Open source crop with no license behind it is the one
    // outcome this field exists to prevent.
    license:
      evaluation.license === undefined
        ? undefined
        : getOsiLicense(evaluation.license),
    points: evaluation.points ?? [],
    missing: evaluation.missing ?? [],
    additionalConsiderations: evaluation.additionalConsiderations ?? [],
    notReviewed: evaluation.notReviewed ?? [],
  }
}

/** All four crops of one project, with every implicit default resolved. */
export type ResolvedCrops = Record<CropKey, ResolvedCropEvaluation>

/** Resolves all four crops of a project at once, in canonical order. */
export function resolveProjectCrops(crops: ProjectCrops): ResolvedCrops {
  const resolved = {} as ResolvedCrops
  for (const key of CROP_KEYS) {
    resolved[key] = resolveCropEvaluation(crops[key])
  }
  return resolved
}

/**
 * Whether a project belongs in the garden. A single red crop keeps it out,
 * reviewed or not: the garden is the set of protocols that hold every CROPS
 * property, so one property that demonstrably does not hold is disqualifying
 * on its own - it cannot be averaged away against three green ones.
 *
 * A project that fails this is still reviewed, and its project page still
 * shows the evaluation. It just has not made it into the garden yet.
 */
export function qualifiesForGarden(crops: ResolvedCrops): boolean {
  return CROP_KEYS.every((key) => crops[key].sentiment !== 'bad')
}
