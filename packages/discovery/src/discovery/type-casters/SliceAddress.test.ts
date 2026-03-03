import { expect } from 'earl'
import { utils } from 'ethers'
import { SliceAddress } from './SliceAddress'

describe('SliceAddress', () => {
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

  it('extracts proposer at offset 124', () => {
    const result = SliceAddress.cast({ offset: 124 }, REAL_GAME_ARGS)
    expect(result).toEqual(
      utils.getAddress('0x4a4962275df8c60a80d3a25faec5aa7de116a746'),
    )
  })

  it('extracts challenger at offset 144', () => {
    const result = SliceAddress.cast({ offset: 144 }, REAL_GAME_ARGS)
    expect(result).toEqual(
      utils.getAddress('0x09f7150d8c019bef34450d6920f6b3608cefdaf2'),
    )
  })

  it('extracts vm at offset 32', () => {
    const result = SliceAddress.cast({ offset: 32 }, REAL_GAME_ARGS)
    expect(result).toEqual(
      utils.getAddress('0xe27b397668a333c4ff3d1dea8ac0b9d26e543b20'),
    )
  })

  it('returns UNRESOLVED for non-0x input (EXPECT_REVERT)', () => {
    const result = SliceAddress.cast({ offset: 124 }, 'EXPECT_REVERT')
    expect(result).toEqual('UNRESOLVED')
  })

  it('returns UNRESOLVED for empty bytes (0x)', () => {
    const result = SliceAddress.cast({ offset: 124 }, '0x')
    expect(result).toEqual('UNRESOLVED')
  })

  it('returns UNRESOLVED when offset exceeds data length', () => {
    const result = SliceAddress.cast({ offset: 124 }, '0x' + '00'.repeat(10))
    expect(result).toEqual('UNRESOLVED')
  })

  it('returns UNRESOLVED for zero address at offset', () => {
    const data = '0x' + '00'.repeat(124) + '0'.repeat(40) + '00'.repeat(20)
    const result = SliceAddress.cast({ offset: 124 }, data)
    expect(result).toEqual('UNRESOLVED')
  })

  it('throws if value is not a string', () => {
    expect(() => SliceAddress.cast({ offset: 0 }, 42)).toThrow(
      'Value must be a hex string',
    )
  })

  it('throws if offset is not a number', () => {
    expect(() =>
      SliceAddress.cast({ offset: 'abc' }, '0x' + 'ab'.repeat(20)),
    ).toThrow('offset must be a number')
  })
})
