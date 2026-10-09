import type {
  OsiLicense,
  ProjectCropSentiment,
  ProjectCropStatus,
  ProjectCrops,
} from '@l2beat/config'
import { formatCurrency } from '@l2beat/shared-pure'
import { formatTimestamp } from '~/utils/dates'

// The site's vocabulary for a crop. Config declares a crop with optional
// fields; resolveCrops.ts on the server fills them in to the shapes below.
// Values live here rather than in @l2beat/config because client components
// import this file and the browser cannot load a value from the CommonJS
// config build (it broke hydration once, see the history of this file).

export type CropKey = keyof ProjectCrops

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

export type ResolvedCrops = Record<CropKey, ResolvedCropEvaluation>

export interface CropDefinition {
  key: CropKey
  /** The chip under the plant. */
  letter: string
  label: string
  /** A standing caveat, shown above the findings wherever the crop is explained. */
  note?: string
}

export const CROP_COLUMNS: CropDefinition[] = [
  {
    key: 'censorshipResistance',
    letter: 'CR',
    label: 'Censorship resistance',
  },
  {
    key: 'openSource',
    letter: 'O',
    label: 'Open source',
  },
  {
    key: 'privacy',
    letter: 'P',
    label: 'Privacy',
  },
  {
    key: 'security',
    letter: 'S',
    label: 'Security',
    note: "Security is a complex property. We evaluate if the projects follow best practices. This is not an audit or an endorsement of a protocol's security, and never a guarantee that funds are safe.",
  },
]

export const CROP_SENTIMENT_LABELS: Record<CropSentiment, string> = {
  good: 'Good',
  warning: 'Medium',
  bad: 'Bad',
  neutral: 'Neutral',
}

export const CROP_STATUS_LABELS: Record<ProjectCropStatus, string> = {
  reviewed: 'Reviewed',
  partiallyReviewed: 'Partially reviewed',
  notReviewed: 'Not reviewed',
  fullyTransparent: 'Fully transparent',
}

export function getCropStatusText(
  status: ProjectCropStatus,
  sentiment: CropSentiment,
): string {
  if (status === 'notReviewed') {
    return CROP_STATUS_LABELS.notReviewed
  }
  if (status === 'fullyTransparent') {
    return CROP_STATUS_LABELS.fullyTransparent
  }
  if (status === 'partiallyReviewed') {
    return `${CROP_SENTIMENT_LABELS[sentiment]} · ${CROP_STATUS_LABELS.partiallyReviewed}`
  }
  return CROP_SENTIMENT_LABELS[sentiment]
}

/** Whether a reviewed project is listed in the garden, and if not, why. */
export type GardenListing = 'listed' | 'ratedBad' | 'noOssificationScore'

/** The measured ossification of a project, shown with its Security crop. */
export interface CropOssification {
  score: number
  isUnverified: boolean
  /** Unix seconds: the last critical change, or the start of tracking if there was none */
  unchangedSince: number
  /** USD·years; null when it cannot be measured */
  exposure: number | null
}

export function getCropOssificationLines(
  ossification: CropOssification,
): string[] {
  const { score, isUnverified, unchangedSince, exposure } = ossification
  return [
    isUnverified
      ? 'No score: some critical contracts are unverified.'
      : `Score: ${score} of 100.`,
    `No critical change since ${formatTimestamp(unchangedSince, { mode: 'date' })}.`,
    ...(exposure !== null
      ? [`Battle-tested exposure: ${formatCurrency(exposure, 'usd')}·years.`]
      : []),
  ]
}

/** A crop's definition and its evaluation together, in garden order. */
export interface CropEntry {
  definition: CropDefinition
  evaluation: ResolvedCropEvaluation
  /** Only on the Security crop, for projects whose ossification we measure. */
  ossification?: CropOssification
}

export function toCropEntries(
  crops: ResolvedCrops,
  ossification?: CropOssification,
): CropEntry[] {
  return CROP_COLUMNS.map((definition) => ({
    definition,
    evaluation: crops[definition.key],
    ...(definition.key === 'security' && ossification ? { ossification } : {}),
  }))
}
