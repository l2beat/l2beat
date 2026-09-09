import type { ProjectCropStatus } from '@l2beat/config'
import type {
  CropKey,
  CropSentiment,
} from '@l2beat/config/build/crops/canonicalCrops'

// The words the garden puts on screen.
//
// Kept here rather than in @l2beat/config because this module is imported by
// client components, and a value import of the config build breaks hydration:
// tsc emits `exports.X = void 0` followed by an assignment, which
// cjs-module-lexer cannot see, so the browser finds no named export. Types
// from config are fine - they are erased.

export interface CropDefinition {
  key: CropKey
  /** The letters in the chip under each plant. */
  letter: string
  label: string
  /**
   * Shown above the findings wherever this crop is explained - the tooltip,
   * the project page, and the criteria card. For a crop whose plant a reader
   * could mistake for a promise, this is where we say what it is not.
   */
  note?: string
}

/** The four crops, in the order they are rendered everywhere. */
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

/** The colour/quality of a crop, independent of how thoroughly it was reviewed. */
export const CROP_SENTIMENT_LABELS: Record<CropSentiment, string> = {
  good: 'Good',
  warning: 'Medium',
  bad: 'Bad',
  neutral: 'Neutral',
}

/** The review state of a crop, independent of its sentiment/colour. */
export const CROP_STATUS_LABELS: Record<ProjectCropStatus, string> = {
  reviewed: 'Reviewed',
  partiallyReviewed: 'Partially reviewed',
  notReviewed: 'Not reviewed',
  fullyTransparent: 'Fully transparent',
}
