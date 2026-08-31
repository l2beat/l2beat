import type {
  ProjectCropEvaluation,
  ProjectCropStatus,
  Sentiment,
} from '../types'

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

/** An evaluation with every optional field resolved to a concrete value. */
export interface ResolvedCropEvaluation {
  sentiment: Sentiment
  status: ProjectCropStatus
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
  evaluation: ProjectCropEvaluation,
): ResolvedCropEvaluation {
  const status: ProjectCropStatus = evaluation.status ?? 'reviewed'
  return {
    // A crop we have not reviewed makes no claim about quality, so it is grey
    // regardless of what sentiment the config happens to carry.
    sentiment:
      status === 'notReviewed'
        ? 'neutral'
        : (evaluation.sentiment ?? 'neutral'),
    status,
    points: evaluation.points ?? [],
    missing: evaluation.missing ?? [],
    additionalConsiderations: evaluation.additionalConsiderations ?? [],
    notReviewed: evaluation.notReviewed ?? [],
  }
}
