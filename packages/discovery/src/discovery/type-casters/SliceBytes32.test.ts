import { expect } from 'earl'
import { SliceBytes32 } from './SliceBytes32'

describe('SliceBytes32', () => {
  // Real PermissionedDisputeGameV2 gameArgs(1) from optimism mainnet:
  // absolutePrestate(32) + vm(20) + anchorStateRegistry(20) + weth(20) + l2ChainId(32) + proposer(20) + challenger(20)
  const REAL_GAME_ARGS =
    '0x03925ad159642352e17d51b8af131e88b55a59203f936c2c3f5e5bbc4de1ac75' + // absolutePrestate
    'e27b397668a333c4ff3d1dea8ac0b9d26e543b20' + // vm
    '95907a710b1cf148a101e4e6b8a3e3a60de0bf10' + // anchorStateRegistry
    '37bac764f7120f1dd1b3fccf23d751bb98c3b250' + // weth
    '000000000000000000000000000000000000000000000000000000000000000a' + // l2ChainId
    '4a4962275df8c60a80d3a25faec5aa7de116a746' + // proposer
    '09f7150d8c019bef34450d6920f6b3608cefdaf2' // challenger

  it('extracts absolutePrestate at offset 0', () => {
    const result = SliceBytes32.cast({ offset: 0 }, REAL_GAME_ARGS)
    expect(result).toEqual(
      '0x03925ad159642352e17d51b8af131e88b55a59203f936c2c3f5e5bbc4de1ac75',
    )
  })

  it('returns UNRESOLVED for non-0x input (EXPECT_REVERT)', () => {
    const result = SliceBytes32.cast({ offset: 0 }, 'EXPECT_REVERT')
    expect(result).toEqual('UNRESOLVED')
  })

  it('returns UNRESOLVED for empty bytes (0x)', () => {
    const result = SliceBytes32.cast({ offset: 0 }, '0x')
    expect(result).toEqual('UNRESOLVED')
  })

  it('returns UNRESOLVED when offset exceeds data length', () => {
    const result = SliceBytes32.cast({ offset: 32 }, '0x' + '00'.repeat(20))
    expect(result).toEqual('UNRESOLVED')
  })

  it('returns UNRESOLVED for a zero prestate at offset', () => {
    const result = SliceBytes32.cast({ offset: 0 }, '0x' + '00'.repeat(32))
    expect(result).toEqual('UNRESOLVED')
  })

  it('throws if value is not a string', () => {
    expect(() => SliceBytes32.cast({ offset: 0 }, 42)).toThrow(
      'Value must be a hex string',
    )
  })

  it('throws if offset is not a number', () => {
    expect(() => SliceBytes32.cast({ offset: 'abc' }, REAL_GAME_ARGS)).toThrow(
      'offset must be a number',
    )
  })
})
