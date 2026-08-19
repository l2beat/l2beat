import type { ProjectCropStatus, Sentiment } from '@l2beat/config'
import type { CropKey } from '@l2beat/config/build/crops/canonicalCrops'

// The words the garden puts on screen. They live here, in the frontend, rather
// than in @l2beat/config, because this module is imported by client components:
// tsc emits `export const` from config as `exports.X = void 0` followed by an
// assignment, which cjs-module-lexer cannot see, so a browser import of the
// built file fails to find the named export and takes hydration down with it.
// The public API imports these from here, so there is still one definition.

export interface CropDefinition {
  key: CropKey
  /** The letter in the chip under each plant. */
  letter: string
  label: string
  /** What the crop asks of a protocol, in one sentence. */
  description: string
}

export const CROP_COLUMNS: CropDefinition[] = [
  {
    key: 'censorshipResistance',
    letter: 'CR',
    label: 'Censorship resistance',
    description:
      'Whether a user can transact without anyone being able to stop them: no gatekeeper on the path, no permission that can freeze or exclude an address, and a way out that does not depend on the operator staying cooperative.',
  },
  {
    key: 'openSource',
    letter: 'O',
    label: 'Open source',
    description:
      'Whether what runs is what is published: source available under a license that permits use and review, matching the deployed bytecode, and buildable by someone outside the team.',
  },
  {
    key: 'privacy',
    letter: 'P',
    label: 'Privacy',
    description:
      'Whether using the protocol reveals more than it has to: what an observer learns about amounts, counterparties and history, and how much of that leaks through the parts users actually touch.',
  },
  {
    key: 'security',
    letter: 'S',
    label: 'Security',
    description:
      'Whether the funds and the guarantees hold under pressure: who can upgrade or seize, what a compromised key can do, how much delay a user gets to react, and what has been independently reviewed.',
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
}
