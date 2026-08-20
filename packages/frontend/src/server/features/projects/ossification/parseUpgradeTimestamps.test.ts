import { expect } from 'earl'
import {
  deduplicateUpgradeTimestamps,
  parseUpgradeTimestamps,
} from './parseUpgradeTimestamps'

describe(parseUpgradeTimestamps.name, () => {
  it('counts an upgrade-and-restore transaction as one event', () => {
    const result = parseUpgradeTimestamps([
      ['2026-04-20T00:00:00.000Z', '0xinitial', ['eth:0x111']],
      ['2026-04-21T03:26:47.000Z', '0xroundtrip', ['eth:0x222']],
      ['2026-04-21T03:26:47.000Z', '0xroundtrip', ['eth:0x111']],
    ])

    expect(result).toEqual([1776643200, 1776742007])
  })

  it('preserves separate transactions with the same block timestamp', () => {
    const result = parseUpgradeTimestamps([
      ['2026-04-21T03:26:47.000Z', '0xaaa', ['eth:0x111']],
      ['2026-04-21T03:26:47.000Z', '0xbbb', ['eth:0x222']],
    ])

    expect(result).toEqual([1776742007, 1776742007])
  })

  it('ignores audited initialization or no-op transactions', () => {
    const result = parseUpgradeTimestamps(
      [
        ['2026-04-20T00:00:00.000Z', '0xinitial', ['eth:0x111']],
        ['2026-04-21T03:26:47.000Z', '0xnoop', ['eth:0x111']],
        ['2026-04-22T00:00:00.000Z', '0xchange', ['eth:0x222']],
      ],
      new Set(['0xnoop']),
    )

    expect(result).toEqual([1776643200, 1776816000])
  })
})

describe(deduplicateUpgradeTimestamps.name, () => {
  it('deduplicates legacy history where transaction hashes are unavailable', () => {
    expect(deduplicateUpgradeTimestamps([3, 2, 2, 1])).toEqual([1, 2, 3])
  })
})
