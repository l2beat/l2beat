import type { InteropConfig } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  getAverageTransferTime,
  getAverageTransferTimeSeconds,
  getProtocolAverageTransferTime,
  hasUnknownTransferTime,
  type ProjectMetadata,
} from './getAverageTransferTime'

describe('getAverageTransferTime', () => {
  it('returns null when there are no transfers with duration', () => {
    expect(
      getAverageTransferTime(
        {
          transfersWithDurationCount: 0,
          totalDurationSum: 100,
          transferTypeStats: undefined,
        },
        undefined,
      ),
    ).toEqual(null)
  })

  it('returns a single average when there is no duration split', () => {
    expect(
      getAverageTransferTime(
        {
          transfersWithDurationCount: 3,
          totalDurationSum: 370,
          transferTypeStats: undefined,
        },
        undefined,
      ),
    ).toEqual({
      type: 'single',
      duration: 123,
    })
  })

  it('returns split averages when split config is provided', () => {
    expect(
      getAverageTransferTime(
        {
          transfersWithDurationCount: 3,
          totalDurationSum: 360,
          transferTypeStats: {
            bus: { transferCount: 1, totalDurationSum: 60 },
            taxi: { transferCount: 2, totalDurationSum: 300 },
          },
        },
        [
          { label: 'Bus', transferTypes: ['bus'] },
          { label: 'Taxi', transferTypes: ['taxi'] },
        ],
      ),
    ).toEqual({
      type: 'split',
      splits: [
        { label: 'Bus', duration: 60 },
        { label: 'Taxi', duration: 150 },
      ],
    })
  })
})

describe('getAverageTransferTimeSeconds', () => {
  it('returns null when there are no transfers with duration', () => {
    expect(
      getAverageTransferTimeSeconds({
        transfersWithDurationCount: 0,
        totalDurationSum: 100,
        transferTypeStats: undefined,
      }),
    ).toEqual(null)
  })

  it('returns floored average duration in seconds', () => {
    expect(
      getAverageTransferTimeSeconds({
        transfersWithDurationCount: 3,
        totalDurationSum: 370,
        transferTypeStats: undefined,
      }),
    ).toEqual(123)
  })
})

describe('getProtocolAverageTransferTime', () => {
  it('returns unknown when project duration is configured as unknown', () => {
    expect(
      getProtocolAverageTransferTime({
        transfersWithDurationCount: 1,
        totalDurationSum: 100,
        transferTypeStats: undefined,
        project: interopProject('relay', {
          name: 'Relay',
          slug: 'relay',
          transfersTimeMode: 'unknown',
        }),
      }),
    ).toEqual({ type: 'unknown' })
  })

  it('uses the shared duration split when all bridge types match', () => {
    expect(
      getProtocolAverageTransferTime({
        transfersWithDurationCount: 3,
        totalDurationSum: 360,
        transferTypeStats: {
          bus: { transferCount: 1, totalDurationSum: 60 },
          taxi: { transferCount: 2, totalDurationSum: 300 },
        },
        project: interopProject('stargate', {
          name: 'Stargate',
          slug: 'stargate',
          durationSplit: {
            nonMinting: [
              { label: 'Bus', transferTypes: ['bus'] },
              { label: 'Taxi', transferTypes: ['taxi'] },
            ],
            lockAndMint: [
              { label: 'Taxi', transferTypes: ['taxi'] },
              { label: 'Bus', transferTypes: ['bus'] },
            ],
          },
          plugins: [
            { plugin: 'relay', bridgeType: 'nonMinting' },
            { plugin: 'across', bridgeType: 'lockAndMint' },
          ],
        }),
      }),
    ).toEqual({
      type: 'split',
      splits: [
        { label: 'Bus', duration: 60 },
        { label: 'Taxi', duration: 150 },
      ],
    })
  })

  it('falls back to a single average when bridge type splits differ', () => {
    expect(
      getProtocolAverageTransferTime({
        transfersWithDurationCount: 3,
        totalDurationSum: 360,
        transferTypeStats: {
          bus: { transferCount: 1, totalDurationSum: 60 },
          taxi: { transferCount: 2, totalDurationSum: 300 },
        },
        project: interopProject('stargate', {
          name: 'Stargate',
          slug: 'stargate',
          durationSplit: {
            nonMinting: [
              { label: 'Bus', transferTypes: ['bus'] },
              { label: 'Taxi', transferTypes: ['taxi'] },
            ],
            lockAndMint: [{ label: 'Fast lane', transferTypes: ['taxi'] }],
          },
          plugins: [
            { plugin: 'relay', bridgeType: 'nonMinting' },
            { plugin: 'across', bridgeType: 'lockAndMint' },
          ],
        }),
      }),
    ).toEqual({
      type: 'single',
      duration: 120,
    })
  })
})

describe('hasUnknownTransferTime', () => {
  it('returns true only for projects configured as unknown', () => {
    expect(hasUnknownTransferTime(undefined)).toEqual(false)
    expect(
      hasUnknownTransferTime(
        interopProject('relay', {
          name: 'Relay',
          slug: 'relay',
          transfersTimeMode: 'unknown',
        }),
      ),
    ).toEqual(true)
  })
})

function interopProject(
  id: string,
  overrides: {
    name: string
    slug: string
    transfersTimeMode?: 'unknown'
    durationSplit?: InteropConfig['durationSplit']
    plugins?: InteropConfig['plugins']
  },
): ProjectMetadata {
  const interopConfig: InteropConfig = {
    name: overrides.name,
    type: 'canonical',
    transfersTimeMode: overrides.transfersTimeMode,
    durationSplit: overrides.durationSplit,
    plugins: overrides.plugins ?? [
      { plugin: 'relay', bridgeType: 'nonMinting' },
    ],
  }

  return {
    id: ProjectId(id),
    name: overrides.name,
    slug: overrides.slug,
    interopConfig,
  }
}
