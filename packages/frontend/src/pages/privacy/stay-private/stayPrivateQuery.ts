import type { PrivacyAdversary, PrivacyNeed } from '@l2beat/config'
import { ADVICE_EFFORT_IDS, isAdviceEffortId } from './advicePaths'
import {
  getDefaultFrom,
  getHoldingOptions,
  type MatchableProtocol,
  type MatchChoices,
} from './matchProtocols'

/** What a shared link asks for. Unknown values fall back instead of failing. */
export interface StayPrivateQuery {
  need?: string
  /** Adversary ids, comma-separated. Absent: the default ones. */
  from?: string
  /** Effort ids the user refuses, comma-separated. Absent: none. */
  without?: string
  asset?: string
  chain?: string
  protocol?: string
}

interface QueryContext {
  needs: PrivacyNeed[]
  adversaries: PrivacyAdversary[]
  protocols: MatchableProtocol[]
}

/**
 * The defaults are the first need, the default adversaries and every effort,
 * so every step of our advice is taken.
 */
export function parseStayPrivateQuery(
  query: StayPrivateQuery,
  { needs, adversaries, protocols }: QueryContext,
): { choices: MatchChoices; protocol: string | undefined } {
  const need = needs.find((n) => n.id === query.need)?.id ?? needs[0]?.id ?? ''
  const asked = split(query.from)
  const from = adversaries.map((a) => a.id).filter((id) => asked.includes(id))
  const without = split(query.without).filter(isAdviceEffortId)
  const options = getHoldingOptions(protocols, need)
  const protocol = protocols.find(
    (p) => p.slug === query.protocol && p.needId === need,
  )
  return {
    choices: {
      need,
      from: from.length > 0 ? from : getDefaultFrom(adversaries),
      accepts: {
        wait: !without.includes('wait'),
        outside: !without.includes('outside'),
      },
      asset: oneOf(query.asset, options.assets),
      chain: oneOf(query.chain, options.chains),
    },
    protocol: protocol?.slug,
  }
}

/** The query that reopens the same choices. Defaults are left out. */
export function toStayPrivateQuery(
  choices: MatchChoices,
  protocol: string | undefined,
  adversaries: PrivacyAdversary[],
): StayPrivateQuery {
  const without = ADVICE_EFFORT_IDS.filter((id) => !choices.accepts[id])
  // An empty choice is not a link worth sharing, so it reopens the default.
  const changed =
    choices.from.length > 0 &&
    choices.from.join() !== getDefaultFrom(adversaries).join()
  return {
    need: choices.need,
    ...(changed && { from: choices.from.join(',') }),
    ...(without.length > 0 && { without: without.join(',') }),
    ...(choices.asset && { asset: choices.asset }),
    ...(choices.chain && { chain: choices.chain }),
    ...(protocol && { protocol }),
  }
}

function split(value: string | undefined) {
  return value ? value.split(',') : []
}

function oneOf(value: string | undefined, allowed: string[]) {
  return value !== undefined && allowed.includes(value) ? value : undefined
}
