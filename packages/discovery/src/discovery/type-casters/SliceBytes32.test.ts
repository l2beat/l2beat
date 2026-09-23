import { expect } from 'earl'
import { SliceBytes32 } from './SliceBytes32'

describe('SliceBytes32', () => {
  it('extracts 32 bytes at the requested byte offset', () => {
    const value = '0x' + '11'.repeat(20) + 'ab'.repeat(32) + '22'.repeat(20)
    expect(SliceBytes32.cast({ offset: 20 }, value)).toEqual(
      '0x' + 'ab'.repeat(32),
    )
  })

  it('returns UNRESOLVED for non-hex and too-short values', () => {
    expect(SliceBytes32.cast({ offset: 0 }, 'EXPECT_REVERT')).toEqual(
      'UNRESOLVED',
    )
    expect(SliceBytes32.cast({ offset: 1 }, '0x' + '00'.repeat(32))).toEqual(
      'UNRESOLVED',
    )
  })
})
