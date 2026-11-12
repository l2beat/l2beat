import type { PrivacyAdversary, PrivacyNeed } from '@l2beat/config'
import { expect } from 'earl'
import { ACCEPT_ALL } from './advicePaths'
import type { MatchableProtocol } from './matchProtocols'
import { parseStayPrivateQuery, toStayPrivateQuery } from './stayPrivateQuery'

// Method: parse links a visitor could share or mistype, and check that the
// query written for a set of choices parses back to the same choices.

const NEEDS = [{ id: 'moveFunds' }, { id: 'vote' }] as PrivacyNeed[]
const ADVERSARIES = [
  { id: 'publicObserver' },
  { id: 'chainAnalyst' },
  { id: 'privilegedInsider' },
  { id: 'futureAdversary' },
] as PrivacyAdversary[]
const DEFAULT = ADVERSARIES.map((a) => a.id).filter(
  (id) => id !== 'futureAdversary',
)

const PROTOCOLS: MatchableProtocol[] = [
  {
    slug: 'pool',
    name: 'Pool',
    needId: 'moveFunds',
    steps: [],
    sentiments: {} as MatchableProtocol['sentiments'],
    anonymitySetSize: undefined,
    holdings: [{ symbol: 'ETH', chain: 'ethereum' }],
  },
  {
    slug: 'ballot',
    name: 'Ballot',
    needId: 'vote',
    steps: [],
    sentiments: {} as MatchableProtocol['sentiments'],
    anonymitySetSize: undefined,
    holdings: [],
  },
]
const CONTEXT = { needs: NEEDS, adversaries: ADVERSARIES, protocols: PROTOCOLS }

describe(parseStayPrivateQuery.name, () => {
  it('defaults to the first need, every adversary but the future one and every effort', () => {
    expect(parseStayPrivateQuery({}, CONTEXT)).toEqual({
      choices: {
        need: 'moveFunds',
        from: DEFAULT,
        accepts: ACCEPT_ALL,
        asset: undefined,
        chain: undefined,
      },
      protocol: undefined,
    })
  })

  it('reads the adversaries in rosette order and the refused efforts', () => {
    const { choices } = parseStayPrivateQuery(
      { from: 'privilegedInsider,publicObserver', without: 'wait' },
      CONTEXT,
    )
    expect(choices.from).toEqual(['publicObserver', 'privilegedInsider'])
    expect(choices.accepts).toEqual({ wait: false, outside: true })
  })

  it('falls back on unknown values instead of failing', () => {
    const { choices, protocol } = parseStayPrivateQuery(
      {
        need: 'fly',
        from: 'nobody',
        without: 'sleep',
        asset: 'DOGE',
        protocol: 'missing',
      },
      CONTEXT,
    )
    expect(choices.need).toEqual('moveFunds')
    expect(choices.from).toEqual(DEFAULT)
    expect(choices.accepts).toEqual(ACCEPT_ALL)
    expect(choices.asset).toEqual(undefined)
    expect(protocol).toEqual(undefined)
  })

  it('drops a protocol of another need, and an asset the need does not hold', () => {
    const { choices, protocol } = parseStayPrivateQuery(
      { need: 'vote', protocol: 'pool', asset: 'ETH' },
      CONTEXT,
    )
    expect(choices.asset).toEqual(undefined)
    expect(protocol).toEqual(undefined)
  })
})

describe(toStayPrivateQuery.name, () => {
  it('leaves the defaults out', () => {
    expect(
      toStayPrivateQuery(
        { need: 'moveFunds', from: DEFAULT, accepts: ACCEPT_ALL },
        undefined,
        ADVERSARIES,
      ),
    ).toEqual({ need: 'moveFunds' })
  })

  it('writes the future adversary once the visitor adds it', () => {
    const from = ADVERSARIES.map((a) => a.id)
    const query = toStayPrivateQuery(
      { need: 'moveFunds', from, accepts: ACCEPT_ALL },
      undefined,
      ADVERSARIES,
    )
    expect(query.from).toEqual(
      'publicObserver,chainAnalyst,privilegedInsider,futureAdversary',
    )
    expect(parseStayPrivateQuery(query, CONTEXT).choices.from).toEqual(from)
  })

  it('writes a query that parses back to the same choices', () => {
    const choices = {
      need: 'moveFunds',
      from: ['chainAnalyst' as const],
      accepts: { wait: false, outside: false },
      asset: 'ETH',
      chain: 'ethereum',
    }
    const query = toStayPrivateQuery(choices, 'pool', ADVERSARIES)
    expect(query).toEqual({
      need: 'moveFunds',
      from: 'chainAnalyst',
      without: 'wait,outside',
      asset: 'ETH',
      chain: 'ethereum',
      protocol: 'pool',
    })
    expect(parseStayPrivateQuery(query, CONTEXT)).toEqual({
      choices,
      protocol: 'pool',
    })
  })
})
