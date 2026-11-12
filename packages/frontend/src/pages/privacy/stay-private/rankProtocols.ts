import type {
  PrivacyAdversaryId,
  PrivacyAdversarySentiment,
  PrivacyAdviceStep,
} from '@l2beat/config'
import type { AdviceGoalId } from './advicePaths'

/**
 * Ranks privacy protocols for one user's criteria using only published data.
 * Each goal compares a fixed list of criteria in order, the next breaking ties
 * of the one before, so a rank can always be explained by the values shown.
 * Nothing is weighted or hand-picked. A protocol with no data for a criterion
 * ranks below every protocol with data, so a gap never helps it.
 */
export function rankProtocols<P extends RankableProtocol>(
  protocols: P[],
  criteria: RankingCriteria,
): ProtocolRanking<P> {
  const excluded: FilteredProtocol<P>[] = []
  const unchecked: FilteredProtocol<P>[] = []
  const qualifying: P[] = []
  for (const protocol of protocols) {
    const filter = applyFilters(protocol, criteria)
    if (filter.kind === 'excluded')
      excluded.push({ protocol, reason: filter.reason })
    else if (filter.kind === 'unchecked')
      unchecked.push({ protocol, reason: filter.reason })
    else qualifying.push(protocol)
  }

  const order = GOAL_CRITERIA[criteria.goal]
  const scoreOf = (p: P, id: CriterionId) => CRITERIA[id].score(p)
  const compare = (a: P, b: P) => {
    for (const id of order) {
      const diff = compareScores(scoreOf(a, id), scoreOf(b, id))
      if (diff !== 0) return diff
    }
    return 0
  }

  const best = Object.fromEntries(
    ALL_CRITERIA.map((id) => [
      id,
      Math.max(
        ...qualifying.map((p) => scoreOf(p, id)).filter((s) => s !== undefined),
      ),
    ]),
  ) as Record<CriterionId, number>

  const ranked = qualifying
    .map((protocol) => ({
      protocol,
      rank:
        1 + qualifying.filter((other) => compare(other, protocol) < 0).length,
      tradeOffs: ALL_CRITERIA.flatMap((id): TradeOff[] => {
        const score = scoreOf(protocol, id)
        if (score === undefined) return [{ criterion: id, kind: 'no-data' }]
        return score < best[id] ? [{ criterion: id, kind: 'worse' }] : []
      }),
    }))
    .sort(
      (a, b) =>
        a.rank - b.rank || a.protocol.name.localeCompare(b.protocol.name),
    )

  return { order, ranked, excluded, unchecked }
}

/** What a protocol needs for the ranking, all of it published data. */
export interface RankableProtocol {
  slug: string
  name: string
  categoryId: string
  categoryLabel: string
  steps: PrivacyAdviceStep[]
  sentiments: Record<PrivacyAdversaryId, PrivacyAdversarySentiment>
  /** Unique users over the anonymity set window, absent without a count. */
  anonymitySetSize: number | undefined
  exitWindowSentiment: PrivacyAdversarySentiment | undefined
  /** The tokens we track deposits of, by symbol, and the chain each is on. */
  holdings: Holding[]
}

export interface Holding {
  symbol: string
  chain: string
}

export interface RankingCriteria {
  goal: AdviceGoalId
  /** Absent: any. */
  kind?: string
  asset?: string
  chain?: string
}

export interface ProtocolRanking<P> {
  /** The criteria the goal compares, in the order that breaks ties. */
  order: CriterionId[]
  /** Every protocol that meets the filters, best first. Ties share a rank. */
  ranked: RankedProtocol<P>[]
  /** Protocols the filters rule out. */
  excluded: FilteredProtocol<P>[]
  /** Protocols we lack the data to check against a filter. */
  unchecked: FilteredProtocol<P>[]
}

export interface RankedProtocol<P> {
  protocol: P
  rank: number
  /** Where it falls short of the best value among the ranked, or has no data. */
  tradeOffs: TradeOff[]
}

export interface TradeOff {
  criterion: CriterionId
  kind: 'worse' | 'no-data'
}

export interface FilteredProtocol<P> {
  protocol: P
  reason: string
}

