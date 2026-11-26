import { expect } from 'earl'
import { type TipPayersRow, toTipPayersDay } from './readTipPayersDay'

describe(toTipPayersDay.name, () => {
  const range = { firstBlock: 100, lastBlock: 199 }
  const whole = (overrides: Partial<TipPayersRow>) =>
    toTipPayersDay({ ...ROW, ...overrides }, range).whole

  it('takes a day with every block and all their transactions as whole', () => {
    expect(whole({})).toEqual(true)
  })

  it('does not when a block is missing, short of transactions, or a tip cannot be classed', () => {
    expect(whole({ blocks: 99 })).toEqual(false)
    expect(whole({ incomplete_blocks: 1 })).toEqual(false)
    expect(whole({ unknown_count: 1 })).toEqual(false)
  })

  it('names the groups', () => {
    expect(toTipPayersDay(ROW, range).figures).toEqual({
      low: { txCount: 600, tipEth: 1 },
      middle: { txCount: 300, tipEth: 2 },
      high: { txCount: 100, tipEth: 3 },
      roundTipTxCount: 50,
      atFastTipEth: 0.5,
      nonOrdinary: { txCount: 10, tipEth: 4 },
    })
  })
})

const ROW: TipPayersRow = {
  blocks: 100,
  incomplete_blocks: 0,
  low_count: 600,
  low_tip_eth: 1,
  middle_count: 300,
  middle_tip_eth: 2,
  high_count: 100,
  high_tip_eth: 3,
  round_tip_count: 50,
  at_fast_tip_eth: 0.5,
  non_ordinary_count: 10,
  non_ordinary_tip_eth: 4,
  unknown_count: 0,
}
