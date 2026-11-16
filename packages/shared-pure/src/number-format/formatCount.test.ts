import { expect } from 'earl'

import { formatCount } from './formatCount.js'

describe(formatCount.name, () => {
  it('uses the singular for one', () => {
    expect(formatCount(1, 'tx')).toEqual('1 tx')
    expect(formatCount(1, 'transfer')).toEqual('1 transfer')
  })

  it('uses the plural for other counts', () => {
    expect(formatCount(0, 'tx')).toEqual('0 txs')
    expect(formatCount(2, 'transfer')).toEqual('2 transfers')
  })

  it('formats large counts compactly', () => {
    expect(formatCount(43_789, 'transfer')).toEqual('43.78 K transfers')
  })
})
