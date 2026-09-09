import { expect } from 'earl'
import { CCIPAllowedFinality } from './CCIPAllowedFinality'

describe('CCIPAllowedFinality', () => {
  it('decodes finality-only configuration', () => {
    expect(CCIPAllowedFinality.cast({}, '0x00000000')).toEqual({
      raw: '0x00000000',
      fullFinalityAllowed: true,
      safeHeadAllowed: false,
      blockDepthsAllowed: false,
      minimumBlockDepth: 0,
      unassignedFlags: '0x0000',
    })
  })

  it('decodes a minimum block depth', () => {
    expect(CCIPAllowedFinality.cast({}, '0x00000001')).toEqual({
      raw: '0x00000001',
      fullFinalityAllowed: true,
      safeHeadAllowed: false,
      blockDepthsAllowed: true,
      minimumBlockDepth: 1,
      unassignedFlags: '0x0000',
    })
  })

  it('decodes safe-head plus block-depth configuration', () => {
    expect(CCIPAllowedFinality.cast({}, '0x00010001')).toEqual({
      raw: '0x00010001',
      fullFinalityAllowed: true,
      safeHeadAllowed: true,
      blockDepthsAllowed: true,
      minimumBlockDepth: 1,
      unassignedFlags: '0x0000',
    })
  })

  it('preserves unassigned flag bits', () => {
    expect(CCIPAllowedFinality.cast({}, '0x8000000c')).toEqual({
      raw: '0x8000000c',
      fullFinalityAllowed: true,
      safeHeadAllowed: false,
      blockDepthsAllowed: true,
      minimumBlockDepth: 12,
      unassignedFlags: '0x8000',
    })
  })
})
