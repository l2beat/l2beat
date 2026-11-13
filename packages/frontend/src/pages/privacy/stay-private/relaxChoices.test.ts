import type {
  PrivacyAdversary,
  PrivacyAdversaryId,
  PrivacyAdversarySentiment,
  PrivacyAdviceStep,
} from '@l2beat/config'
import { expect } from 'earl'
import { ACCEPT_ALL } from './advicePaths'
import type { MatchableProtocol, MatchChoices } from './matchProtocols'
import { matchProtocols } from './matchProtocols'
import {
  type ChoiceRelaxation,
  getChoiceRelaxations,
  getUncoveredAdversaries,
} from './relaxChoices'

// Method: made-up protocols that each miss a full match by one thing (a
// rating, a refused effort, a filter), so every relaxation offered can be
// traced to the one protocol it would let through.

const IDS = [
  'publicObserver',
  'chainAnalyst',
  'networkObserver',
  'privilegedInsider',
  'futureAdversary',
] as const
const ADVERSARIES = IDS.map((id) => ({ id, label: id }) as PrivacyAdversary)

const ALL_GOOD: Record<PrivacyAdversaryId, PrivacyAdversarySentiment> = {
  publicObserver: 'good',
  chainAnalyst: 'good',
  networkObserver: 'good',
  privilegedInsider: 'good',
  futureAdversary: 'good',
}

const WAIT: PrivacyAdviceStep = {
  name: 'Wait',
  text: '',
  against: ['chainAnalyst'],
  randomWait: true,
}

function protocol(
  slug: string,
  overrides: Partial<MatchableProtocol> = {},
): MatchableProtocol {
  return {
    slug,
    name: slug,
    needId: 'moveFunds',
    steps: [],
    sentiments: ALL_GOOD,
    anonymitySetSize: undefined,
    holdings: [{ symbol: 'ETH', chain: 'ethereum' }],
    ...overrides,
  }
}

function relax(
  protocols: MatchableProtocol[],
  choices: Partial<MatchChoices> = {},
) {
  return getChoiceRelaxations(protocols, ADVERSARIES, {
    need: 'moveFunds',
    from: ['publicObserver', 'chainAnalyst', 'privilegedInsider'],
    accepts: ACCEPT_ALL,
    ...choices,
  }).map(describeRelaxation)
}

function describeRelaxation(r: ChoiceRelaxation) {
  const what =
    r.kind === 'drop'
      ? `drop ${r.adversary.id}`
      : r.kind === 'accept'
        ? `accept ${r.effort}`
        : 'clear filters'
  return `${what}: ${r.matches}`
}

describe(getChoiceRelaxations.name, () => {
  it('offers dropping an adversary only when that leaves a full match, the most matches first', () => {
    const result = relax([
      protocol('insider-a', {
        sentiments: { ...ALL_GOOD, privilegedInsider: 'bad' },
      }),
      protocol('insider-b', {
        sentiments: { ...ALL_GOOD, privilegedInsider: 'warning' },
      }),
      protocol('analyst', {
        sentiments: { ...ALL_GOOD, chainAnalyst: 'bad' },
      }),
      protocol('two-gaps', {
        sentiments: { ...ALL_GOOD, publicObserver: 'bad', chainAnalyst: 'bad' },
      }),
    ])
    expect(result).toEqual([
      'drop privilegedInsider: 2',
      'drop chainAnalyst: 1',
    ])
  })

  it('offers accepting a refused effort when the ratings it assumes would then hold', () => {
    const result = relax([protocol('pool', { steps: [WAIT] })], {
      accepts: { ...ACCEPT_ALL, wait: false },
    })
    expect(result).toEqual(['drop chainAnalyst: 1', 'accept wait: 1'])
  })

  it('offers clearing the filters when a protocol outside them matches', () => {
    const result = relax([protocol('eth-pool')], { asset: 'USDC' })
    expect(result).toEqual(['clear filters: 1'])
  })

  it('never offers dropping the last adversary', () => {
    const result = relax(
      [protocol('red', { sentiments: { ...ALL_GOOD, chainAnalyst: 'bad' } })],
      { from: ['chainAnalyst'] },
    )
    expect(result).toEqual([])
  })
})

describe(getUncoveredAdversaries.name, () => {
  it('names the chosen adversaries no listed protocol is private from', () => {
    const matches = matchProtocols(
      [
        protocol('a', {
          sentiments: {
            ...ALL_GOOD,
            privilegedInsider: 'bad',
            chainAnalyst: 'bad',
          },
        }),
        protocol('b', {
          sentiments: { ...ALL_GOOD, privilegedInsider: 'warning' },
        }),
      ],
      ADVERSARIES,
      {
        need: 'moveFunds',
        from: ['chainAnalyst', 'privilegedInsider', 'futureAdversary'],
        accepts: ACCEPT_ALL,
      },
    )
    expect(getUncoveredAdversaries(matches).map((a) => a.id)).toEqual([
      'privilegedInsider',
    ])
  })
})
