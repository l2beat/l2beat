import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { GasFeesChain } from './chains'
import { FEE_RULES } from './feeRules'
import {
  getMissingChainDays,
  isAnyChainExpected,
  pickChainDays,
  planLateReads,
} from './lateDays'

const day = (n: number) => UnixTime(n * UnixTime.DAY)
const fees = FEE_RULES.gasTimesPrice
const a: GasFeesChain = {
  id: 'arbitrum',
  dune: 'arbitrum',
  fees,
  requiredFrom: day(0),
}
const b: GasFeesChain = { id: 'base', dune: 'base', fees, requiredFrom: day(2) }

describe(getMissingChainDays.name, () => {
  it("lists the chain-days not stored, from each chain's first required day", () => {
    const stored = [
      { chain: 'arbitrum', timestamp: day(1) },
      { chain: 'base', timestamp: day(2) },
    ]

    expect(getMissingChainDays([a, b], day(1), day(3), stored)).toEqual([
      { chain: a, day: day(2) },
      { chain: a, day: day(3) },
      { chain: b, day: day(3) },
    ])
  })
})

describe(isAnyChainExpected.name, () => {
  it("is false before every chain's first required day", () => {
    expect(isAnyChainExpected([b], day(1))).toEqual(false)
    expect(isAnyChainExpected([a, b], day(1))).toEqual(true)
  })
})

describe(pickChainDays.name, () => {
  it('keeps the records of the given chain-days only', () => {
    const records = [
      { chain: 'arbitrum', timestamp: day(1) },
      { chain: 'arbitrum', timestamp: day(2) },
      { chain: 'base', timestamp: day(2) },
    ]

    expect(pickChainDays(records, [{ chain: a, day: day(2) }])).toEqual([
      { chain: 'arbitrum', timestamp: day(2) },
    ])
  })
})

describe(planLateReads.name, () => {
  const late = (chain: GasFeesChain, ...days: number[]) =>
    days.map((n) => ({ chain, day: day(n) }))

  it('plans nothing when no day is late', () => {
    expect(planLateReads([], 3)).toEqual([])
  })

  it('reads late days that fit one batch together', () => {
    expect(planLateReads([...late(a, 5, 7), ...late(b, 6)], 3)).toEqual([
      { chains: [a, b], from: day(5), to: day(7) },
    ])
  })

  it('reads the newest and the oldest late days, not all between', () => {
    expect(planLateReads([...late(a, 0, 1, 4), ...late(b, 9)], 3)).toEqual([
      { chains: [b], from: day(9), to: day(9) },
      { chains: [a], from: day(0), to: day(1) },
    ])
  })

  it('keeps the two reads apart when the oldest batch would reach the newest', () => {
    expect(planLateReads(late(a, 4, 5, 6, 7, 8), 3)).toEqual([
      { chains: [a], from: day(6), to: day(8) },
      { chains: [a], from: day(4), to: day(5) },
    ])
  })

  it('reads single days with a batch of one', () => {
    expect(planLateReads(late(a, 0, 3, 7), 1)).toEqual([
      { chains: [a], from: day(7), to: day(7) },
      { chains: [a], from: day(0), to: day(0) },
    ])
  })
})
