import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type {
  BlockDaIndexedConfig,
  DataAvailabilityTrackingConfig,
  TimestampDaIndexedConfig,
} from '../../../config/Config'
import { getDaTrackingStatusRows, STALE_AFTER_SECONDS } from './status'

describe(getDaTrackingStatusRows.name, () => {
  const now = UnixTime(1_700_000_000)

  it('returns active block and timestamp configs', () => {
    const result = getDaTrackingStatusRows({
      configs: mockTrackingConfig({
        blockProjects: [
          mockEthereumConfig({ configurationId: 'active-ethereum' }),
          mockEthereumConfig({
            configurationId: 'ended-ethereum',
            untilBlock: 123,
          }),
        ],
        timestampProjects: [
          mockEigenConfig({ configurationId: 'active-eigen-da' }),
          mockEigenConfig({
            configurationId: 'ended-eigen-da',
            untilTimestamp: now,
          }),
        ],
      }),
      latestTimestamps: [
        {
          configurationId: 'active-ethereum',
          latestTimestamp: now - UnixTime.HOUR,
        },
        {
          configurationId: 'active-eigen-da',
          latestTimestamp: now - UnixTime.HOUR,
        },
      ],
      now,
    })

    expect(result.map((row) => row.configId)).toEqual([
      'active-eigen-da',
      'active-ethereum',
    ])
  })

  it('marks configs as missing, stale, or fresh and sorts urgent rows first', () => {
    const result = getDaTrackingStatusRows({
      configs: mockTrackingConfig({
        blockProjects: [
          mockCelestiaConfig({ configurationId: 'fresh' }),
          mockCelestiaConfig({ configurationId: 'missing' }),
          mockCelestiaConfig({ configurationId: 'stale' }),
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
            calls: [{ selector: '0x12345678', firstParameter: '0xabc' }],
          }),
          mockCelestiaConfig({
            configurationId: 'celestia',
            namespace: 'namespace',
          }),
          mockAvailConfig({
            configurationId: 'avail',
            appIds: ['1', '2'],
          }),
        ],
        timestampProjects: [
          mockEigenConfig({
            configurationId: 'eigenda',
            customerId: 'customer',
            sinceTimestamp: now - UnixTime.DAY,
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
      since: 100,
      sinceUnit: 'block',
      latestTimestamp: undefined,
      ageSeconds: undefined,
      details: 'base layer',
      status: 'missing',
    })
    expect(rowsByConfigId.get('ethereum')?.details).toEqual(
      'calls: 0x12345678(0xabc)',
    )
    expect(rowsByConfigId.get('celestia')?.details).toEqual(
      'namespace: namespace',
    )
    expect(rowsByConfigId.get('avail')?.details).toEqual('app IDs: 1, 2')
    expect(rowsByConfigId.get('eigenda')).toEqual({
      configId: 'eigenda',
      type: 'eigen-da',
      projectId: 'project-a',
      daLayer: 'eigenda',
      since: now - UnixTime.DAY,
      sinceUnit: 'timestamp',
      latestTimestamp: undefined,
      ageSeconds: undefined,
      details: 'customer ID: customer',
      status: 'missing',
    })
  })
})

function mockTrackingConfig(
  config: Partial<DataAvailabilityTrackingConfig>,
): DataAvailabilityTrackingConfig {
  return {
    blockLayers: [],
    timestampLayers: [],
    blockProjects: [],
    timestampProjects: [],
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

function mockCelestiaConfig(
  config: Partial<Extract<BlockDaIndexedConfig, { type: 'celestia' }>> = {},
): BlockDaIndexedConfig {
  return {
    configurationId: 'celestia',
    projectId: ProjectId('project-a'),
    type: 'celestia',
    daLayer: ProjectId('celestia'),
    namespace: 'namespace',
    sinceBlock: 100,
    ...config,
  }
}

function mockAvailConfig(
  config: Partial<Extract<BlockDaIndexedConfig, { type: 'avail' }>> = {},
): BlockDaIndexedConfig {
  return {
    configurationId: 'avail',
    projectId: ProjectId('project-a'),
    type: 'avail',
    daLayer: ProjectId('avail'),
    appIds: ['1'],
    sinceBlock: 100,
    ...config,
  }
}

function mockEigenConfig(
  config: Partial<Extract<TimestampDaIndexedConfig, { type: 'eigen-da' }>> = {},
): TimestampDaIndexedConfig {
  return {
    configurationId: 'eigenda',
    projectId: ProjectId('project-a'),
    type: 'eigen-da',
    daLayer: ProjectId('eigenda'),
    customerId: 'customer',
    sinceTimestamp: UnixTime(1_600_000_000),
    ...config,
  }
}
