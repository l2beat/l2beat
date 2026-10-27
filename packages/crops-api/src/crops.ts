import type {
  CropSentiment,
  OsiLicense,
  ProjectCropStatus,
  ResolvedCropEvaluation,
  ResolvedCrops,
} from '@l2beat/config'
import { type Validator, v } from '@l2beat/validate'

// The resolved crops the API serves. @l2beat/config resolves them, for the
// site too; these validators are typed against its types, so the OpenAPI
// components cannot drift from what it returns.

/** `neutral` is never declared in config: it is what an ungraded crop resolves to. */
export const CropSentimentSchema = v.enum([
  'good',
  'warning',
  'bad',
  'neutral',
] as const satisfies readonly CropSentiment[])

/** Typed against config's interface, so the OpenAPI component cannot drift from the table it describes. */
const OsiLicenseSchema: Validator<OsiLicense> = v.strictObject({
  spdxId: v.string(),
  name: v.string(),
  url: v.string(),
  categories: v
    .array(v.string())
    .meta({ description: "The OSI's own filing, e.g. 'superseded'." }),
})

export const CropStatusSchema = v.enum([
  'reviewed',
  'partiallyReviewed',
  'notReviewed',
  'fullyTransparent',
] as const satisfies readonly ProjectCropStatus[])

/** An evaluation with every optional field resolved to a concrete value. */
export const ResolvedCropEvaluationSchema: Validator<ResolvedCropEvaluation> =
  v.strictObject({
    sentiment: CropSentimentSchema,
    status: CropStatusSchema,
    license: OsiLicenseSchema.optional().meta({
      description:
        'Only on the open source crop, once the license is confirmed.',
    }),
    points: v.array(v.string()),
    missing: v.array(v.string()),
    additionalConsiderations: v.array(v.string()),
    notReviewed: v.array(v.string()),
  })

export const ResolvedCropsSchema: Validator<ResolvedCrops> = v.strictObject({
  censorshipResistance: ResolvedCropEvaluationSchema,
  openSource: ResolvedCropEvaluationSchema,
  privacy: ResolvedCropEvaluationSchema,
  security: ResolvedCropEvaluationSchema,
})
