import type {
  OsiLicense,
  OsiLicenseId,
  ProjectCrops,
  ProjectOpenSourceCropEvaluation,
} from '@l2beat/config'
import {
  CROP_KEYS,
  CROP_SENTIMENTS,
  CROP_STATUSES,
  OSI_LICENSES,
  OsiLicenseSchema,
} from '@l2beat/config'
import { v } from '@l2beat/validate'

export const CropSentimentSchema = v.enum(CROP_SENTIMENTS)
export const CropStatusSchema = v.enum(CROP_STATUSES)

/**
 * An evaluation with every optional field resolved to a concrete value. The
 * validator is the shape the CROPS API serves; the type is derived from it so
 * the two cannot drift.
 */
export const ResolvedCropEvaluationSchema = v.strictObject({
  sentiment: CropSentimentSchema,
  status: CropStatusSchema,
  license: OsiLicenseSchema.optional().meta({
    description: 'Only on the open source crop, once the license is confirmed.',
  }),
  points: v.array(v.string()),
  missing: v.array(v.string()),
  additionalConsiderations: v.array(v.string()),
  notReviewed: v.array(v.string()),
})
export type ResolvedCropEvaluation = v.infer<
  typeof ResolvedCropEvaluationSchema
>

export const ResolvedCropsSchema = v.strictObject({
  censorshipResistance: ResolvedCropEvaluationSchema,
  openSource: ResolvedCropEvaluationSchema,
  privacy: ResolvedCropEvaluationSchema,
  security: ResolvedCropEvaluationSchema,
})
export type ResolvedCrops = v.infer<typeof ResolvedCropsSchema>

/**
 * The single place the implicit defaults of a config entry are resolved, so
 * the API, the attestations and the garden badge cannot disagree.
 */
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

/** Throws rather than serve a green Open source crop nothing backs. */
function getOsiLicense(id: OsiLicenseId): OsiLicense {
  const license: OsiLicense | undefined = OSI_LICENSES[id]
  if (!license) {
    throw new Error(
      `${id} is not an OSI-approved license. Only licenses from https://opensource.org/licenses can back the Open source crop.`,
    )
  }
  return license
}
