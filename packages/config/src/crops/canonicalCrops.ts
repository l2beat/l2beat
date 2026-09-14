import { v } from '@l2beat/validate'
import {
  GRADED_CROP_STATUSES,
  PROJECT_CROP_SENTIMENTS,
  type ProjectCrops,
  type ProjectOpenSourceCropEvaluation,
  UNGRADED_CROP_STATUSES,
} from '../types'
import { getOsiLicense, OsiLicenseSchema } from './osiLicenses'

/** The four crops, in the order they are rendered and served. */
export const CROP_KEYS = [
  'censorshipResistance',
  'openSource',
  'privacy',
  'security',
] as const

export type CropKey = (typeof CROP_KEYS)[number]

/** `neutral` is never declared in config: it is what an ungraded crop resolves to. */
export const CROP_SENTIMENTS = [...PROJECT_CROP_SENTIMENTS, 'neutral'] as const
export type CropSentiment = (typeof CROP_SENTIMENTS)[number]

export const CROP_STATUSES = [
  ...GRADED_CROP_STATUSES,
  ...UNGRADED_CROP_STATUSES,
] as const
export type CropStatus = (typeof CROP_STATUSES)[number]

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
