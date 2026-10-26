import {
  measureOssification,
  type OssificationHistory,
} from '@l2beat/shared/frontend'
import {
  getOssificationSentiment,
  OSSIFICATION_BAND_MEANING,
  OSSIFICATION_SCORE_BANDS,
  type UnixTime,
} from '@l2beat/shared-pure'
import type {
  GardenListing,
  ProjectCrops,
  ProjectGarden,
  ProjectOpenSourceCropEvaluation,
  ResolvedCropEvaluation,
  ResolvedCrops,
} from '../types'
import { OSI_LICENSES, type OsiLicense, type OsiLicenseId } from './osiLicenses'

// Config leaves a crop's defaults implicit, and Security also depends on the
// project's ossification score, which grows every day without a critical
// change. So the site and the CROPS API resolve the verdict when they serve
// it: stored with the cached config build, it would go stale.

export function resolveGarden(
  project: {
    crops: ProjectCrops
    ossificationHistory?: OssificationHistory | undefined
  },
  now: UnixTime,
): ProjectGarden {
  const score = scoreOssification(project.ossificationHistory, now)
  const crops: ResolvedCrops = {
    censorshipResistance: resolveCropEvaluation(
      project.crops.censorshipResistance,
    ),
    openSource: resolveCropEvaluation(project.crops.openSource),
    privacy: resolveCropEvaluation(project.crops.privacy),
    security: capByOssification(
      resolveCropEvaluation(project.crops.security),
      score,
    ),
  }
  return { crops, listing: getGardenListing(crops, score) }
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
 * Undefined without an ossification history, and while a critical contract is
 * unverified: unverified code cannot be scored, as the ossification table says.
 */
function scoreOssification(
  history: OssificationHistory | undefined,
  now: UnixTime,
): number | undefined {
  if (!history) {
    return undefined
  }
  const { score, contracts } = measureOssification(history, now)
  return contracts.every((c) => c.isVerified) ? score : undefined
}

const SENTIMENT_RANK = { bad: 0, warning: 1, good: 2 } as const

/**
 * Security is rated no better than its ossification score allows, and a
 * capped crop says why, so the rating never contradicts its own findings. The
 * score resets with every critical change, so an upgrade pulls a project out
 * of the garden until the new code has been live for a few weeks. A score
 * below the warning band is itself a finding, so it grades an ungraded
 * Security bad, as partially reviewed. Without a score, Security says the
 * ossification is not reviewed yet.
 */
function capByOssification(
  security: ResolvedCropEvaluation,
  score: number | undefined,
): ResolvedCropEvaluation {
  if (score === undefined) {
    return {
      ...security,
      notReviewed: [...security.notReviewed, 'Ossification score.'],
    }
  }
  const cap = getOssificationSentiment(score)
  const reason =
    cap === 'warning'
      ? `Ossification score below ${OSSIFICATION_SCORE_BANDS.good}, which takes ${OSSIFICATION_BAND_MEANING.good}.`
      : `Ossification score below ${OSSIFICATION_SCORE_BANDS.warning}, which means ${OSSIFICATION_BAND_MEANING.warning}.`
  const capped = { ...security, missing: [reason, ...security.missing] }
  if (security.sentiment === 'neutral') {
    return cap === 'bad'
      ? { ...capped, sentiment: 'bad', status: 'partiallyReviewed' }
      : security
  }
  if (SENTIMENT_RANK[security.sentiment] <= SENTIMENT_RANK[cap]) {
    return security
  }
  return { ...capped, sentiment: cap }
}

/**
 * A single red crop keeps a project out, whatever the other three say, and so
 * does a missing ossification score, which Security needs. The project is
 * still reviewed, and its project page still shows the evaluation.
 */
function getGardenListing(
  crops: ResolvedCrops,
  score: number | undefined,
): GardenListing {
  if (Object.values(crops).some((crop) => crop.sentiment === 'bad')) {
    return 'ratedBad'
  }
  return score === undefined ? 'noOssificationScore' : 'listed'
}

/** Throws rather than serve a green Open source crop nothing backs. */
function getOsiLicense(id: OsiLicenseId): OsiLicense {
  const license: OsiLicense | undefined = OSI_LICENSES[id]
  if (!license) {
    throw new Error(
      'Not an OSI-approved license. Only licenses from https://opensource.org/licenses can back the Open source crop.',
      { cause: { id } },
    )
  }
  return license
}
