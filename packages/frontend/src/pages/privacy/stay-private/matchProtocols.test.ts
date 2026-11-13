import type {
  PrivacyAdversary,
  PrivacyAdversaryId,
  PrivacyAdversarySentiment,
  PrivacyAdviceStep,
} from '@l2beat/config'
import { expect } from 'earl'
import { ACCEPT_ALL } from './advicePaths'
import {
  getHoldingOptions,
  type MatchableProtocol,
  type MatchChoices,
  matchProtocols,
} from './matchProtocols'

// Method: small made-up protocols that differ in one rating or step at a
// time, matched against a user's choices. The assertions are on the group a
// protocol lands in and the order inside it, so the tests pin the published
// rule and not its encoding.

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
const SETUP: PrivacyAdviceStep = {
  name: 'Set up',
  text: '',
  against: ['networkObserver'],
  outside: true,
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
    anonymitySetSize: 100,
    holdings: [{ symbol: 'ETH', chain: 'ethereum' }],
    ...overrides,
  }
}

function match(
  protocols: MatchableProtocol[],
  choices: Partial<MatchChoices> = {},
) {
  const result = matchProtocols(protocols, ADVERSARIES, {
    need: 'moveFunds',
    from: [...IDS],
    accepts: ACCEPT_ALL,
    ...choices,
  })
  const slugs = (rows: { protocol: MatchableProtocol }[]) =>
    rows.map((row) => row.protocol.slug)
  return {
    private: slugs(result.groups.private),
    atRisk: slugs(result.groups.atRisk),
    exposed: slugs(result.groups.exposed),
    excluded: result.excluded.map((e) => `${e.protocol.slug}: ${e.reason}`),
    unchecked: slugs(result.unchecked),
  }
}

describe(matchProtocols.name, () => {
  it('groups by the ratings against the chosen adversaries', () => {
    const result = match([
      protocol('green'),
      protocol('yellow', {
        sentiments: { ...ALL_GOOD, privilegedInsider: 'warning' },
      }),
      protocol('red', { sentiments: { ...ALL_GOOD, chainAnalyst: 'bad' } }),
    ])
    expect(result.private).toEqual(['green'])
    expect(result.atRisk).toEqual(['yellow'])
    expect(result.exposed).toEqual(['red'])
  })

  it('ignores the ratings against adversaries the user did not choose', () => {
    const result = match(
      [
        protocol('quantum', {
          sentiments: { ...ALL_GOOD, futureAdversary: 'bad' },
        }),
      ],
      { from: ['publicObserver', 'chainAnalyst'] },
    )
    expect(result.private).toEqual(['quantum'])
  })

  it('compares only the protocols of the chosen need', () => {
    const result = match([
      protocol('pool'),
      protocol('ballot', { needId: 'vote' }),
    ])
    expect(result.private).toEqual(['pool'])
  })

  it('never counts a missing wait step as fast: a red chain analyst stays exposed', () => {
    // The pool is green behind its wait. The quiet ledger has no wait step
    // because no wait helps it. Without waiting, the pool is not rated and
    // the quiet ledger is still exposed, so it never lands above the pool.
    const result = match(
      [
        protocol('pool', { steps: [WAIT] }),
        protocol('quiet', {
          sentiments: { ...ALL_GOOD, chainAnalyst: 'bad' },
        }),
      ],
      { accepts: { ...ACCEPT_ALL, wait: false } },
    )
    expect(result.private).toEqual([])
    expect(result.atRisk).toEqual(['pool'])
    expect(result.exposed).toEqual(['quiet'])
  })

  it('does not count a rating as private when it assumes an outside step the user ruled out', () => {
    const protocols = [protocol('pool', { steps: [SETUP] })]
    expect(match(protocols).private).toEqual(['pool'])
    expect(
      match(protocols, { accepts: { ...ACCEPT_ALL, outside: false } }).atRisk,
    ).toEqual(['pool'])
  })

  it('keeps a ruled-out step from mattering when its adversary is not chosen', () => {
    const result = match([protocol('pool', { steps: [SETUP] })], {
      from: ['publicObserver'],
      accepts: { ...ACCEPT_ALL, outside: false },
    })
    expect(result.private).toEqual(['pool'])
  })

  it('lists a protocol without steps, in the group its ratings give', () => {
    const allRed = Object.fromEntries(
      IDS.map((id) => [id, 'bad']),
    ) as typeof ALL_GOOD
    expect(match([protocol('payy', { sentiments: allRed })]).exposed).toEqual([
      'payy',
    ])
  })

  it('sorts a group by fewer red, then fewer not private, then the larger anonymity set, then the name', () => {
    const yellow = (n: number) =>
      Object.fromEntries(
        IDS.map((id, i) => [id, i < n ? 'warning' : 'good']),
      ) as typeof ALL_GOOD
    const result = match([
      protocol('b-two-yellow', { sentiments: yellow(2) }),
      protocol('c-small', { sentiments: yellow(1), anonymitySetSize: 10 }),
      protocol('d-no-count', {
        sentiments: yellow(1),
        anonymitySetSize: undefined,
      }),
      protocol('a-large', { sentiments: yellow(1), anonymitySetSize: 500 }),
      protocol('a-same', { sentiments: yellow(1), anonymitySetSize: 10 }),
    ])
    expect(result.atRisk).toEqual([
      'a-large',
      'a-same',
      'c-small',
      'd-no-count',
      'b-two-yellow',
    ])
  })

  it('rules out a protocol that does not hold the asset on the chain, and says why', () => {
    const result = match(
      [
        protocol('eth-only'),
        protocol('usdc-base', {
          holdings: [{ symbol: 'USDC', chain: 'base' }],
        }),
        protocol('usdc-ethereum', {
          holdings: [{ symbol: 'USDC', chain: 'ethereum' }],
        }),
      ],
      { asset: 'USDC', chain: 'base' },
    )
    expect(result.private).toEqual(['usdc-base'])
    expect(result.excluded).toEqual([
      'eth-only: We track no USDC on base in it',
      'usdc-ethereum: We track no USDC on base in it',
    ])
  })

  it('neither matches nor rules out a protocol we track no assets of', () => {
    const result = match([protocol('untracked', { holdings: [] })], {
      asset: 'ETH',
    })
    expect(result.private).toEqual([])
    expect(result.excluded).toEqual([])
    expect(result.unchecked).toEqual(['untracked'])
  })
})

describe(getHoldingOptions.name, () => {
  it('offers the assets and chains of the need, most held first', () => {
    const options = getHoldingOptions(
      [
        protocol('a', {
          holdings: [
            { symbol: 'ETH', chain: 'base' },
            { symbol: 'USDC', chain: 'ethereum' },
          ],
        }),
        protocol('b', { holdings: [{ symbol: 'USDC', chain: 'ethereum' }] }),
        protocol('c', {
          needId: 'vote',
          holdings: [{ symbol: 'DAI', chain: 'gnosis' }],
        }),
      ],
      'moveFunds',
    )
    expect(options).toEqual({
      assets: ['USDC', 'ETH'],
      chains: ['ethereum', 'base'],
    })
  })
})
