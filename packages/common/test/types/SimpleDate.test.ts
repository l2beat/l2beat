import { expect } from 'earljs'

import { SimpleDate } from '../../src/types'

describe(SimpleDate.name, () => {
  it('can be created from string', () => {
    expect(SimpleDate.fromString('2020-06-07')).toBeA(SimpleDate)
  })

  it('can be created from a unix timestamp', () => {
    expect(SimpleDate.fromUnixTimestamp(1623067856)).toBeA(SimpleDate)
  })

  it('can be compared using equals', () => {
    expect(
      SimpleDate.fromString('2020-06-07').equals(
        SimpleDate.fromString('2020-06-07')
      )
    ).toEqual(true)
    expect(
      SimpleDate.fromString('2020-06-07').equals(
        SimpleDate.fromString('2020-06-08')
      )
    ).toEqual(false)
  })

  it('can be compared using isAfter', () => {
    expect(
      SimpleDate.fromString('2020-06-07').isAfter(
        SimpleDate.fromString('2020-06-07')
      )
    ).toEqual(false)
    expect(
      SimpleDate.fromString('2020-06-07').isAfter(
        SimpleDate.fromString('2020-06-08')
      )
    ).toEqual(false)
    expect(
      SimpleDate.fromString('2020-06-07').isAfter(
        SimpleDate.fromString('2020-06-06')
      )
    ).toEqual(true)
  })

  it('can be compared using isBefore', () => {
    expect(
      SimpleDate.fromString('2020-06-07').isBefore(
        SimpleDate.fromString('2020-06-07')
      )
    ).toEqual(false)
    expect(
      SimpleDate.fromString('2020-06-07').isBefore(
        SimpleDate.fromString('2020-06-08')
      )
    ).toEqual(true)
    expect(
      SimpleDate.fromString('2020-06-07').isBefore(
        SimpleDate.fromString('2020-06-06')
      )
    ).toEqual(false)
  })

  it('can return a unix timestamp', () => {
    const ts = SimpleDate.fromString('2020-06-07').toUnixTimestamp()
    expect(ts).toEqual(1591488000)
  })

  it('can return a YYYY-MM-DD string', () => {
    const result = SimpleDate.fromString('2020-06-07').toString()
    expect(result).toEqual('2020-06-07')
  })

  it('can return a DD-MM-YYYY string', () => {
    const result = SimpleDate.fromString('2020-06-07').toDDMMYYYYString()
    expect(result).toEqual('07-06-2020')
  })

  it('can add days', () => {
    const a = SimpleDate.fromString('2020-06-07')
    const b = a.addDays(1)
    const c = a.addDays(30)
    const d = a.addDays(-366)
    expect(b.equals(SimpleDate.fromString('2020-06-08'))).toEqual(true)
    expect(c.equals(SimpleDate.fromString('2020-07-07'))).toEqual(true)
    expect(d.equals(SimpleDate.fromString('2019-06-07'))).toEqual(true)
  })
})
