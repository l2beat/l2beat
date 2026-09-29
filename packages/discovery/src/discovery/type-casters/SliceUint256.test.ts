import { expect } from 'earl'
import { SliceUint256 } from './SliceUint256'

describe('SliceUint256', () => {
  it('extracts a uint256 at the requested byte offset', () => {
    const value = '0x' + '11'.repeat(20) + '00'.repeat(30) + 'def1'
    expect(SliceUint256.cast({ offset: 20 }, value)).toEqual(57073)
  })

  it('keeps integers larger than the safe number range as strings', () => {
    const value = '0x' + '00'.repeat(24) + 'ffffffffffffffff'
    expect(SliceUint256.cast({ offset: 0 }, value)).toEqual(
      '18446744073709551615',
    )
  })

  it('returns UNRESOLVED for non-hex and too-short values', () => {
    expect(SliceUint256.cast({ offset: 0 }, 'EXPECT_REVERT')).toEqual(
      'UNRESOLVED',
    )
    expect(SliceUint256.cast({ offset: 1 }, '0x' + '00'.repeat(32))).toEqual(
      'UNRESOLVED',
    )
  })
})
