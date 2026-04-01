import { expect } from 'earl'
import { EVMTransaction } from './types'

describe('EVMTransaction parser', () => {
  it('parses canonical transaction', () => {
    const parsed = EVMTransaction.parse({
      hash: '0x1',
      from: '0x2',
      to: '0x3',
      input: '0x1234',
      value: '0x5',
      type: '0x2',
      blockNumber: '0xa',
    })

    expect(parsed).toEqual({
      hash: '0x1',
      from: '0x2',
      to: '0x3',
      data: '0x1234',
      value: 5n,
      type: '2',
      calls: undefined,
      blobVersionedHashes: undefined,
      blockNumber: 10,
    })
  })

  it('parses bundle transaction with calls only', () => {
    const parsed = EVMTransaction.parse({
      hash: '0x1',
      from: '0x2',
      to: null,
      type: '0x76',
      blockNumber: '0xa',
      calls: [
        {
          to: '0x3',
          value: '0x9',
          input: '0xabcd',
          data: null,
        },
      ],
    })

    expect(parsed).toEqual({
      hash: '0x1',
      from: '0x2',
      to: undefined,
      data: undefined,
      value: undefined,
      type: '118',
      calls: [
        {
          to: '0x3',
          value: 9n,
          data: '0xabcd',
        },
      ],
      blobVersionedHashes: undefined,
      blockNumber: 10,
    })
  })

  it('parses custom envelope transaction without top-level calldata/value', () => {
    const parsed = EVMTransaction.parse({
      hash: '0x1',
      from: '0x2',
      type: '0x77',
      blockNumber: '0xa',
    })

    expect(parsed).toEqual({
      hash: '0x1',
      from: '0x2',
      to: undefined,
      data: undefined,
      value: undefined,
      type: '119',
      calls: undefined,
      blobVersionedHashes: undefined,
      blockNumber: 10,
    })
  })
})
