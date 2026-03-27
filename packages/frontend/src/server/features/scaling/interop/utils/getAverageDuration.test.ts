import type { InteropDurationSplit, Project } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { CommonInteropData } from '../types'
import { getAverageDuration, getDurationSplit } from './getAverageDuration'

describe(getAverageDuration.name, () => {
  it('returns transfer-type based split durations from config order', () => {
    const durationSplit = getDurationSplit(
      interopProject('stargate', {
        nonMinting: [
          { label: 'Bus', transferTypes: ['bus'] },
          { label: 'Taxi', transferTypes: ['taxi'] },
        ],
      }),
      ['nonMinting'],
    )
    const result = getAverageDuration(
      commonInteropData({
        transferCount: 7,
        totalDurationSum: 730,
        transferTypeStats: {
          bus: { transferCount: 2, totalDurationSum: 120 },
          taxi: { transferCount: 4, totalDurationSum: 520 },
          express: { transferCount: 1, totalDurationSum: 90 },
        },
      }),
      durationSplit,
    )

    expect(result).toEqual({
      type: 'split',
      splits: [
        { label: 'Bus', duration: 60 },
        { label: 'Taxi', duration: 130 },
      ],
    })
  })

  it('falls back to a single duration while transfer type config is still empty', () => {
    const durationSplit = getDurationSplit(
      interopProject('canonical', {
        lockAndMint: [
          { label: 'L1 -> L2', transferTypes: [] },
          { label: 'L2 -> L1', transferTypes: [] },
        ],
      }),
      ['lockAndMint'],
    )
    const result = getAverageDuration(
      commonInteropData({
        transferCount: 3,
        totalDurationSum: 480,
        transferTypeStats: {
          deposit: { transferCount: 2, totalDurationSum: 180 },
          withdraw: { transferCount: 1, totalDurationSum: 300 },
        },
      }),
      durationSplit,
    )

    expect(result).toEqual({
      type: 'single',
      duration: 160,
    })
  })

  it('uses only transfers with known duration in single mode', () => {
    const result = getAverageDuration(
      commonInteropData({
        transferCount: 6,
        transfersWithDurationCount: 3,
        totalDurationSum: 480,
        transferTypeStats: undefined,
      }),
      undefined,
    )

    expect(result).toEqual({
      type: 'single',
      duration: 160,
    })
  })

  it('uses only transfers with known duration in split mode', () => {
    const durationSplit = getDurationSplit(
      interopProject('stargate', {
        nonMinting: [
          { label: 'Bus', transferTypes: ['bus'] },
          { label: 'Taxi', transferTypes: ['taxi'] },
        ],
      }),
      ['nonMinting'],
    )
    const result = getAverageDuration(
      commonInteropData({
        transferCount: 10,
        transfersWithDurationCount: 4,
        totalDurationSum: 200,
        transferTypeStats: {
          bus: { transferCount: 1, totalDurationSum: 50 },
          taxi: { transferCount: 3, totalDurationSum: 150 },
        },
      }),
      durationSplit,
    )

    expect(result).toEqual({
      type: 'split',
      splits: [
        { label: 'Bus', duration: 50 },
        { label: 'Taxi', duration: 50 },
      ],
    })
  })

  it('returns null in single mode when no transfer has duration', () => {
    const result = getAverageDuration(
      commonInteropData({
        transferCount: 3,
        transfersWithDurationCount: 0,
        totalDurationSum: 0,
        transferTypeStats: undefined,
      }),
      undefined,
    )

    expect(result).toEqual(null)
  })

  it('keeps configured splits even when a subset has no matching transfers', () => {
    const durationSplit = getDurationSplit(
      interopProject('stargate', {
        nonMinting: [
          { label: 'Bus', transferTypes: ['bus'] },
          { label: 'Taxi', transferTypes: ['taxi'] },
        ],
      }),
      ['nonMinting'],
    )
    const result = getAverageDuration(
      commonInteropData({
        transferCount: 4,
        totalDurationSum: 260,
        transferTypeStats: {
          taxi: { transferCount: 4, totalDurationSum: 260 },
        },
      }),
      durationSplit,
    )

    expect(result).toEqual({
      type: 'split',
      splits: [
        { label: 'Bus', duration: null },
        { label: 'Taxi', duration: 65 },
      ],
    })
  })

  it('keeps configured splits even when transfer type stats are empty', () => {
    const durationSplit = getDurationSplit(
      interopProject('stargate', {
        nonMinting: [
          { label: 'Bus', transferTypes: ['bus'] },
          { label: 'Taxi', transferTypes: ['taxi'] },
        ],
      }),
      ['nonMinting'],
    )
    const result = getAverageDuration(
      commonInteropData({
        transferCount: 4,
        totalDurationSum: 260,
        transferTypeStats: undefined,
      }),
      durationSplit,
    )

    expect(result).toEqual({
      type: 'split',
      splits: [
        { label: 'Bus', duration: null },
        { label: 'Taxi', duration: null },
      ],
    })
  })

  it('uses merged data when all relevant bridge type configs match', () => {
    const durationSplit = getDurationSplit(
      interopProject('protocol', {
        lockAndMint: [
          { label: 'Bus', transferTypes: ['bus', 'express'] },
          { label: 'Taxi', transferTypes: ['taxi'] },
        ],
        nonMinting: [
          { label: 'Bus', transferTypes: ['express', 'bus'] },
          { label: 'Taxi', transferTypes: ['taxi'] },
        ],
      }),
      ['lockAndMint', 'nonMinting'],
    )
    const result = getAverageDuration(
      commonInteropData({
        transferCount: 6,
        totalDurationSum: 390,
        transferTypeStats: {
          bus: { transferCount: 3, totalDurationSum: 150 },
          taxi: { transferCount: 3, totalDurationSum: 240 },
        },
      }),
      durationSplit,
    )

    expect(result).toEqual({
      type: 'split',
      splits: [
        { label: 'Bus', duration: 50 },
        { label: 'Taxi', duration: 80 },
      ],
    })
  })

  it('matches split configs even when entries are configured in different order', () => {
    const durationSplit = getDurationSplit(
      interopProject('protocol', {
        lockAndMint: [
          { label: 'Bus', transferTypes: ['bus', 'express'] },
          { label: 'Taxi', transferTypes: ['taxi'] },
        ],
        nonMinting: [
          { label: 'Taxi', transferTypes: ['taxi'] },
          { label: 'Bus', transferTypes: ['express', 'bus'] },
        ],
      }),
      ['lockAndMint', 'nonMinting'],
    )
    const result = getAverageDuration(
      commonInteropData({
        transferCount: 6,
        totalDurationSum: 390,
        transferTypeStats: {
          bus: { transferCount: 3, totalDurationSum: 150 },
          taxi: { transferCount: 3, totalDurationSum: 240 },
        },
      }),
      durationSplit,
    )

    expect(result).toEqual({
      type: 'split',
      splits: [
        { label: 'Bus', duration: 50 },
        { label: 'Taxi', duration: 80 },
      ],
    })
  })

  it('falls back to a single duration when relevant bridge type configs differ', () => {
    const durationSplit = getDurationSplit(
      interopProject('protocol', {
        lockAndMint: [
          { label: 'Bus', transferTypes: ['bus'] },
          { label: 'Taxi', transferTypes: ['taxi'] },
        ],
        nonMinting: [
          { label: 'Fast', transferTypes: ['bus'] },
          { label: 'Taxi', transferTypes: ['taxi'] },
        ],
      }),
      ['lockAndMint', 'nonMinting'],
    )
    const result = getAverageDuration(
      commonInteropData({
        transferCount: 4,
        totalDurationSum: 260,
        transferTypeStats: {
          bus: { transferCount: 2, totalDurationSum: 120 },
          taxi: { transferCount: 2, totalDurationSum: 140 },
        },
      }),
      durationSplit,
    )

    expect(result).toEqual({
      type: 'single',
      duration: 65,
    })
  })
})

function interopProject(
  id: string,
  durationSplit: Record<string, InteropDurationSplit>,
): Project<'interopConfig'> {
  return {
    id: ProjectId(id),
    interopConfig: {
      durationSplit,
    },
  } as unknown as Project<'interopConfig'>
}

function commonInteropData(
  overrides: Partial<CommonInteropData> = {},
): CommonInteropData {
  const transferCount = overrides.transferCount ?? 0
  return {
    volume: 0,
    transferCount,
    transfersWithDurationCount:
      overrides.transfersWithDurationCount ?? transferCount,
    totalDurationSum: 0,
    transferTypeStats: undefined,
    minTransferValueUsd: undefined,
    maxTransferValueUsd: undefined,
    mintedValueUsd: undefined,
    burnedValueUsd: undefined,
    ...overrides,
  }
}
