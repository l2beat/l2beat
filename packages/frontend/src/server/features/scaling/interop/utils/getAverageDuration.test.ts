import { expect } from 'earl'
import type { CommonInteropData, DurationSplitMap } from '../types'
import { getAverageDuration } from './getAverageDuration'

describe(getAverageDuration.name, () => {
  it('returns transfer-type based split durations from config order', () => {
    const result = getAverageDuration(
      'stargate',
      ['nonMinting'],
      commonInteropData({
        transferCount: 7,
        totalDurationSum: 730,
        transferTypeStats: {
          bus: { transferCount: 2, totalDurationSum: 120 },
          taxi: { transferCount: 4, totalDurationSum: 520 },
          express: { transferCount: 1, totalDurationSum: 90 },
        },
      }),
      new Map([
        [
          'stargate',
          new Map([
            [
              'nonMinting',
              [
                { label: 'Bus', transferTypes: ['bus'] },
                { label: 'Taxi', transferTypes: ['taxi'] },
              ],
            ],
          ]),
        ],
      ]) satisfies DurationSplitMap,
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
    const result = getAverageDuration(
      'canonical',
      ['lockAndMint'],
      commonInteropData({
        transferCount: 3,
        totalDurationSum: 480,
        transferTypeStats: {
          deposit: { transferCount: 2, totalDurationSum: 180 },
          withdraw: { transferCount: 1, totalDurationSum: 300 },
        },
      }),
      new Map([
        [
          'canonical',
          new Map([
            [
              'lockAndMint',
              [
                { label: 'L1 -> L2', transferTypes: [] },
                { label: 'L2 -> L1', transferTypes: [] },
              ],
            ],
          ]),
        ],
      ]) satisfies DurationSplitMap,
    )

    expect(result).toEqual({
      type: 'single',
      duration: 160,
    })
  })

  it('keeps configured splits even when a subset has no matching transfers', () => {
    const result = getAverageDuration(
      'stargate',
      ['nonMinting'],
      commonInteropData({
        transferCount: 4,
        totalDurationSum: 260,
        transferTypeStats: {
          taxi: { transferCount: 4, totalDurationSum: 260 },
        },
      }),
      new Map([
        [
          'stargate',
          new Map([
            [
              'nonMinting',
              [
                { label: 'Bus', transferTypes: ['bus'] },
                { label: 'Taxi', transferTypes: ['taxi'] },
              ],
            ],
          ]),
        ],
      ]) satisfies DurationSplitMap,
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
    const result = getAverageDuration(
      'stargate',
      ['nonMinting'],
      commonInteropData({
        transferCount: 4,
        totalDurationSum: 260,
        transferTypeStats: undefined,
      }),
      new Map([
        [
          'stargate',
          new Map([
            [
              'nonMinting',
              [
                { label: 'Bus', transferTypes: ['bus'] },
                { label: 'Taxi', transferTypes: ['taxi'] },
              ],
            ],
          ]),
        ],
      ]) satisfies DurationSplitMap,
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
    const result = getAverageDuration(
      'protocol',
      ['lockAndMint', 'nonMinting'],
      commonInteropData({
        transferCount: 6,
        totalDurationSum: 390,
        transferTypeStats: {
          bus: { transferCount: 3, totalDurationSum: 150 },
          taxi: { transferCount: 3, totalDurationSum: 240 },
        },
      }),
      new Map([
        [
          'protocol',
          new Map([
            [
              'lockAndMint',
              [
                { label: 'Bus', transferTypes: ['bus', 'express'] },
                { label: 'Taxi', transferTypes: ['taxi'] },
              ],
            ],
            [
              'nonMinting',
              [
                { label: 'Bus', transferTypes: ['express', 'bus'] },
                { label: 'Taxi', transferTypes: ['taxi'] },
              ],
            ],
          ]),
        ],
      ]) satisfies DurationSplitMap,
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
    const result = getAverageDuration(
      'protocol',
      ['lockAndMint', 'nonMinting'],
      commonInteropData({
        transferCount: 6,
        totalDurationSum: 390,
        transferTypeStats: {
          bus: { transferCount: 3, totalDurationSum: 150 },
          taxi: { transferCount: 3, totalDurationSum: 240 },
        },
      }),
      new Map([
        [
          'protocol',
          new Map([
            [
              'lockAndMint',
              [
                { label: 'Bus', transferTypes: ['bus', 'express'] },
                { label: 'Taxi', transferTypes: ['taxi'] },
              ],
            ],
            [
              'nonMinting',
              [
                { label: 'Taxi', transferTypes: ['taxi'] },
                { label: 'Bus', transferTypes: ['express', 'bus'] },
              ],
            ],
          ]),
        ],
      ]) satisfies DurationSplitMap,
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
    const result = getAverageDuration(
      'protocol',
      ['lockAndMint', 'nonMinting'],
      commonInteropData({
        transferCount: 4,
        totalDurationSum: 260,
        transferTypeStats: {
          bus: { transferCount: 2, totalDurationSum: 120 },
          taxi: { transferCount: 2, totalDurationSum: 140 },
        },
      }),
      new Map([
        [
          'protocol',
          new Map([
            [
              'lockAndMint',
              [
                { label: 'Bus', transferTypes: ['bus'] },
                { label: 'Taxi', transferTypes: ['taxi'] },
              ],
            ],
            [
              'nonMinting',
              [
                { label: 'Fast', transferTypes: ['bus'] },
                { label: 'Taxi', transferTypes: ['taxi'] },
              ],
            ],
          ]),
        ],
      ]) satisfies DurationSplitMap,
    )

    expect(result).toEqual({
      type: 'single',
      duration: 65,
    })
  })
})

function commonInteropData(
  overrides: Partial<CommonInteropData> = {},
): CommonInteropData {
  return {
    volume: 0,
    transferCount: 0,
    totalDurationSum: 0,
    transferTypeStats: undefined,
    minTransferValueUsd: undefined,
    maxTransferValueUsd: undefined,
    mintedValueUsd: undefined,
    burnedValueUsd: undefined,
    ...overrides,
  }
}
