import type { PrivacyAdversarySentiment } from '@l2beat/config'
import { PRIVACY_ADVICE_TITLE } from '../methodology/paths'
import type { AdvicePathAdversary } from './advicePaths'
import type { MatchGroupId } from './matchProtocols'

/** Copy shared by the guide and its markdown alternate. */
export const STAY_PRIVATE = {
  title: PRIVACY_ADVICE_TITLE,
  description:
    'Say what you want to do, who should not find out and what effort you accept. We show which protocols we review keep it private, and the setup for the one you choose.',
  needQuestion: 'What do you want to do?',
  fromQuestion: 'Who should not find out?',
  fromNote:
    'Our five adversaries. Each is a capability, and one party can hold several.',
  fromEmpty: 'Choose at least one adversary.',
  effortQuestion: 'What can you do?',
  effortNote:
    'Our ratings assume every step of our advice. Without an effort, the steps that need it are left out and the ratings they defend are not shown.',
  filtersLabel: 'Narrow down',
  anyOption: 'Any',
  assetLabel: 'Asset',
  chainLabel: 'Chain',
  filtersNote:
    'Assets and chains are those we track deposits of, by token symbol. A protocol may support more.',
  matchesTitle: 'Protocols for your choices',
  matchNotes: [
    "The dots are our ratings of each protocol's own promise against the adversaries you chose. Promises differ, so read each one.",
    'An empty ring means the rating assumes a step you ruled out.',
    'Within a group, protocols with fewer red and yellow ratings come first, then the larger anonymity set.',
  ],
  groups: {
    private: {
      title: 'Private from everyone you chose',
      empty:
        'No protocol we review keeps this private from everyone you chose.',
    },
    atRisk: {
      title: 'At risk from someone you chose',
      note: 'A rating is yellow, or it assumes a step you ruled out.',
    },
    exposed: {
      title: 'Exposed to someone you chose',
      note: 'A rating is red: no step keeps the promise from that adversary.',
    },
  } satisfies Record<
    MatchGroupId,
    { title: string; note?: string; empty?: string }
  >,
  notChosenLabel: 'Not chosen',
  needsLabel: 'needs',
  /** Leads what a path asks for beyond the app: tools, and outside steps that link none. */
  outsideLabel: 'Outside the app',
  nothingOutside: 'nothing',
  seeSetup: 'See the setup',
  setupShown: 'Setup shown below',
  excludedTitle: 'Ruled out by your filters',
  uncheckedTitle: 'Not checked: we lack the data',
  setupTitle: 'Setup',
  pickProtocol: 'Choose a protocol above to see its setup from our review.',
  toolsTitle: 'What you need',
  stepsTitle: 'Steps',
  noSteps:
    'Our review has no advice for this protocol, since no step changes a rating.',
  skippedLabel: 'Left out',
  defendsTitle: 'Adversaries',
  costsTitle: 'What leaving an effort out costs',
  costsHeaders: ['Without', 'Steps left out', 'No longer rated'],
  referenceAppLabel: 'Steps assume',
  anonymitySetLabel: 'Anonymity set',
  exitWindowLabel: 'Exit window',
  operatorTitle: 'What the operator can see or change',
  underReview:
    'This review is being updated. The steps and ratings may change.',
  fullReview: 'Full review',
  notAnAudit:
    'Our reading of public code, onchain data and the apps we traced. Not an audit and not an endorsement.',
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

/** A row's line for a protocol whose taken steps include a random wait. */
export function getWaitText(windowDays: number) {
  return `random wait, up to ${windowDays} days`
}
