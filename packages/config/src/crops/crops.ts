import {
  GRADED_CROP_STATUSES,
  PROJECT_CROP_SENTIMENTS,
  UNGRADED_CROP_STATUSES,
} from '../types'

// The vocabulary of a resolved crop. Resolution itself - defaults, licences,
// who qualifies for the garden - is done by the frontend and by crops-api,
// each in its own copy, so that config stays data and types.

/** The four crops, in the order they are rendered and served. */
export const CROP_KEYS = [
  'censorshipResistance',
  'openSource',
  'privacy',
  'security',
] as const

export type CropKey = (typeof CROP_KEYS)[number]

/** `neutral` is never declared in config: it is what an ungraded crop resolves to. */
export const CROP_SENTIMENTS = [...PROJECT_CROP_SENTIMENTS, 'neutral'] as const
export type CropSentiment = (typeof CROP_SENTIMENTS)[number]

export const CROP_STATUSES = [
  ...GRADED_CROP_STATUSES,
  ...UNGRADED_CROP_STATUSES,
] as const
export type CropStatus = (typeof CROP_STATUSES)[number]
