import type { PrivacyAdversary } from '@l2beat/config'
import { ADVICE_EFFORT_IDS, type AdviceEffortId } from './advicePaths'
import {
  isPrivate,
  MATCH_GROUP_IDS,
  type MatchableProtocol,
  type MatchChoices,
  matchProtocols,
  type ProtocolMatches,
} from './matchProtocols'

/**
 * One change to the user's choices that would leave at least one protocol
 * private from everyone still chosen. Offered when nothing matches fully, so
 * the user sees what to give up instead of a dead end. Only single changes
 * are offered: each says exactly what it costs.
 */
export type ChoiceRelaxation =
  | {
      kind: 'drop'
      adversary: PrivacyAdversary
      next: MatchChoices
      matches: number
    }
  | {
      kind: 'accept'
      effort: AdviceEffortId
      next: MatchChoices
      matches: number
    }
  | { kind: 'clearFilters'; next: MatchChoices; matches: number }

/**
 * Every single change that yields a full match, the most matches first. The
 * order among equal counts is the rosette's, then efforts, then filters, so
 * the list never ranks one adversary above another by anything of ours.
 */
export function getChoiceRelaxations(
  protocols: MatchableProtocol[],
  adversaries: PrivacyAdversary[],
  choices: MatchChoices,
): ChoiceRelaxation[] {
  const countPrivate = (next: MatchChoices) =>
    matchProtocols(protocols, adversaries, next).groups.private.length

  const drops: ChoiceRelaxation[] =
    // Dropping the only adversary leaves nothing to be private from.
    choices.from.length < 2
      ? []
      : adversaries
          .filter((a) => choices.from.includes(a.id))
          .map((adversary) => {
            const next = {
              ...choices,
              from: choices.from.filter((id) => id !== adversary.id),
            }
            return {
              kind: 'drop',
              adversary,
              next,
              matches: countPrivate(next),
            }
          })

  const accepts: ChoiceRelaxation[] = ADVICE_EFFORT_IDS.filter(
    (id) => !choices.accepts[id],
  ).map((effort) => {
    const next = { ...choices, accepts: { ...choices.accepts, [effort]: true } }
    return { kind: 'accept', effort, next, matches: countPrivate(next) }
  })

  const filters: ChoiceRelaxation[] =
    choices.asset === undefined && choices.chain === undefined
      ? []
      : [
          (() => {
            const next = { ...choices, asset: undefined, chain: undefined }
            return { kind: 'clearFilters', next, matches: countPrivate(next) }
          })(),
        ]

  return [...drops, ...accepts, ...filters]
    .filter((r) => r.matches > 0)
    .sort((a, b) => b.matches - a.matches)
}

/**
 * The chosen adversaries that no listed protocol keeps the user private from.
 * When nothing matches fully, these are why, and no protocol choice fixes them.
 */
export function getUncoveredAdversaries<P extends MatchableProtocol>(
  matches: ProtocolMatches<P>,
): PrivacyAdversary[] {
  const rows = MATCH_GROUP_IDS.flatMap((id) => matches.groups[id])
  const first = rows[0]
  if (!first) return []
  return first.chosen
    .map((row) => row.adversary)
    .filter(
      (adversary) =>
        !rows.some((m) =>
          m.chosen.some((r) => r.adversary.id === adversary.id && isPrivate(r)),
        ),
    )
}
