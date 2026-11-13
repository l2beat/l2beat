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
  effortQuestion: 'What can you do?',
  effortNote:
    'Our ratings assume every step of our advice. Without an effort, the steps that need it are left out and the ratings they defend are not shown.',
  filtersLabel: 'Narrow down',
  anyOption: 'Any',
  assetLabel: 'Asset',
  chainLabel: 'Chain',
  filtersNote:
    'Assets and chains are those we track deposits of, by token symbol. A protocol may support more.',
  choicesTitle: 'Your choices',
  resetChoices: 'Reset',
  matchesTitle: 'Protocols for your choices',
  legend: {
    good: 'Private',
    warning: 'At risk',
    bad: 'Exposed',
    unrated: 'Not rated: assumes a step you ruled out',
    notChosen: 'Faded: not chosen',
  },
  noAdversary: {
    title: 'Choose who should not find out',
    body: 'We rate each protocol against each adversary, so with none chosen there is nothing to match.',
    action: 'Choose all but the future adversary',
  },
  noProtocols: 'We review no protocol for this yet.',
  allFiltered: {
    body: 'A protocol may hold more than we track. The protocols we left out are listed below with the reason.',
    action: 'Clear the asset and chain',
  },
  noFullMatch: {
    title: 'No protocol keeps this private from everyone you chose',
    withRelaxations:
      'Every protocol below is at risk from or exposed to at least one of them. One change to your choices would give a full match:',
    withoutRelaxations:
      'Every protocol below is at risk from or exposed to at least one of them, and no single change to your choices gives a full match.',
  },
  hideSetup: 'Hide the setup',
  /** Under the legend: what the dots grade, and the order inside a group. */
  matchNote:
    "The dots are our ratings of each protocol's own promise, and promises differ, so read each one. Within a group, fewer red and yellow ratings come first, then the larger anonymity set.",
  groups: {
    private: {
      title: 'Private from everyone you chose',
    },
    atRisk: {
      title: 'At risk from someone you chose',
      note: 'A rating is yellow, or it assumes a step you ruled out.',
    },
    exposed: {
      title: 'Exposed to someone you chose',
      note: 'A rating is red: no step keeps the promise from that adversary.',
    },
  } satisfies Record<MatchGroupId, { title: string; note?: string }>,
  notChosenLabel: 'Not chosen',
  needsLabel: 'needs',
  /** Leads what a path asks for beyond the app: tools, and outside steps that link none. */
  outsideLabel: 'Outside the app',
  nothingOutside: 'nothing',
  seeSetup: 'See the setup',
  excludedTitle: 'Ruled out by your filters',
  uncheckedTitle: 'Not checked: we lack the data',
  setupTitle: 'Setup',
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

/** The line above the groups: how many protocols hold up, out of how many. */
export function getMatchSummary(
  privateCount: number,
  total: number,
  fromCount: number,
) {
  const whom =
    fromCount === 1
      ? 'the adversary you chose'
      : `all ${fromCount} adversaries you chose`
  const protocols = total === 1 ? 'protocol' : 'protocols'
  return `${privateCount} of ${total} ${protocols} keep${privateCount === 1 ? 's' : ''} this private from ${whom}.`
}

/** Why every protocol of a need is ruled out, from the filters set. */
export function getAllFilteredTitle(
  asset: string | undefined,
  chain: string | undefined,
) {
  const what = asset ?? 'anything'
  const where = chain === undefined ? '' : ` on ${capitalize(chain)}`
  return `We track no protocol for this that holds ${what}${where}`
}

export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** Names the adversaries no protocol for the need is private from. */
export function getUncoveredText(labels: string[]) {
  const names = labels.map((l) => `the ${l}`)
  const list =
    names.length < 2
      ? names.join('')
      : `${names.slice(0, -1).join(', ')} or ${names.at(-1)}`
  return `No protocol we review for this keeps it private from ${list}.`
}

export function getMatchCountText(matches: number) {
  return `${matches} ${matches === 1 ? 'match' : 'matches'}`
}

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
