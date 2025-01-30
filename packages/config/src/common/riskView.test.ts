import { Bytes } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { Sentiment, TableReadyValue } from '../types'
import { pickWorseRisk, sumRisk } from './riskView'

function createFakeRisk(
  sentiment: Sentiment,
  orderHint?: number,
): TableReadyValue {
  return {
    description: 'description',
    value: Bytes.randomOfLength(32).toString(),
    sentiment,
    orderHint,
  }
}

describe(pickWorseRisk.name, () => {
  const badRisk = createFakeRisk('bad')
  const warnRisk = createFakeRisk('warning')
  const neutralRisk = createFakeRisk('neutral')
  const goodRisk = createFakeRisk('good')

  it('returns the risk with worse sentiment', () => {
    expect(pickWorseRisk(badRisk, warnRisk)).toEqual(badRisk)
    expect(pickWorseRisk(warnRisk, badRisk)).toEqual(badRisk)
    expect(pickWorseRisk(neutralRisk, warnRisk)).toEqual(warnRisk)
    expect(pickWorseRisk(goodRisk, neutralRisk)).toEqual(neutralRisk)
    expect(pickWorseRisk(neutralRisk, badRisk)).toEqual(badRisk)
    expect(pickWorseRisk(goodRisk, badRisk)).toEqual(badRisk)
    expect(pickWorseRisk(neutralRisk, warnRisk)).toEqual(warnRisk)
  })

  it('if two have the same sentiment and no order is specified for one it throws', () => {
    const badRisk2 = createFakeRisk('bad')
    const warnRisk2 = createFakeRisk('warning', 23)

    expect(() => pickWorseRisk(badRisk, badRisk2)).toThrow()
    expect(() => pickWorseRisk(warnRisk, warnRisk2)).toThrow()
  })

  it('if two have the same sentiment and returns the one with lower defining metric', () => {
    const risk1 = createFakeRisk('bad', -2)
    const risk2 = createFakeRisk('bad', 5)

    expect(pickWorseRisk(risk1, risk2)).toEqual(risk1)
  })

  it('if any risks are under review the worse risk is still under review', () => {
    const underReviewRisk = createFakeRisk('UnderReview')
    expect(pickWorseRisk(underReviewRisk, badRisk)).toEqual(underReviewRisk)
    expect(pickWorseRisk(badRisk, underReviewRisk)).toEqual(underReviewRisk)
  })
})

describe(sumRisk.name, () => {
  it('returns the sum of the risks if they are the same and good', () => {
    const risk1 = createFakeRisk('warning', 40)
    const risk2 = createFakeRisk('warning', 2)
    const expected = createFakeRisk('warning', 42)

    const result = sumRisk(risk1, risk2, (number: number) => ({
      ...createFakeRisk('warning', number),
      value: expected.value, // it's random so we have to copy here
    }))
    expect(result).toEqual(expected)
  })

  it('picks worse risk if cannot sum', () => {
    const badRisk = createFakeRisk('bad')
    const warnRisk = createFakeRisk('warning')
    const neutralRisk = createFakeRisk('neutral')
    const goodRisk = createFakeRisk('good')
    const callback = () => badRisk

    expect(sumRisk(badRisk, warnRisk, callback)).toEqual(badRisk)
    expect(sumRisk(warnRisk, badRisk, callback)).toEqual(badRisk)
    expect(sumRisk(neutralRisk, warnRisk, callback)).toEqual(warnRisk)
    expect(sumRisk(goodRisk, neutralRisk, callback)).toEqual(neutralRisk)
    expect(sumRisk(neutralRisk, badRisk, callback)).toEqual(badRisk)
    expect(sumRisk(goodRisk, badRisk, callback)).toEqual(badRisk)
    expect(sumRisk(neutralRisk, warnRisk, callback)).toEqual(warnRisk)
  })

  it('picks worse risk if both are bad', () => {
    const risk1 = createFakeRisk('bad', 40)
    const risk2 = createFakeRisk('bad', 2)

    expect(sumRisk(risk1, risk2, () => createFakeRisk('bad', 0))).toEqual(risk2)
  })
})
