import {
  measureOssification,
  type OssificationHistory,
} from '@l2beat/shared/frontend'
import {
  getOssificationSentiment,
  OSSIFICATION_SCORE_BANDS,
  type UnixTime,
} from '@l2beat/shared-pure'
import type {
  ProjectCropSentiment,
  ProjectCropStatus,
  ProjectCrops,
  ProjectDefiInfo,
  ProjectOpenSourceCropEvaluation,
  ProjectPrivacyInfo,
  ProjectScalingInfo,
} from '../types'
import { OSI_LICENSES, type OsiLicense, type OsiLicenseId } from './osiLicenses'

// Config leaves a crop's defaults implicit, and Security also depends on the
// project's measured ossification. This is the one place both are resolved,
// so the site and the CROPS API cannot disagree.

/** `neutral` is never declared in config: it is what an ungraded crop resolves to. */
export type CropSentiment = ProjectCropSentiment | 'neutral'

/** An evaluation with every optional field resolved to a concrete value. */
export interface ResolvedCropEvaluation {
  sentiment: CropSentiment
  status: ProjectCropStatus
  /** Only on the open source crop, once the license is confirmed. */
  license?: OsiLicense
  points: string[]
  missing: string[]
  additionalConsiderations: string[]
  notReviewed: string[]
}

export type ResolvedCrops = Record<keyof ProjectCrops, ResolvedCropEvaluation>

/** Whether a reviewed project is listed in the garden, and if not, why. */
export type GardenListing = 'listed' | 'ratedBad' | 'noOssificationScore'

export function resolveProjectCrops(
  project: {
    crops: ProjectCrops
    ossificationHistory?: OssificationHistory | undefined
  },
  now: UnixTime,
): { crops: ResolvedCrops; listing: GardenListing } {
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
 * The page a reviewed project has on l2beat.com, or null when it has none.
 * Links only to pages that exist, so this never falls back to a scaling url
 * the way the frontend's getProjectUrl does. Whether a DeFi project has a
 * page depends on the site's feature flags, so the caller says.
 */
export function getGardenProjectPath(
  project: {
    slug: string
    privacyInfo?: ProjectPrivacyInfo | undefined
    scalingInfo?: ProjectScalingInfo | undefined
    defiInfo?: ProjectDefiInfo | undefined
  },
  hasDefiPage: boolean,
): string | null {
  if (project.privacyInfo) {
    return `/privacy/projects/${project.slug}`
  }
  if (project.scalingInfo) {
    return `/layer2s/projects/${project.slug}`
  }
  if (project.defiInfo && hasDefiPage) {
    return `/defi/projects/${project.slug}`
  }
  return null
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
 * of the garden until the new code has been live for a few weeks. Without a
 * score, Security says the ossification is not reviewed yet.
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
  if (
    security.sentiment === 'neutral' ||
    SENTIMENT_RANK[security.sentiment] <= SENTIMENT_RANK[cap]
  ) {
    return security
  }
  const reason =
    cap === 'warning'
      ? `Ossification score below ${OSSIFICATION_SCORE_BANDS.good}: critical contracts changed within about the last year.`
      : `Ossification score below ${OSSIFICATION_SCORE_BANDS.warning}: critical contracts changed within roughly the last five weeks.`
  return { ...security, sentiment: cap, missing: [reason, ...security.missing] }
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
