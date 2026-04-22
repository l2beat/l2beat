import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { getBlockNumberAtOrBefore } from './getBlockNumberAtOrBefore'

const linear =
  (slope: number, offset = 0) =>
  async (n: number): Promise<{ timestamp: number }> => ({
    timestamp: offset + n * slope,
  })

describe(getBlockNumberAtOrBefore.name, async () => {
  it('returns lhsBlock when timestamp ≤ lhsTimestamp', async () => {
    const getBlock = linear(3)
    const lhs = 10
    const rhs = 500
    const res = await getBlockNumberAtOrBefore(
      UnixTime((await getBlock(lhs)).timestamp - 1),
      lhs,
      rhs,
      getBlock,
    )
    expect(res).toEqual(lhs)
  })

  it('returns rhsBlock when timestamp ≥ rhsTimestamp', async () => {
    const getBlock = linear(7, 42)
    const lhs = 0
    const rhs = 77
    const res = await getBlockNumberAtOrBefore(
      UnixTime((await getBlock(rhs)).timestamp + 1),
      lhs,
      rhs,
      getBlock,
    )
    expect(res).toEqual(rhs)
  })

  it('returns exact block when timestamp matches one inside the range', async () => {
    const getBlock = linear(5)
    const lhs = 0
    const rhs = 1_000
    const target = 777
    const res = await getBlockNumberAtOrBefore(
      UnixTime((await getBlock(target)).timestamp),
      lhs,
      rhs,
      getBlock,
    )
    expect(res).toEqual(target)
  })

  it('returns closest lower block when timestamp falls strictly between two blocks', async () => {
    const getBlock = linear(10)
    const lhs = 0
    const rhs = 100
    const res = await getBlockNumberAtOrBefore(
      UnixTime(375),
      lhs,
      rhs,
      getBlock,
    )
    expect(res).toEqual(37)
  })

  it('handles the minimal searchable interval (rhs = lhs + 1)', async () => {
    const getBlock = linear(2)
    const lhs = 123
    const rhs = 124
    const res = await getBlockNumberAtOrBefore(
      UnixTime((await getBlock(lhs)).timestamp + 1),
      lhs,
      rhs,
      getBlock,
    )
    expect(res).toEqual(lhs)
  })

  it('works for very large ranges and non‑zero offset', async () => {
    const slope = 15
    const offset = 123_456
    const getBlock = linear(slope, offset)
    const lhs = 0
    const rhs = 1_000_000
    const target = 987_654
    const res = await getBlockNumberAtOrBefore(
      UnixTime((await getBlock(target)).timestamp),
      lhs,
      rhs,
      getBlock,
    )
    expect(res).toEqual(target)
  })

  it('performs logarithmic‑like number of timestamp queries', async () => {
    const calls: number[] = []
    const getBlock = async (b: number) => {
      calls.push(b)
      return { timestamp: b * 2 }
    }
    await getBlockNumberAtOrBefore(UnixTime(1_000_000), 0, 1_000_000, getBlock)
    expect(calls.length).toBeLessThanOrEqual(40)
  })

  it('returns lhsBlock when target equals lhsTimestamp and lhs is unique', async () => {
    const getBlock = linear(10, 100)
    const res = await getBlockNumberAtOrBefore(UnixTime(100), 0, 50, getBlock)
    expect(res).toEqual(0)
  })

  it('returns rhsBlock when target equals rhsTimestamp exactly', async () => {
    const getBlock = linear(10)
    const res = await getBlockNumberAtOrBefore(UnixTime(500), 0, 50, getBlock)
    expect(res).toEqual(50)
  })

  // Flat region then a massive spike — interpolation initially undershoots and
  // fails to halve the range, forcing the binary fallback at line 59 to kick
  // in. Guards against regressions in the interpolation/binary switching.
  it('handles irregular block times (triggers binary fallback)', async () => {
    const getBlock = async (n: number) => ({
      timestamp: n <= 900 ? n : 900 + (n - 900) * 10_000,
    })
    const res = await getBlockNumberAtOrBefore(UnixTime(500), 0, 1000, getBlock)
    expect(res).toEqual(500)
  })

  // On linear data interpolation should resolve in a handful of calls. The
  // ≤40 bound above would silently pass if interpolation regressed to pure
  // binary search; a tight bound locks in the actual behavior.
  it('resolves linear data with interpolation in few calls', async () => {
    const calls: number[] = []
    const getBlock = async (b: number) => {
      calls.push(b)
      return { timestamp: b * 2 }
    }
    await getBlockNumberAtOrBefore(UnixTime(500_001), 0, 1_000_000, getBlock)
    expect(calls.length).toBeLessThanOrEqual(8)
  })

  it('handles degenerate range where lhsBlock === rhsBlock', async () => {
    const getBlock = linear(10)
    const res = await getBlockNumberAtOrBefore(UnixTime(50), 42, 42, getBlock)
    expect(res).toEqual(42)
  })
})
