import type {
  PrivacyAdversaryId,
  PrivacyAdversarySentiment,
  PrivacyAdviceStep,
} from '@l2beat/config'
import { expect } from 'earl'
import { type RankableProtocol, rankProtocols } from './rankProtocols'

// Method: small made-up protocols that differ in one criterion at a time,
// ranked for each goal. The assertions are on order, shared ranks, the
// trade-offs each one shows and which filter result it gets, never on a
// score, so the tests pin the published rules and not their encoding.

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
const SETUP: PrivacyAdviceStep = {
  name: 'Set up',
  text: '',
  against: ['networkObserver'],
  outside: true,
}
const EXIT: PrivacyAdviceStep = { name: 'Exit', text: '', against: [] }

function protocol(
  slug: string,
  overrides: Partial<RankableProtocol> = {},
): RankableProtocol {
  return {
    slug,
    name: slug,
    categoryId: 'pool',
    categoryLabel: 'Pool',
    steps: [EXIT],
    sentiments: ALL_GOOD,
    anonymitySetSize: 100,
    exitWindowSentiment: 'good',
    holdings: [{ symbol: 'ETH', chain: 'ethereum' }],
    ...overrides,
  }
}

function order(ranking: ReturnType<typeof rankProtocols>) {
  return ranking.ranked.map((r) => `${r.rank}:${r.protocol.slug}`)
}

describe(rankProtocols.name, () => {
  it('ranks most private by red ratings, then green ones, then the anonymity set', () => {
    const ranking = rankProtocols(
      [
        protocol('one-red', {
          sentiments: { ...ALL_GOOD, futureAdversary: 'bad' },
          anonymitySetSize: 10_000,
        }),
        protocol('one-yellow', {
          sentiments: { ...ALL_GOOD, futureAdversary: 'warning' },
        }),
        protocol('small-set', { anonymitySetSize: 50 }),
        protocol('big-set', { anonymitySetSize: 500 }),
      ],
      { goal: 'private' },
    )
    expect(order(ranking)).toEqual([
      '1:big-set',
      '2:small-set',
      '3:one-yellow',
      '4:one-red',
    ])
  })

  it('never lets a missing count rank a protocol above one with a count', () => {
    const ranking = rankProtocols(
      [
        protocol('no-count', { anonymitySetSize: undefined }),
        protocol('tiny', { anonymitySetSize: 1 }),
      ],
      { goal: 'private' },
    )
    expect(order(ranking)).toEqual(['1:tiny', '2:no-count'])
    expect(ranking.ranked[1]?.tradeOffs).toEqual([
      { criterion: 'anonymitySet', kind: 'no-data' },
    ])
  })

  it('gives equal protocols the same rank, so a tie never reads as a winner', () => {
    const ranking = rankProtocols([protocol('b'), protocol('a')], {
      goal: 'private',
    })
    expect(order(ranking)).toEqual(['1:a', '1:b'])
  })

  it('puts protocols without a random wait first for the fastest goal', () => {
    const ranking = rankProtocols(
      [
        protocol('waits', { steps: [WAIT, EXIT], anonymitySetSize: 9_000 }),
        protocol('no-wait'),
      ],
      { goal: 'fast' },
    )
    expect(order(ranking)).toEqual(['1:no-wait', '2:waits'])
    expect(ranking.ranked[1]?.tradeOffs).toEqual([
      { criterion: 'noWait', kind: 'worse' },
      { criterion: 'fewerSteps', kind: 'worse' },
    ])
    // The faster one has the smaller set, and says so.
    expect(ranking.ranked[0]?.tradeOffs).toEqual([
      { criterion: 'anonymitySet', kind: 'worse' },
    ])
  })

  it('counts steps outside the app first for the least setup goal', () => {
    const ranking = rankProtocols(
      [
        protocol('setup', { steps: [SETUP, EXIT] }),
        protocol('three-steps', { steps: [EXIT, EXIT, EXIT] }),
      ],
      { goal: 'light' },
    )
    expect(order(ranking)).toEqual(['1:three-steps', '2:setup'])
  })

  it('ranks the operator goal by the insider rating, then the exit window', () => {
    const ranking = rankProtocols(
      [
        protocol('insider-yellow', {
          sentiments: { ...ALL_GOOD, privilegedInsider: 'warning' },
        }),
        protocol('no-exit-window', { exitWindowSentiment: undefined }),
        protocol('exit-red', { exitWindowSentiment: 'bad' }),
      ],
      { goal: 'operator' },
    )
    expect(order(ranking)).toEqual([
      '1:exit-red',
      '2:no-exit-window',
      '3:insider-yellow',
    ])
  })

  it('lists every trade-off against the best of the ranked, not only the goal criteria', () => {
    const ranking = rankProtocols(
      [
        protocol('best'),
        protocol('slow', { steps: [SETUP, WAIT, EXIT], anonymitySetSize: 10 }),
      ],
      { goal: 'private' },
    )
    expect(
      ranking.ranked
        .find((r) => r.protocol.slug === 'slow')
        ?.tradeOffs.map((t) => t.criterion),
    ).toEqual(['anonymitySet', 'noWait', 'fewerOutside', 'fewerSteps'])
  })

  describe('filters', () => {
    const protocols = [
      protocol('eth-mainnet'),
      protocol('usdc-base', { holdings: [{ symbol: 'USDC', chain: 'base' }] }),
      protocol('untracked', { holdings: [] }),
      protocol('stealth', {
        categoryId: 'stealthAddress',
        categoryLabel: 'Stealth address',
      }),
    ]

    it('excludes protocols of another kind, and says which kind they are', () => {
      const ranking = rankProtocols(protocols, {
        goal: 'private',
        kind: 'pool',
      })
      expect(ranking.excluded).toEqual([
        { protocol: protocols[3]!, reason: 'A stealth address' },
      ])
    })

    it('needs the asset on the chain asked for, not each in a different place', () => {
      const ranking = rankProtocols(protocols, {
        goal: 'private',
        asset: 'USDC',
        chain: 'ethereum',
      })
      expect(order(ranking)).toEqual([])
      expect(ranking.excluded.map((e) => e.reason)).toEqual([
        'We track no USDC on ethereum in it',
        'We track no USDC on ethereum in it',
        'We track no USDC on ethereum in it',
      ])
    })

    it('keeps protocols whose assets we do not track apart, neither ranked nor ruled out', () => {
      const ranking = rankProtocols(protocols, {
        goal: 'private',
        chain: 'base',
      })
      expect(order(ranking)).toEqual(['1:usdc-base'])
      expect(ranking.unchecked).toEqual([
        { protocol: protocols[2]!, reason: 'We track no assets in it' },
      ])
    })
  })
})
