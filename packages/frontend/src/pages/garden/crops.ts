import type { ProjectCropStatus } from '@l2beat/config'
import type {
  CropKey,
  CropSentiment,
} from '@l2beat/config/build/crops/canonicalCrops'

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
