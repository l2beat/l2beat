import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getEscrowUntilTimestamp } from './getEscrowUntilTimestamp'

describe('getEscrowUntilTimestamp', () => {
  it('should return undefined when both inputs are undefined', () => {
    expect(getEscrowUntilTimestamp(undefined, undefined)).toEqual(undefined)
  })

  it('should return escrowUntil when tokenUntil is undefined', () => {
    const escrowUntil = new UnixTime(1000)
    expect(getEscrowUntilTimestamp(undefined, escrowUntil)).toEqual(escrowUntil)
  })

  it('should return tokenUntil when escrowUntil is undefined', () => {
    const tokenUntil = new UnixTime(2000)
    expect(getEscrowUntilTimestamp(tokenUntil, undefined)).toEqual(tokenUntil)
  })

  it('should return the earlier timestamp when both inputs are defined', () => {
    const earlier = new UnixTime(3000)
    const later = new UnixTime(4000)
    expect(getEscrowUntilTimestamp(earlier, later)).toEqual(earlier)
    expect(getEscrowUntilTimestamp(later, earlier)).toEqual(earlier)
  })

  it('should return the same timestamp when both inputs are equal', () => {
    const sameTime = new UnixTime(5000)
    expect(getEscrowUntilTimestamp(sameTime, sameTime)).toEqual(sameTime)
  })
})
