import type {
  OsiLicense,
  OsiLicenseId,
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
import type {
  GardenListing,
  ResolvedCropEvaluation,
  ResolvedCrops,
} from '~/components/garden/crops'

// Config leaves a crop's defaults implicit; the site renders a fully resolved
// one. crops-api resolves the same way in its own copy of this file, so a
// change here is a change there.

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
 * A single red crop keeps a project out, whatever the other three say, and so
 * does a missing ossification score, which Security needs. The project is
 * still reviewed, and its project page still shows the evaluation.
 */
export function qualifiesForGarden(
  crops: ResolvedCrops,
  hasOssificationScore: boolean,
): boolean {
  return getGardenListing(crops, hasOssificationScore) === 'listed'
}

export function getGardenListing(
  crops: ResolvedCrops,
  hasOssificationScore: boolean,
): GardenListing {
  if (Object.values(crops).some((crop) => crop.sentiment === 'bad')) {
    return 'ratedBad'
  }
  return hasOssificationScore ? 'listed' : 'noOssificationScore'
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
