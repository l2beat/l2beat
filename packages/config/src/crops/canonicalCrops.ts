import type {
  ProjectCropEvaluation,
  ProjectCropStatus,
  ProjectCrops,
  Sentiment,
} from '../types'

// Deliberately dependency-free: this module is deep-imported by the frontend
// (which must not pull in a crypto library) and by the l2b CLI (which does the
// hashing itself). Keep it pure.

/**
 * The four crops, in the order they are attested and hashed. Changing this
 * order changes every evaluation hash, so it is fixed on purpose.
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
    notReviewed: evaluation.notReviewed ?? [],
  }
}

export interface CanonicalCrops {
  projectId: string
  projectName: string
  crops: Record<CropKey, ResolvedCropEvaluation>
}

export function toCanonicalCrops(
  projectId: string,
  projectName: string,
  crops: ProjectCrops,
): CanonicalCrops {
  const resolved = {} as Record<CropKey, ResolvedCropEvaluation>
  for (const key of CROP_KEYS) {
    resolved[key] = resolveCropEvaluation(crops[key])
  }
  return { projectId, projectName, crops: resolved }
}

/**
 * The exact preimage of `evaluationHash`. Every field is emitted in a fixed
 * order with no whitespace, so the same evaluation always serializes to the
 * same bytes no matter how the config object was written.
 */
export function serializeCanonicalCrops(canonical: CanonicalCrops): string {
  const crops = CROP_KEYS.map((key) => {
    const evaluation = canonical.crops[key]
    return [
      json(key),
      ':{',
      '"sentiment":',
      json(evaluation.sentiment),
      ',"status":',
      json(evaluation.status),
      ',"points":',
      jsonArray(evaluation.points),
      ',"missing":',
      jsonArray(evaluation.missing),
      ',"notReviewed":',
      jsonArray(evaluation.notReviewed),
      '}',
    ].join('')
  }).join(',')

  return [
    '{"projectId":',
    json(canonical.projectId),
    ',"projectName":',
    json(canonical.projectName),
    ',"crops":{',
    crops,
    '}}',
  ].join('')
}

function json(value: string): string {
  return JSON.stringify(value)
}

function jsonArray(values: string[]): string {
  return `[${values.map(json).join(',')}]`
}
