import type {
  CropKey,
  CropSentiment,
  ProjectCropStatus,
  ResolvedCrops,
} from '@l2beat/config'

// Kept here rather than in @l2beat/config: client components import this, and
// a value import of the config build breaks hydration (tsc emits
// `exports.X = void 0` then assigns, which cjs-module-lexer cannot see).

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

/** A crop's definition and its evaluation together, in garden order. */
export interface CropEntry {
  definition: CropDefinition
  key: CropKey
  evaluation: ResolvedCrops[CropKey]
  index: number
}

export function toCropEntries(crops: ResolvedCrops): CropEntry[] {
  return CROP_COLUMNS.map((definition, index) => ({
    definition,
    key: definition.key,
    evaluation: crops[definition.key],
    index,
  }))
}
