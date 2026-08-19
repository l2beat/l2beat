import type { ProjectCropStatus, Sentiment } from '../types'
import type { CropKey } from './canonicalCrops'

// The words the garden puts on screen, kept next to the data rather than in the
// frontend, because the public API serves them too: an integration should be
// able to build our tooltip without paraphrasing us into something subtly
// different. Dependency-free for the same reason as canonicalCrops.

export interface CropDefinition {
  key: CropKey
  /** The letter in the chip under each plant. */
  letter: string
  label: string
  /** What the crop asks of a protocol, in one sentence. */
  description: string
}

export const CROP_DEFINITIONS: CropDefinition[] = [
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
