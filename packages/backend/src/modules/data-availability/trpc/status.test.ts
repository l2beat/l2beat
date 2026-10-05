import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type {
  BlockDaIndexedConfig,
  DataAvailabilityTrackingConfig,
} from '../../../config/Config'
import { getDaTrackingStatusRows, STALE_AFTER_SECONDS } from './status'

describe(getDaTrackingStatusRows.name, () => {
  const now = UnixTime(1_700_000_000)

  it('returns only active configs', () => {
    const result = getDaTrackingStatusRows({
      configs: mockTrackingConfig({
        blockProjects: [
          mockEthereumConfig({ configurationId: 'active-ethereum' }),
          mockEthereumConfig({
            configurationId: 'ended-ethereum',
            untilBlock: 123,
          }),
        ],
      }),
      latestTimestamps: [
        {
          configurationId: 'active-ethereum',
          latestTimestamp: now - UnixTime.HOUR,
        },
      ],
      now,
    })

    expect(result.map((row) => row.configId)).toEqual(['active-ethereum'])
  })

  it('marks configs as missing, stale, or fresh and sorts urgent rows first', () => {
    const result = getDaTrackingStatusRows({
      configs: mockTrackingConfig({
        blockProjects: [
          mockEthereumConfig({ configurationId: 'fresh' }),
          mockEthereumConfig({ configurationId: 'missing' }),
          mockEthereumConfig({ configurationId: 'stale' }),
        ],
      }),
      latestTimestamps: [
        {
          configurationId: 'fresh',
          latestTimestamp: now - UnixTime.HOUR,
        },
        {
          configurationId: 'stale',
          latestTimestamp: now - STALE_AFTER_SECONDS - 1,
        },
      ],
      now,
    })

    expect(result.map((row) => [row.configId, row.status])).toEqual([
      ['stale', 'stale'],
      ['missing', 'missing'],
      ['fresh', 'fresh'],
    ])
  })

  it('maps config details and since fields', () => {
    const result = getDaTrackingStatusRows({
      configs: mockTrackingConfig({
        blockProjects: [
          mockBaseLayerConfig(),
          mockEthereumConfig({
            configurationId: 'ethereum',
            inbox: '0x123',
            sequencers: ['0x456'],
            topics: ['0x789'],
          }),
        ],
      }),
      latestTimestamps: [],
      now,
    })

    const rowsByConfigId = new Map(result.map((row) => [row.configId, row]))

    expect(rowsByConfigId.get('base-layer')).toEqual({
      configId: 'base-layer',
      type: 'baseLayer',
      projectId: 'ethereum',
      daLayer: 'ethereum',
      sinceBlock: 100,
      latestTimestamp: undefined,
      ageSeconds: undefined,
      details: 'base layer',
      status: 'missing',
    })
    expect(rowsByConfigId.get('ethereum')?.details).toEqual(
      'inbox: 0x123; sequencers: 0x456; topics: 0x789',
    )
  })
})

function mockTrackingConfig(
  config: Partial<DataAvailabilityTrackingConfig>,
): DataAvailabilityTrackingConfig {
  return {
    blockLayers: [],
    blockProjects: [],
    ...config,
  }
}

function mockBaseLayerConfig(): BlockDaIndexedConfig {
  return {
    configurationId: 'base-layer',
    projectId: ProjectId('ethereum'),
    type: 'baseLayer',
    daLayer: 'ethereum',
    sinceBlock: 100,
  }
}

function mockEthereumConfig(
  config: Partial<Extract<BlockDaIndexedConfig, { type: 'ethereum' }>> = {},
): BlockDaIndexedConfig {
  return {
    configurationId: 'ethereum',
    projectId: ProjectId('project-a'),
    type: 'ethereum',
    daLayer: ProjectId('ethereum'),
    inbox: '0x0000000000000000000000000000000000000001',
    sinceBlock: 100,
    ...config,
  }
}
