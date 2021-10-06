import { expect } from 'chai'

import { asRpcBlock } from '../../../src/peripherals/ethereum/types'
import earliestBlockAlchemy from './examples/earliestBlockAlchemy.json'
import earliestBlockInfura from './examples/earliestBlockAlchemy.json'
import latestBlockAlchemy from './examples/latestBlockAlchemy.json'
import latestBlockInfura from './examples/latestBlockAlchemy.json'
import pendingBlockAlchemy from './examples/pendingBlockAlchemy.json'
import pendingBlockInfura from './examples/pendingBlockAlchemy.json'

describe('asRpcBlock', () => {
  const testCases = [
    { type: 'pending', provider: 'Alchemy', data: pendingBlockAlchemy },
    { type: 'latest', provider: 'Alchemy', data: latestBlockAlchemy },
    { type: 'earliest', provider: 'Alchemy', data: earliestBlockAlchemy },
    { type: 'pending', provider: 'Infura', data: pendingBlockInfura },
    { type: 'latest', provider: 'Infura', data: latestBlockInfura },
    { type: 'earliest', provider: 'Infura', data: earliestBlockInfura },
  ]

  for (const { type, provider, data } of testCases) {
    it(`handles ${type} block from ${provider}`, () => {
      const result = asRpcBlock(data)
      expect(result).not.to.equal(undefined)
    })
  }

  it('throws for malformed data', () => {
    const copy = { ...latestBlockAlchemy }
    copy.difficulty = '0x01'
    expect(() => asRpcBlock(copy)).to.throw()
  })
})
