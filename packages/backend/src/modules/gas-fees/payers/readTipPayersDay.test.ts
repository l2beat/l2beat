import { expect } from 'earl'
import { isWholeTipPayersDay, type TipPayersDay } from './readTipPayersDay'

describe(isWholeTipPayersDay.name, () => {
  const range = { firstBlock: 100, lastBlock: 199 }

  it('takes a day with every block and all their transactions', () => {
    expect(isWholeTipPayersDay(day({}), range)).toEqual(true)
  })

  it('refuses a day with a block missing, short of transactions, or a tip it cannot class', () => {
    expect(isWholeTipPayersDay(day({ blocks: 99 }), range)).toEqual(false)
    expect(isWholeTipPayersDay(day({ incomplete_blocks: 1 }), range)).toEqual(
      false,
    )
    expect(isWholeTipPayersDay(day({ unknown_count: 1 }), range)).toEqual(false)
  })
})

function day(overrides: Partial<TipPayersDay>): TipPayersDay {
  return {
    blocks: 100,
    incomplete_blocks: 0,
    low_count: 0,
    low_tip_eth: 0,
    middle_count: 0,
    middle_tip_eth: 0,
    high_count: 0,
    high_tip_eth: 0,
    round_tip_count: 0,
    at_fast_tip_eth: 0,
    non_ordinary_count: 0,
    non_ordinary_tip_eth: 0,
    unknown_count: 0,
    ...overrides,
  }
}
