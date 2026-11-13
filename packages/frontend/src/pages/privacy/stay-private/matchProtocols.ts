import type {
  PrivacyAdversary,
  PrivacyAdversaryId,
  PrivacyAdversarySentiment,
  PrivacyAdviceStep,
} from '@l2beat/config'
import {
  type AdviceAccepts,
  type AdvicePath,
  type AdvicePathAdversary,
  getAdvicePath,
} from './advicePaths'

/**
 * Matches the protocols of one need against a user's choices, using only our
 * published ratings. Nothing is scored across adversaries we picked: the user
 * names the adversaries, and a protocol lands in the group its ratings against
 * those adversaries give. A rating that assumes a step the user ruled out is
 * not counted as private.
 */
export function matchProtocols<P extends MatchableProtocol>(
  protocols: P[],
  adversaries: PrivacyAdversary[],
  choices: MatchChoices,
): ProtocolMatches<P> {
  const groups: Record<MatchGroupId, ProtocolMatch<P>[]> = {
    private: [],
    atRisk: [],
    exposed: [],
  }
  const excluded: FilteredProtocol<P>[] = []
  const unchecked: FilteredProtocol<P>[] = []

  for (const protocol of protocols) {
    if (protocol.needId !== choices.need) continue
    const filter = applyFilters(protocol, choices)
    if (filter.kind === 'excluded') {
      excluded.push({ protocol, reason: filter.reason })
      continue
    }
    if (filter.kind === 'unchecked') {
      unchecked.push({ protocol, reason: filter.reason })
      continue
    }
    const path = getAdvicePath(
      protocol.steps as P['steps'],
      choices.accepts,
      adversaries,
      protocol.sentiments,
    )
    const chosen = path.adversaries.filter((row) =>
      choices.from.includes(row.adversary.id),
    )
    groups[getGroup(chosen)].push({ protocol, path, chosen })
  }

  for (const group of Object.values(groups)) group.sort(compareMatches)
  return { groups, excluded, unchecked }
}

/** What a protocol needs to be matched, all of it published data. */
export interface MatchableProtocol {
  slug: string
  name: string
  /** The need its category serves. Only protocols of one need are compared. */
  needId: string
  steps: PrivacyAdviceStep[]
  sentiments: Record<PrivacyAdversaryId, PrivacyAdversarySentiment>
  /** Unique users over the anonymity set window, absent without a count. */
  anonymitySetSize: number | undefined
  /** The tokens we track deposits of, by symbol, and the chain each is on. */
  holdings: Holding[]
}

export interface Holding {
  symbol: string
  chain: string
}

export interface MatchChoices {
  need: string
  /** The adversaries the user wants to hide from. */
  from: PrivacyAdversaryId[]
  accepts: AdviceAccepts
  /** Absent: any. */
  asset?: string
  chain?: string
}

/**
 * The adversaries chosen before the visitor changes anything: all but the
 * future adversary, which grades a future cryptographic break and not today's
 * protocol. The summary table's sort leaves it out for the same reason.
 */
export function getDefaultFrom(
  adversaries: PrivacyAdversary[],
): PrivacyAdversaryId[] {
  return adversaries.map((a) => a.id).filter((id) => id !== 'futureAdversary')
}

/** Named after the rating words: private, at risk, exposed. */
export const MATCH_GROUP_IDS = ['private', 'atRisk', 'exposed'] as const
export type MatchGroupId = (typeof MATCH_GROUP_IDS)[number]

export interface ProtocolMatch<P extends MatchableProtocol> {
  protocol: P
  /** The steps the user's efforts keep, and every adversary's status. */
  path: AdvicePath<P['steps'][number]>
  /** The rows of the adversaries the user chose. */
  chosen: AdvicePathAdversary[]
}

export interface ProtocolMatches<P extends MatchableProtocol> {
  groups: Record<MatchGroupId, ProtocolMatch<P>[]>
  /** Protocols of the need that the asset or chain filter rules out. */
  excluded: FilteredProtocol<P>[]
  /** Protocols we lack the data to check against a filter. */
  unchecked: FilteredProtocol<P>[]
}

export interface FilteredProtocol<P> {
  protocol: P
  reason: string
}

/**
 * Exposed: a chosen adversary is rated red. Private: every chosen adversary is
 * rated green and no step that rating assumes is left out. At risk: the rest,
 * a yellow rating or one that assumes a step the user ruled out.
 */
function getGroup(chosen: AdvicePathAdversary[]): MatchGroupId {
  if (chosen.some((row) => row.sentiment === 'bad')) return 'exposed'
  return chosen.every(isPrivate) ? 'private' : 'atRisk'
}

export function isPrivate(row: AdvicePathAdversary) {
  return row.sentiment === 'good' && row.status !== 'unrated'
}

/**
 * Within a group, as the summary table sorts: fewer red ratings, then fewer
 * that are not private, counted over the chosen adversaries only. Then the
 * larger anonymity set, where a missing count sorts last, then the name.
 */
function compareMatches<P extends MatchableProtocol>(
  a: ProtocolMatch<P>,
  b: ProtocolMatch<P>,
) {
  const count = (
    m: ProtocolMatch<P>,
    test: (r: AdvicePathAdversary) => boolean,
  ) => m.chosen.filter(test).length
  const isRed = (row: AdvicePathAdversary) => row.sentiment === 'bad'
  const notPrivate = (row: AdvicePathAdversary) => !isPrivate(row)
  return (
    count(a, isRed) - count(b, isRed) ||
    count(a, notPrivate) - count(b, notPrivate) ||
    (b.protocol.anonymitySetSize ?? -1) - (a.protocol.anonymitySetSize ?? -1) ||
    a.protocol.name.localeCompare(b.protocol.name)
  )
}

type FilterResult =
  | { kind: 'qualifies' }
  | { kind: 'excluded' | 'unchecked'; reason: string }

function applyFilters(
  p: MatchableProtocol,
  { asset, chain }: MatchChoices,
): FilterResult {
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

/**
 * The asset and chain choices for one need, from what its protocols hold.
 * Listed by how many protocols hold each, so common ones come first.
 */
export function getHoldingOptions(
  protocols: MatchableProtocol[],
  need: string,
): { assets: string[]; chains: string[] } {
  const ofNeed = protocols.filter((p) => p.needId === need)
  const byHolders = (pick: (h: Holding) => string) => {
    const counts = new Map<string, number>()
    for (const protocol of ofNeed) {
      for (const value of new Set(protocol.holdings.map(pick))) {
        counts.set(value, (counts.get(value) ?? 0) + 1)
      }
    }
    return [...counts.keys()].sort(
      (a, b) =>
        (counts.get(b) ?? 0) - (counts.get(a) ?? 0) || a.localeCompare(b),
    )
  }
  return {
    assets: byHolders((h) => h.symbol),
    chains: byHolders((h) => h.chain),
  }
}
