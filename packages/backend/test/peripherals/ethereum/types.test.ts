import { expect } from 'earljs'

import { asRpcBlock } from '../../../src/peripherals/ethereum/types'
import earliestBlockAlchemy from './examples/earliestBlockAlchemy.json'
import earliestBlockInfura from './examples/earliestBlockInfura.json'
import latestBlockAlchemy from './examples/latestBlockAlchemy.json'
import latestBlockInfura from './examples/latestBlockInfura.json'
import pendingBlockAlchemy from './examples/pendingBlockAlchemy.json'
import pendingBlockInfura from './examples/pendingBlockInfura.json'

describe(asRpcBlock.name, () => {
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
      expect(() => asRpcBlock(data)).not.toThrow()
    })
  }

  it('throws for malformed data', () => {
    const copy = { ...latestBlockAlchemy }
    copy.difficulty = '0x01'
    expect(() => asRpcBlock(copy)).toThrow()
  })
})
