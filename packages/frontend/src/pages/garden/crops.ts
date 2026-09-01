import type { ProjectCropStatus, Sentiment } from '@l2beat/config'
import type { CropKey } from '@l2beat/config/build/crops/canonicalCrops'

// The words the garden puts on screen.
//
// Keep them here rather than in @l2beat/config: this module is imported by
// client components, and tsc emits `export const` from config as
// `exports.X = void 0` followed by an assignment, which cjs-module-lexer cannot
// see. A browser import of the built file then fails to find the named export,
// which throws during hydration and silently kills every interactive element on
// the page - not just the ones that read these constants.

export interface CropDefinition {
  key: CropKey
  /** The letter in the chip under each plant. */
  letter: string
  label: string
  /**
   * Shown above the findings wherever this crop is explained - the tooltip,
   * the project page, and the criteria card. For a crop whose plant a reader
   * could mistake for a promise, this is where we say what it is not.
   */
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

/** The colour/quality of a crop, independent of how thoroughly it was reviewed. */
export const CROP_SENTIMENT_LABELS: Record<Sentiment, string> = {
  good: 'Good',
  warning: 'Medium',
  bad: 'Bad',
  neutral: 'Neutral',
  UnderReview: 'Under review',
}

/** The review state of a crop, independent of its sentiment/colour. */
export const CROP_STATUS_LABELS: Record<ProjectCropStatus, string> = {
  reviewed: 'Reviewed',
  partiallyReviewed: 'Partially reviewed',
  notReviewed: 'Not reviewed',
  fullyTransparent: 'Fully transparent',
}
