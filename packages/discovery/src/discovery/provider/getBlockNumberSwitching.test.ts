import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { getBlockNumberSwitching } from './getBlockNumberSwitching'

const linear =
  (slope: number, offset = 0) =>
  async (n: number): Promise<number> =>
    offset + n * slope

describe(getBlockNumberSwitching.name, async () => {
  it('returns lhsBlock when timestamp ≤ lhsTimestamp', async () => {
    const getTs = linear(3)
    const lhs = 10
    const rhs = 500
    const res = await getBlockNumberSwitching(
      UnixTime((await getTs(lhs)) - 1),
      lhs,
      rhs,
      getTs,
    )
    expect(res).toEqual(lhs)
  })

  it('returns rhsBlock when timestamp ≥ rhsTimestamp', async () => {
    const getTs = linear(7, 42)
    const lhs = 0
    const rhs = 77
    const res = await getBlockNumberSwitching(
      UnixTime((await getTs(rhs)) + 1),
      lhs,
      rhs,
      getTs,
    )
    expect(res).toEqual(rhs)
  })

  it('returns exact block when timestamp matches one inside the range', async () => {
    const getTs = linear(5)
    const lhs = 0
    const rhs = 1_000
    const target = 777
    const res = await getBlockNumberSwitching(
      UnixTime(await getTs(target)),
      lhs,
      rhs,
      getTs,
    )
    expect(res).toEqual(target)
  })

  it('returns closest lower block when timestamp falls strictly between two blocks', async () => {
    const getTs = linear(10)
    const lhs = 0
    const rhs = 100
    const res = await getBlockNumberSwitching(UnixTime(375), lhs, rhs, getTs)
    expect(res).toEqual(37)
  })

  it('handles the minimal searchable interval (rhs = lhs + 1)', async () => {
    const getTs = linear(2)
    const lhs = 123
    const rhs = 124
    const res = await getBlockNumberSwitching(
      UnixTime((await getTs(lhs)) + 1),
      lhs,
      rhs,
      getTs,
    )
    expect(res).toEqual(lhs)
  })

  it('works for very large ranges and non‑zero offset', async () => {
    const slope = 15
    const offset = 123_456
    const getTs = linear(slope, offset)
    const lhs = 0
    const rhs = 1_000_000
    const target = 987_654
    const res = await getBlockNumberSwitching(
      UnixTime(await getTs(target)),
      lhs,
      rhs,
      getTs,
    )
    expect(res).toEqual(target)
  })

  it('performs logarithmic‑like number of timestamp queries', async () => {
    const calls: number[] = []
    const getTs = async (b: number) => {
      calls.push(b)
      return b * 2
    }
    await getBlockNumberSwitching(UnixTime(1_000_000), 0, 1_000_000, getTs)
    expect(calls.length).toBeLessThanOrEqual(40)
  })
})
