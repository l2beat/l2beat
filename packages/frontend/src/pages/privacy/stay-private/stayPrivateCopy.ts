import type { PrivacyAdversarySentiment } from '@l2beat/config'
import { formatInteger } from '@l2beat/shared-pure'
import type { PrivacyAdviceProtocol } from '~/server/features/privacy/advice/getPrivacyAdviceData'
import { PRIVACY_ADVICE_TITLE } from '../methodology/paths'
import type { AdvicePathAdversary } from './advicePaths'
import { CRITERIA, type CriterionId, type TradeOff } from './rankProtocols'

/** Copy shared by the guide and its markdown alternate. */
export const STAY_PRIVATE = {
  title: PRIVACY_ADVICE_TITLE,
  description:
    'Say what matters to you. We compare the privacy protocols we review on our published data, list every one that fits with what it trades off, and give the steps for the one you choose.',
  goalQuestion: 'What matters to you?',
  filtersLabel: 'Narrow down',
  anyOption: 'Any',
  kindLabel: 'Kind',
  assetLabel: 'Asset',
  chainLabel: 'Chain',
  filtersNote:
    'Assets and chains are those we track deposits of, by token symbol. A protocol may support more.',
  rankingQuestion: 'Protocols by your criteria',
  rankedBy: 'Ranked by',
  rankingNotes: [
    'Each criterion only breaks ties of the one before. Nothing is weighted, and missing data always ranks below data.',
    "Ratings grade each protocol's own promise, which differs between kinds, and anonymity sets count different things per kind. Narrow down by kind to compare like with like.",
    'Value secured is shown for context and never ranked: it does not measure privacy.',
  ],
  bestFit: 'Fits your criteria best by our data',
  tradeOffsLabel: 'Trade-offs',
  noTradeOffs: 'None against the others listed',
  seeSteps: 'See the steps',
  stepsShown: 'Steps shown below',
  excludedTitle: 'Ruled out by your filters',
  uncheckedTitle: 'Not checked: we lack the data',
  noneQualify: 'No protocol we review fits these filters by our data.',
  pathTitle: 'Steps',
  pickProtocol: 'Choose a protocol above to see the steps from our review.',
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
  kindParam: 'kind',
  assetParam: 'asset',
  chainParam: 'chain',
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

/** "Fewest red ratings, then most green ratings, then largest anonymity set." */
export function getRankedByText(order: CriterionId[]): string {
  const labels = order.map((id, i) =>
    i === 0 ? CRITERIA[id].label : CRITERIA[id].label.toLowerCase(),
  )
  return `${labels.join(', then ')}.`
}

/** A protocol's value for one criterion, as the ranking reads it. */
export function formatCriterionValue(
  id: CriterionId,
  p: PrivacyAdviceProtocol,
): string {
  switch (id) {
    case 'fewerRed':
      return `${countRatings(p, 'bad')} red`
    case 'moreGreen':
      return `${countRatings(p, 'good')} green`
    case 'anonymitySet':
      return p.anonymitySetSize === undefined
        ? 'no anonymity set count'
        : `anonymity set ${formatInteger(p.anonymitySetSize)}`
    case 'noWait':
      return p.steps.some((s) => s.randomWait) ? 'random wait' : 'no wait'
    case 'fewerOutside': {
      const n = p.steps.filter((s) => s.outside).length
      return `${n} outside the app`
    }
    case 'fewerSteps':
      return `${p.steps.length} ${p.steps.length === 1 ? 'step' : 'steps'}`
    case 'insider':
      return `insider ${SENTIMENT_WORD[p.sentiments.privilegedInsider]}`
    case 'exitWindow':
      return `exit window ${p.exitWindow.value}`
  }
}

/** A trade-off in words, e.g. "Smaller anonymity set". */
export function formatTradeOff(tradeOff: TradeOff): string {
  const criterion = CRITERIA[tradeOff.criterion]
  return tradeOff.kind === 'worse'
    ? criterion.worse
    : (criterion.noData ?? criterion.worse)
}

const SENTIMENT_WORD: Record<PrivacyAdversarySentiment, string> = {
  good: 'green',
  warning: 'yellow',
  bad: 'red',
}

function countRatings(
  p: PrivacyAdviceProtocol,
  sentiment: PrivacyAdversarySentiment,
) {
  return Object.values(p.sentiments).filter((s) => s === sentiment).length
}
