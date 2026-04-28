import { expect } from 'earl'
import type { Fact } from '../hooks/useFacts'
import { factToString, paramToString, searchFacts } from './searchFacts'

describe(searchFacts.name, () => {
  const facts = [
    {
      atom: 'cgId',
      params: [{ atom: 't', params: ['base', '0x123'] }, 'usd-coin'],
    },
    {
      atom: 'holders',
      params: [['alice', 'bob'], undefined],
    },
  ] as unknown as Fact[]
  const cgId = facts[0]!
  const holders = facts[1]!

  it('formats nested facts, lists, and nil values for display', () => {
    expect(paramToString(cgId.params[0]!)).toEqual('t(base, 0x123)')
    expect(paramToString(holders.params[0]!)).toEqual('[alice, bob]')
    expect(paramToString(holders.params[1]!)).toEqual('nil')
    expect(factToString(holders)).toEqual('holders [alice, bob], nil')
  })

  it('treats * as the only wildcard in fact search', () => {
    expect(searchFacts(facts, 't(base*usd-coin')).toEqual([cgId])
    expect(searchFacts(facts, '[alice, bob], nil')).toEqual([holders])
    expect(searchFacts(facts, 'usd.coin')).toEqual([])
  })

  it('searches using fact-style parentheses around all parameters', () => {
    expect(searchFacts(facts, 'cgId(t(base, 0x123), usd-coin)')).toEqual([cgId])
    expect(searchFacts(facts, 'cgId(t(base, 0x123)')).toEqual([cgId])
    expect(searchFacts(facts, 'cgId t(base, 0x123), usd-coin')).toEqual([])
  })
})
