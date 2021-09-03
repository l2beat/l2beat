import { expect } from 'chai'

import { SimpleDate } from '../../src/model'

describe('SimpleDate', () => {
  it('can be created from string', () => {
    expect(SimpleDate.fromString('2020-06-07')).to.be.instanceOf(SimpleDate)
  })

  it('can be created from a unix timestamp', () => {
    expect(SimpleDate.fromUnixTimestamp(1623067856)).to.be.instanceOf(
      SimpleDate
    )
  })

  it('can be compared using equals', () => {
    expect(
      SimpleDate.fromString('2020-06-07').equals(
        SimpleDate.fromString('2020-06-07')
      )
    ).to.equal(true)
    expect(
      SimpleDate.fromString('2020-06-07').equals(
        SimpleDate.fromString('2020-06-08')
      )
    ).to.equal(false)
  })

  it('can be compared using isAfter', () => {
    expect(
      SimpleDate.fromString('2020-06-07').isAfter(
        SimpleDate.fromString('2020-06-07')
      )
    ).to.equal(false)
    expect(
      SimpleDate.fromString('2020-06-07').isAfter(
        SimpleDate.fromString('2020-06-08')
      )
    ).to.equal(false)
    expect(
      SimpleDate.fromString('2020-06-07').isAfter(
        SimpleDate.fromString('2020-06-06')
      )
    ).to.equal(true)
  })

  it('can be compared using isBefore', () => {
    expect(
      SimpleDate.fromString('2020-06-07').isBefore(
        SimpleDate.fromString('2020-06-07')
      )
    ).to.equal(false)
    expect(
      SimpleDate.fromString('2020-06-07').isBefore(
        SimpleDate.fromString('2020-06-08')
      )
    ).to.equal(true)
    expect(
      SimpleDate.fromString('2020-06-07').isBefore(
        SimpleDate.fromString('2020-06-06')
      )
    ).to.equal(false)
  })

  it('can return a unix timestamp', () => {
    const ts = SimpleDate.fromString('2020-06-07').toUnixTimestamp()
    expect(ts).to.equal(1591488000)
  })

  it('can return a YYYY-MM-DD string', () => {
    const result = SimpleDate.fromString('2020-06-07').toString()
    expect(result).to.equal('2020-06-07')
  })

  it('can return a DD-MM-YYYY string', () => {
    const result = SimpleDate.fromString('2020-06-07').toDDMMYYYYString()
    expect(result).to.equal('07-06-2020')
  })

  it('can add days', () => {
    const a = SimpleDate.fromString('2020-06-07')
    const b = a.addDays(1)
    const c = a.addDays(30)
    const d = a.addDays(-366)
    expect(b.equals(SimpleDate.fromString('2020-06-08'))).to.equal(true)
    expect(c.equals(SimpleDate.fromString('2020-07-07'))).to.equal(true)
    expect(d.equals(SimpleDate.fromString('2019-06-07'))).to.equal(true)
  })
})