export const ALL_CRITERIA = [
  'fewerRed',
  'moreGreen',
  'anonymitySet',
  'noWait',
  'fewerOutside',
  'fewerSteps',
  'insider',
  'exitWindow',
] as const
export type CriterionId = (typeof ALL_CRITERIA)[number]

export interface Criterion {
  label: string
  /** Higher is better. Undefined when we have no data. */
  score: (p: RankableProtocol) => number | undefined
  /** The trade-off, said of a protocol that scores below the best. */
  worse: string
  noData?: string
}

export const CRITERIA: Record<CriterionId, Criterion> = {
  fewerRed: {
    label: 'Fewest red ratings',
    score: (p) => -countSentiment(p, 'bad'),
    worse: 'More adversaries rated red',
  },
  moreGreen: {
    label: 'Most green ratings',
    score: (p) => countSentiment(p, 'good'),
    worse: 'Fewer adversaries rated green',
  },
  anonymitySet: {
    label: 'Largest anonymity set',
    score: (p) => p.anonymitySetSize,
    worse: 'Smaller anonymity set',
    noData: 'No anonymity set count',
  },
  noWait: {
    label: 'No random wait',
    score: (p) => (p.steps.some((s) => s.randomWait) ? 0 : 1),
    worse: 'Its advice includes a random wait',
  },
  fewerOutside: {
    label: 'Fewest steps outside the app',
    score: (p) => -p.steps.filter((s) => s.outside).length,
    worse: 'More steps outside the app',
  },
  fewerSteps: {
    label: 'Fewest steps',
    score: (p) => -p.steps.length,
    worse: 'More steps',
  },
  insider: {
    label: 'Best privileged insider rating',
    score: (p) => SENTIMENT_SCORE[p.sentiments.privilegedInsider],
    worse: 'Privileged insider rated lower',
  },
  exitWindow: {
    label: 'Best exit window',
    score: (p) =>
      p.exitWindowSentiment === undefined
        ? undefined
        : SENTIMENT_SCORE[p.exitWindowSentiment],
    worse: 'Exit window rated lower',
    noData: 'No exit window rating',
  },
}

/**
 * The order each goal compares criteria in. The adversary ratings break the
 * remaining ties for every goal, since they are what our reviews grade.
 */
export const GOAL_CRITERIA: Record<AdviceGoalId, CriterionId[]> = {
  private: ['fewerRed', 'moreGreen', 'anonymitySet'],
  fast: ['noWait', 'fewerRed', 'moreGreen', 'anonymitySet'],
  light: ['fewerOutside', 'fewerSteps', 'fewerRed', 'moreGreen'],
  operator: ['insider', 'exitWindow', 'fewerRed', 'moreGreen'],
}

const SENTIMENT_SCORE: Record<PrivacyAdversarySentiment, number> = {
  good: 2,
  warning: 1,
  bad: 0,
}

function countSentiment(
  p: RankableProtocol,
  sentiment: PrivacyAdversarySentiment,
) {
  return Object.values(p.sentiments).filter((s) => s === sentiment).length
}

/** No data sorts after any value, so a gap never lifts a protocol. */
function compareScores(a: number | undefined, b: number | undefined) {
  if (a === undefined) return b === undefined ? 0 : 1
  if (b === undefined) return -1
  return b - a
}

type FilterResult =
  | { kind: 'qualifies' }
  | { kind: 'excluded' | 'unchecked'; reason: string }

function applyFilters(
  p: RankableProtocol,
  { kind, asset, chain }: RankingCriteria,
): FilterResult {
  if (kind !== undefined && p.categoryId !== kind) {
    return { kind: 'excluded', reason: `A ${p.categoryLabel.toLowerCase()}` }
  }
  if (asset === undefined && chain === undefined) return { kind: 'qualifies' }
  // Without tracked assets we cannot say what it holds, which is not "nothing".
  if (p.holdings.length === 0) {
    return { kind: 'unchecked', reason: 'We track no assets in it' }
  }
  const holds = p.holdings.some(
    (h) =>
      (asset === undefined || h.symbol === asset) &&
      (chain === undefined || h.chain === chain),
  )
  if (holds) return { kind: 'qualifies' }
  const reason =
    asset === undefined
      ? `We track nothing of it on ${chain}`
      : `We track no ${asset}${chain === undefined ? '' : ` on ${chain}`} in it`
  return { kind: 'excluded', reason }
}
