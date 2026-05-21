import { expect } from 'earl'

import { CCIPCurseSubject } from './CCIPCurseSubject'

describe('CCIPCurseSubject', () => {
  it('decodes the global curse subject', () => {
    expect(
      CCIPCurseSubject.cast({}, '0x01000000000000000000000000000001'),
    ).toEqual('GLOBAL_CURSE')
  })

  it('decodes a chain-selector subject (last 8 bytes as uint64 decimal)', () => {
    // bytes16(uint128(1)) — smallest non-zero subject; trivial round-trip.
    expect(
      CCIPCurseSubject.cast({}, '0x00000000000000000000000000000010'),
    ).toEqual('16')
  })

  it('returns the value unchanged for unexpected encodings', () => {
    // First 8 bytes non-zero and not the global subject: shape we don't decode.
    expect(
      CCIPCurseSubject.cast({}, '0xdeadbeefcafebabedeadbeefcafebabe'),
    ).toEqual('0xdeadbeefcafebabedeadbeefcafebabe')
  })

  it('handles uppercase hex input', () => {
    expect(
      CCIPCurseSubject.cast(
        {},
        '0x01000000000000000000000000000001'.toUpperCase(),
      ),
    ).toEqual('GLOBAL_CURSE')
  })
})
