import type { OssificationHistory } from '@l2beat/shared/frontend'
import {
  OSSIFICATION_BAND_MEANING,
  OSSIFICATION_SCORE_BANDS,
  type OssificationBand,
} from '@l2beat/shared-pure'
import type {
  GardenListing,
  GardenVerdict,
  ProjectCrops,
  ProjectDefiInfo,
  ProjectGarden,
  ProjectOpenSourceCropEvaluation,
  ProjectPrivacyInfo,
  ProjectScalingInfo,
  ResolvedCropEvaluation,
  ResolvedCrops,
} from '../types'
import { OSI_LICENSES, type OsiLicense, type OsiLicenseId } from './osiLicenses'

// Config leaves a crop's defaults implicit, and Security also depends on the
// project's ossification score, which grows every day without a critical
// change. The build cannot know the score a reader will see, so it resolves a
// verdict for every band, and the site and the CROPS API read the one their
// own `now` falls in.

export function resolveGarden(project: {
  slug: string
  crops: ProjectCrops
  privacyInfo?: ProjectPrivacyInfo | undefined
  scalingInfo?: ProjectScalingInfo | undefined
  defiInfo?: ProjectDefiInfo | undefined
  ossificationHistory?: OssificationHistory | undefined
}): ProjectGarden {
  const crops: ResolvedCrops = {
    censorshipResistance: resolveCropEvaluation(
      project.crops.censorshipResistance,
    ),
    openSource: resolveCropEvaluation(project.crops.openSource),
    privacy: resolveCropEvaluation(project.crops.privacy),
    security: resolveCropEvaluation(project.crops.security),
  }
  return {
    path: getGardenProjectPath(project),
    verdicts: {
      good: resolveVerdict(crops, 'good'),
      warning: resolveVerdict(crops, 'warning'),
      bad: resolveVerdict(crops, 'bad'),
      unscored: resolveVerdict(crops, 'unscored'),
    },
  }
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

function resolveVerdict(
  crops: ResolvedCrops,
  band: OssificationBand,
): GardenVerdict {
  const capped = { ...crops, security: capByOssification(crops.security, band) }
  return { crops: capped, listing: getGardenListing(capped, band) }
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
  band: OssificationBand,
): ResolvedCropEvaluation {
  if (band === 'unscored') {
    return {
      ...security,
      notReviewed: [...security.notReviewed, 'Ossification score.'],
    }
  }
  const reason =
    band === 'warning'
      ? `Ossification score below ${OSSIFICATION_SCORE_BANDS.good}, which takes ${OSSIFICATION_BAND_MEANING.good}.`
      : `Ossification score below ${OSSIFICATION_SCORE_BANDS.warning}, which means ${OSSIFICATION_BAND_MEANING.warning}.`
  const capped = { ...security, missing: [reason, ...security.missing] }
  if (security.sentiment === 'neutral') {
    return band === 'bad'
      ? { ...capped, sentiment: 'bad', status: 'partiallyReviewed' }
      : security
  }
  if (SENTIMENT_RANK[security.sentiment] <= SENTIMENT_RANK[band]) {
    return security
  }
  return { ...capped, sentiment: band }
}

/**
 * A single red crop keeps a project out, whatever the other three say, and so
 * does a missing ossification score, which Security needs. The project is
 * still reviewed, and its project page still shows the evaluation.
 */
function getGardenListing(
  crops: ResolvedCrops,
  band: OssificationBand,
): GardenListing {
  if (Object.values(crops).some((crop) => crop.sentiment === 'bad')) {
    return 'ratedBad'
  }
  return band === 'unscored' ? 'noOssificationScore' : 'listed'
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

/**
 * The l2beat.com page a reviewed project has, or null when it has none, so a
 * link never leads to a missing page. DeFi pages are off in production, but a
 * project the ossification table measures gets one, so a DeFi project has a
 * page exactly when it has an ossification history.
 */
function getGardenProjectPath(project: {
  slug: string
  privacyInfo?: ProjectPrivacyInfo | undefined
  scalingInfo?: ProjectScalingInfo | undefined
  defiInfo?: ProjectDefiInfo | undefined
  ossificationHistory?: OssificationHistory | undefined
}): string | null {
  if (project.privacyInfo) {
    return `/privacy/projects/${project.slug}`
  }
  if (project.scalingInfo) {
    return `/layer2s/projects/${project.slug}`
  }
  if (project.defiInfo && project.ossificationHistory !== undefined) {
    return `/defi/projects/${project.slug}`
  }
  return null
}
