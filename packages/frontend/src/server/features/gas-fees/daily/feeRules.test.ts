import { expect } from 'earl'
import { utcDay as day } from '../days'
import { mockDay } from '../test/mockDay'
import { getPerGasPrices, splitFees } from './feeRules'
import { getDayValues } from './metrics'

describe(splitFees.name, () => {
  it('takes the L1 fee out of the base fee where the gas holds it', () => {
    expect(splitFees(mockDay('arbitrum'))).toEqual({
      base: 3,
      priority: 5,
      l1Data: 2,
    })
    expect(
      splitFees(mockDay('mantle', { timestamp: day('2026-04-21') })),
    ).toEqual({
      base: 3,
      priority: 5,
      l1Data: 2,
    })
  })

  it('leaves the base fee whole where the L1 fee comes on top', () => {
    expect(splitFees(mockDay('base'))).toEqual({
      base: 5,
      priority: 3,
      l1Data: 2,
    })
  })

  it("adds Mantle's operator fee to the base fee", () => {
    const split = splitFees(
      mockDay('mantle', { timestamp: day('2026-04-23'), gasUsed: 1e8 }),
    )
    expect(split).toEqual({ base: 6, priority: 2, l1Data: 2 })
  })

  it("adds Ethereum's blob fees to the base fee", () => {
    const split = splitFees(
      mockDay('ethereum', { l1FeeNative: 0, blobFeeNative: 1 }),
    )
    expect(split).toEqual({ base: 6, priority: 4, l1Data: 0 })
  })

  it('has no priority fee on first come, first served chains', () => {
    expect(splitFees(mockDay('zksync2', { l1FeeNative: 0 }))).toEqual({
      base: 10,
      priority: null,
      l1Data: 0,
    })
  })
})

describe(getPerGasPrices.name, () => {
  it('keeps an L1 fee charged on top out of the gas price, but not one inside the gas', () => {
    expect(getPerGasPrices(mockDay('base'))?.gasPrice).toEqual(8e-9)
    expect(getPerGasPrices(mockDay('arbitrum'))?.gasPrice).toEqual(10e-9)
  })

  it('keeps the stored base fee per gas where the gas holds the L1 fee', () => {
    const prices = getPerGasPrices(mockDay('arbitrum'))
    expect(prices?.baseFee).toEqual(5e-9)
    expect(prices?.priorityFee).toEqual(10e-9 - 5e-9)
  })

  it('has no prices on a day without transactions', () => {
    expect(
      getPerGasPrices(mockDay('taiko', { txCount: 0, gasUsed: 0 })),
    ).toEqual(undefined)
  })
})

describe(getDayValues.name, () => {
  it("adds the day's average L1 fee to an action's cost", () => {
    // 8e-9 ETH a gas, 0.2 ETH of L1 fee a transaction, $2,000 an ETH
    expect(getDayValues(mockDay('base')).transfer).toEqual(
      (21_000 * 8e-9 + 0.2) * 2_000,
    )
  })

  it('adds it where the gas holds the L1 fee too: an action is priced by its execution gas', () => {
    expect(getDayValues(mockDay('arbitrum')).transfer).toEqual(
      (21_000 * 10e-9 + 0.2) * 2_000,
    )
  })

  it('gives a halted day no prices', () => {
    const halted = mockDay('taiko', {
      txCount: 0,
      totalFeeNative: 0,
      totalFeeUsd: 0,
      gasUsed: 0,
      medianFeeUsd: null,
    })
    expect(
      Object.values(getDayValues(halted)).every((v) => v === null),
    ).toEqual(true)
  })
})
