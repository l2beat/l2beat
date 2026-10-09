import type {
  OsiLicense,
  OsiLicenseId,
  ProjectCropSentiment,
  ProjectCropStatus,
  ProjectCrops,
  ProjectOpenSourceCropEvaluation,
} from '@l2beat/config'
import { OSI_LICENSES } from '@l2beat/config'
import {
  getOssificationSentiment,
  measureOssification,
  OSSIFICATION_SCORE_BANDS,
  type OssificationHistory,
} from '@l2beat/shared/frontend'
import type { UnixTime } from '@l2beat/shared-pure'
import { type Validator, v } from '@l2beat/validate'

// Config leaves a crop's defaults implicit; the API serves a fully resolved
// one. The frontend resolves the same way in its own copy of this file, so a
// change here is a change there.

/** `neutral` is never declared in config: it is what an ungraded crop resolves to. */
export const CropSentimentSchema = v.enum([
  'good',
  'warning',
  'bad',
  'neutral',
] as const satisfies readonly (ProjectCropSentiment | 'neutral')[])

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

/** What the Security cap needs from a project's ossification. */
export interface CropsOssificationScore {
  score: number
  isUnverified: boolean
}

/** Undefined without an ossification history, which keeps the project unlisted. */
export function scoreOssification(
  history: OssificationHistory | undefined,
  now: UnixTime,
): CropsOssificationScore | undefined {
  if (!history) {
    return undefined
  }
  const { score, contracts } = measureOssification(history, now)
  return { score, isUnverified: contracts.some((c) => !c.isVerified) }
}

export function resolveProjectCrops(
  crops: ProjectCrops,
  ossification: CropsOssificationScore | undefined,
): ResolvedCrops {
  return {
    censorshipResistance: resolveCropEvaluation(crops.censorshipResistance),
    openSource: resolveCropEvaluation(crops.openSource),
    privacy: resolveCropEvaluation(crops.privacy),
    security: capByOssification(
      resolveCropEvaluation(crops.security),
      ossification,
    ),
  }
}

const SENTIMENT_RANK = { bad: 0, warning: 1, good: 2 } as const

/**
 * Security is rated no better than its ossification score allows, and a
 * capped crop says why, so the rating never contradicts its own findings. The
 * score resets with every critical change, so an upgrade pulls a project out
 * of the garden until the new code has been live for a few weeks.
 */
function capByOssification(
  security: ResolvedCropEvaluation,
  ossification: CropsOssificationScore | undefined,
): ResolvedCropEvaluation {
  if (!ossification || security.sentiment === 'neutral') {
    return security
  }
  const cap = getOssificationSentiment(ossification.score)
  if (
    cap === 'good' ||
    SENTIMENT_RANK[security.sentiment] <= SENTIMENT_RANK[cap]
  ) {
    return security
  }
  const reason = ossification.isUnverified
    ? 'No ossification score: some critical contracts are unverified.'
    : cap === 'warning'
      ? `Ossification score below ${OSSIFICATION_SCORE_BANDS.good}: critical contracts changed within about the last year.`
      : `Ossification score below ${OSSIFICATION_SCORE_BANDS.warning}: critical contracts changed within roughly the last five weeks.`
  return { ...security, sentiment: cap, missing: [reason, ...security.missing] }
}

/**
 * A single red crop keeps a project out, whatever the other three say, and so
 * does a missing ossification score, which Security needs. The project is
 * still reviewed, and its project page still shows the evaluation.
 */
export function qualifiesForGarden(
  crops: ResolvedCrops,
  hasOssificationScore: boolean,
): boolean {
  return (
    hasOssificationScore &&
    Object.values(crops).every((crop) => crop.sentiment !== 'bad')
  )
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
