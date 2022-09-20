import { UnixTime } from '@l2beat/types'
import { expect } from 'earljs'

import { findCorrespondingBlocks } from '../../../src/core/events/findCorrespondingBlocks'

describe(findCorrespondingBlocks.name, () => {
  it('works', () => {
    const logs = [
      { blockNumber: 4 },
      { blockNumber: 5 },
      { blockNumber: 6 },
      { blockNumber: 15 },
    ]
    const blocks = [
      { timestamp: new UnixTime(0), blockNumber: 0n },
      { timestamp: new UnixTime(5), blockNumber: 5n },
      { timestamp: new UnixTime(10), blockNumber: 10n },
      { timestamp: new UnixTime(15), blockNumber: 15n },
    ]

    const res = findCorrespondingBlocks(blocks, logs)

    expect(res).toEqual([
      { block: blocks[0], value: { blockNumber: 4 } },
      { block: blocks[1], value: { blockNumber: 5 } },
      { block: blocks[1], value: { blockNumber: 6 } },
      { block: blocks[3], value: { blockNumber: 15 } },
    ])
  })

  it('work with unsorted data', () => {
    const logs = [
      { blockNumber: 15 },
      { blockNumber: 5 },
      { blockNumber: 4 },
      { blockNumber: 6 },
    ]
    const blocks = [
      { timestamp: new UnixTime(15), blockNumber: 15n },
      { timestamp: new UnixTime(0), blockNumber: 0n },
      { timestamp: new UnixTime(10), blockNumber: 10n },
      { timestamp: new UnixTime(5), blockNumber: 5n },
    ]

    const res = findCorrespondingBlocks(blocks, logs)

    expect(res).toEqual([
      {
        block: { timestamp: new UnixTime(0), blockNumber: 0n },
        value: { blockNumber: 4 },
      },
      {
        block: { timestamp: new UnixTime(5), blockNumber: 5n },
        value: { blockNumber: 5 },
      },
      {
        block: { timestamp: new UnixTime(5), blockNumber: 5n },
        value: { blockNumber: 6 },
      },
      {
        block: { timestamp: new UnixTime(15), blockNumber: 15n },
        value: { blockNumber: 15 },
      },
    ])
  })

  it('works with only one block', () => {
    const logs = [{ blockNumber: 1 }, { blockNumber: 2 }]
    const blocks = [{ timestamp: new UnixTime(0), blockNumber: 0n }]

    const res = findCorrespondingBlocks(blocks, logs)

    expect(res).toEqual([
      { block: blocks[0], value: { blockNumber: 1 } },
      { block: blocks[0], value: { blockNumber: 2 } },
    ])
  })

  it('throws without a matching block', () => {
    const logs = [{ blockNumber: 4 }]
    const blocks = [{ timestamp: new UnixTime(6), blockNumber: 6n }]

    expect(() => findCorrespondingBlocks(blocks, logs)).toThrow()
  })

  it('throws without any matching blocks', () => {
    const logs = [{ blockNumber: 4 }]
    const blocks = [
      { timestamp: new UnixTime(6), blockNumber: 6n },
      { timestamp: new UnixTime(12), blockNumber: 12n },
    ]

    expect(() => findCorrespondingBlocks(blocks, logs)).toThrow()
  })

  it('throws without any blocks', () => {
    const logs = [{ blockNumber: 4 }]

    expect(() => findCorrespondingBlocks([], logs)).toThrow()
  })
})
