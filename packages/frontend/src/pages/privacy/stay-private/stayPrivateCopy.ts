import type { PrivacyAdversarySentiment } from '@l2beat/config'
import { PRIVACY_ADVICE_TITLE } from '../methodology/paths'
import type { AdvicePathAdversary } from './advicePaths'

/** Copy shared by the guide and its markdown alternate. */
export const STAY_PRIVATE = {
  title: PRIVACY_ADVICE_TITLE,
  description:
    'Pick the protocol you use and what matters most to you. You get the steps from our review in order, which adversaries each one defends against, and what a shortcut costs.',
  protocolQuestion: 'Which protocol do you use?',
  protocolNote:
    'Protocols whose review has advice, by name. The order ranks nothing.',
  goalQuestion: 'What matters most to you?',
  pathTitle: 'Your path',
  pickProtocol: 'Pick a protocol to see its path.',
  ratingsNote:
    'The ratings in each review assume every step. A path that leaves a step out is not rated, so the adversaries that step defended show an empty ring.',
  sameAsFull:
    "This protocol's advice has no step that this goal leaves out, so the path is the full one.",
  skippedLabel: 'Left out',
  defendsTitle: 'Adversaries',
  compareTitle: 'Goals compared',
  compareHeaders: ['Goal', 'Steps', 'Left out', 'No longer rated'],
  referenceAppLabel: 'Steps assume',
  anonymitySetLabel: 'Anonymity set',
  exitWindowLabel: 'Exit window',
  operatorTitle: 'What the operator can see or change',
  underReview:
    'This review is being updated. The steps and ratings may change.',
  fullReview: 'Full review',
  notAnAudit:
    'Our reading of public code, onchain data and the apps we traced. Not an audit and not an endorsement.',
  protocolParam: 'protocol',
  goalParam: 'goal',
} as const

/** One row of the adversaries table, in words. */
export function getAdversaryStatusText(row: AdvicePathAdversary): string {
  switch (row.status) {
    case 'rated':
      return `${row.steps.length === 1 ? 'Step' : 'Steps'} ${row.steps.join(', ')}`
    case 'unrated':
      return `Not rated: the rating assumes ${row.skipped.join(', ')}`
    case 'no-step':
      return getNoStepText(row.sentiment)
  }
}

function getNoStepText(sentiment: PrivacyAdversarySentiment) {
  return sentiment === 'good' ? 'Holds without a step' : 'No step helps'
}

/** The wait draws from the window the anonymity set counts, so the count says what waiting buys. */
export function getWaitWindowNote(windowDays: number) {
  return `The random wait is drawn from the same ${windowDays}-day window this count covers.`
}
