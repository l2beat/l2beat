import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../test/database'
import type { Clock } from '../../tools/Clock'
import { PrivacyRelayerSampler } from './PrivacyRelayerSampler'
import type {
  RailgunBroadcasterProvider,
  RailgunObservationResult,
} from './railgun/RailgunBroadcasterProvider'
import type { PrivacyRelayerSampleConfig } from './types'

const SAMPLE_TIME = UnixTime.fromDate(new Date('2026-08-20T12:00:00Z'))
const SAMPLE_DAY = UnixTime.toStartOf(SAMPLE_TIME, 'day')

describe(PrivacyRelayerSampler.name, () => {
  it('observes and saves a sample for the timestamp day', async () => {
    const provider = mockObject<RailgunBroadcasterProvider>({
      observe: mockFn().resolvesToOnce(
        observations([
          1,
          {
            uniqueRelayers: 46,
            messagesReceived: 1000,
            messagesParsed: 995,
            messagesAccepted: 990,
          },
        ]),
      ),
    })
    const privacyRelayerSample = mockObject<Database['privacyRelayerSample']>({
      getConfigurationIdsByTimestamp: mockFn().resolvesToOnce([]),
      upsertMany: mockFn().resolvesToOnce(1),
    })

    const sampler = createSampler(provider, privacyRelayerSample)
    await sampler.sample(SAMPLE_TIME)

    expect(provider.observe).toHaveBeenOnlyCalledWith({
      chainIds: [1],
      durationMs: 10 * 60 * 1000,
    })
    expect(privacyRelayerSample.upsertMany).toHaveBeenOnlyCalledWith([
      {
        configurationId: 'config-1',
        projectId: 'railgun',
        chain: 'ethereum',
        timestamp: SAMPLE_DAY,
        relayerCount: 46,
        messagesReceived: 1000,
        messagesParsed: 995,
        messagesAccepted: 990,
      },
    ])
  })

  it('skips configurations that already have a sample for the timestamp day', async () => {
    const provider = mockObject<RailgunBroadcasterProvider>({
      observe: mockFn(),
    })
    const privacyRelayerSample = mockObject<Database['privacyRelayerSample']>({
      getConfigurationIdsByTimestamp: mockFn().resolvesToOnce(['config-1']),
      upsertMany: mockFn(),
    })

    const sampler = createSampler(provider, privacyRelayerSample)
    await sampler.sample(SAMPLE_TIME)

    expect(provider.observe).not.toHaveBeenCalled()
    expect(privacyRelayerSample.upsertMany).not.toHaveBeenCalled()
  })

  it('skips configurations that have not started yet', async () => {
    const provider = mockObject<RailgunBroadcasterProvider>({
      observe: mockFn(),
    })
    const privacyRelayerSample = mockObject<Database['privacyRelayerSample']>({
      getConfigurationIdsByTimestamp: mockFn(),
      upsertMany: mockFn(),
    })

    const sampler = createSampler(provider, privacyRelayerSample, [
      configuration({ sinceTimestamp: SAMPLE_DAY + UnixTime.DAY }),
    ])
    await sampler.sample(SAMPLE_TIME)

    expect(
      privacyRelayerSample.getConfigurationIdsByTimestamp,
    ).not.toHaveBeenCalled()
    expect(provider.observe).not.toHaveBeenCalled()
    expect(privacyRelayerSample.upsertMany).not.toHaveBeenCalled()
  })

  it('does not save when the observation saw no messages', async () => {
    const provider = mockObject<RailgunBroadcasterProvider>({
      observe: mockFn().resolvesToOnce(
        observations([
          1,
          {
            uniqueRelayers: 0,
            messagesReceived: 0,
            messagesParsed: 0,
            messagesAccepted: 0,
          },
        ]),
      ),
    })
    const privacyRelayerSample = mockObject<Database['privacyRelayerSample']>({
      getConfigurationIdsByTimestamp: mockFn().resolvesToOnce([]),
      upsertMany: mockFn(),
    })

    const sampler = createSampler(provider, privacyRelayerSample)
    await sampler.sample(SAMPLE_TIME)

    expect(privacyRelayerSample.upsertMany).not.toHaveBeenCalled()
  })

  it('does not save when received messages cannot be parsed', async () => {
    const provider = mockObject<RailgunBroadcasterProvider>({
      observe: mockFn().resolvesToOnce(
        observations([
          1,
          {
            uniqueRelayers: 0,
            messagesReceived: 10,
            messagesParsed: 0,
            messagesAccepted: 0,
          },
        ]),
      ),
    })
    const privacyRelayerSample = mockObject<Database['privacyRelayerSample']>({
      getConfigurationIdsByTimestamp: mockFn().resolvesToOnce([]),
      upsertMany: mockFn(),
    })

    const sampler = createSampler(provider, privacyRelayerSample)
    await sampler.sample(SAMPLE_TIME)

    expect(privacyRelayerSample.upsertMany).not.toHaveBeenCalled()
  })

  it('does not save when observation transport fails', async () => {
    const provider = mockObject<RailgunBroadcasterProvider>({
      observe: mockFn().rejectsWithOnce(new Error('waku connect timeout')),
    })
    const privacyRelayerSample = mockObject<Database['privacyRelayerSample']>({
      getConfigurationIdsByTimestamp: mockFn().resolvesToOnce([]),
      upsertMany: mockFn(),
    })

    const sampler = createSampler(provider, privacyRelayerSample)
    await sampler.sample(SAMPLE_TIME)

    expect(privacyRelayerSample.upsertMany).not.toHaveBeenCalled()
  })

  it('saves zero when valid messages contain no eligible relayers', async () => {
    const provider = mockObject<RailgunBroadcasterProvider>({
      observe: mockFn().resolvesToOnce(
        observations([
          1,
          {
            uniqueRelayers: 0,
            messagesReceived: 10,
            messagesParsed: 10,
            messagesAccepted: 0,
          },
        ]),
      ),
    })
    const privacyRelayerSample = mockObject<Database['privacyRelayerSample']>({
      getConfigurationIdsByTimestamp: mockFn().resolvesToOnce([]),
      upsertMany: mockFn().resolvesToOnce(1),
    })

    const sampler = createSampler(provider, privacyRelayerSample)
    await sampler.sample(SAMPLE_TIME)

    expect(privacyRelayerSample.upsertMany).toHaveBeenOnlyCalledWith([
      {
        configurationId: 'config-1',
        projectId: 'railgun',
        chain: 'ethereum',
        timestamp: SAMPLE_DAY,
        relayerCount: 0,
        messagesReceived: 10,
        messagesParsed: 10,
        messagesAccepted: 0,
      },
    ])
  })

  it('observes all chains together and saves every sample atomically', async () => {
    const configurations = [
      configuration(),
      configuration({
        id: 'config-137',
        chain: 'polygonpos',
        chainId: 137,
      }),
    ]
    const provider = mockObject<RailgunBroadcasterProvider>({
      observe: mockFn().resolvesToOnce(
        observations([1, { uniqueRelayers: 10 }], [137, { uniqueRelayers: 5 }]),
      ),
    })
    const privacyRelayerSample = mockObject<Database['privacyRelayerSample']>({
      getConfigurationIdsByTimestamp: mockFn().resolvesToOnce([]),
      upsertMany: mockFn().resolvesToOnce(2),
    })
    const sampler = createSampler(
      provider,
      privacyRelayerSample,
      configurations,
    )

    await sampler.sample(SAMPLE_TIME)

    expect(provider.observe).toHaveBeenOnlyCalledWith({
      chainIds: [1, 137],
      durationMs: 10 * 60 * 1000,
    })
    expect(privacyRelayerSample.upsertMany).toHaveBeenOnlyCalledWith([
      {
        configurationId: 'config-1',
        projectId: 'railgun',
        chain: 'ethereum',
        timestamp: SAMPLE_DAY,
        relayerCount: 10,
        messagesReceived: 1,
        messagesParsed: 1,
        messagesAccepted: 1,
      },
      {
        configurationId: 'config-137',
        projectId: 'railgun',
        chain: 'polygonpos',
        timestamp: SAMPLE_DAY,
        relayerCount: 5,
        messagesReceived: 1,
        messagesParsed: 1,
        messagesAccepted: 1,
      },
    ])
  })

  it('persists healthy chains and retries only the unhealthy one later', async () => {
    const configurations = [
      configuration(),
      configuration({ id: 'config-137', chain: 'polygonpos', chainId: 137 }),
    ]
    const provider = mockObject<RailgunBroadcasterProvider>({
      observe: mockFn().resolvesToOnce(
        observations(
          [1, { uniqueRelayers: 10 }],
          [
            137,
            {
              uniqueRelayers: 0,
              messagesReceived: 0,
              messagesParsed: 0,
              messagesAccepted: 0,
            },
          ],
        ),
      ),
    })
    const privacyRelayerSample = mockObject<Database['privacyRelayerSample']>({
      getConfigurationIdsByTimestamp: mockFn().resolvesToOnce([]),
      upsertMany: mockFn().resolvesToOnce(1),
    })
    const sampler = createSampler(
      provider,
      privacyRelayerSample,
      configurations,
    )

    await sampler.sample(SAMPLE_TIME)

    expect(privacyRelayerSample.upsertMany).toHaveBeenOnlyCalledWith([
      {
        configurationId: 'config-1',
        projectId: 'railgun',
        chain: 'ethereum',
        timestamp: SAMPLE_DAY,
        relayerCount: 10,
        messagesReceived: 1,
        messagesParsed: 1,
        messagesAccepted: 1,
      },
    ])
  })

  it('samples on start and on each new hour', () => {
    const clock = mockObject<Clock>({
      getLastHour: mockFn().returnsOnce(SAMPLE_TIME),
      onNewHour: mockFn().returnsOnce(() => {}),
    })
    const privacyRelayerSample = mockObject<Database['privacyRelayerSample']>({
      getConfigurationIdsByTimestamp: mockFn().resolvesTo(['config-1']),
      upsertMany: mockFn(),
    })
    const sampler = createSampler(
      mockObject<RailgunBroadcasterProvider>({ observe: mockFn() }),
      privacyRelayerSample,
      [configuration()],
      clock,
    )

    sampler.start()

    expect(clock.onNewHour).toHaveBeenCalled()
    expect(clock.getLastHour).toHaveBeenOnlyCalledWith()
  })

  describe(PrivacyRelayerSampler.idToConfigurationId.name, () => {
    it('is deterministic for the same input', () => {
      const properties = sampleProperties()

      expect(PrivacyRelayerSampler.idToConfigurationId(properties)).toEqual(
        PrivacyRelayerSampler.idToConfigurationId(properties),
      )
    })

    it('differs by chain id', () => {
      const properties = sampleProperties()

      expect(PrivacyRelayerSampler.idToConfigurationId(properties)).not.toEqual(
        PrivacyRelayerSampler.idToConfigurationId({
          ...properties,
          chainId: 137,
        }),
      )
    })
  })
})

function createSampler(
  provider: RailgunBroadcasterProvider,
  privacyRelayerSample: Database['privacyRelayerSample'],
  configurations = [configuration()],
  clock: Clock = mockObject<Clock>(),
) {
  return new PrivacyRelayerSampler(
    {
      clock,
      configurations,
      provider,
      db: mockDatabase({ privacyRelayerSample }),
    },
    Logger.SILENT,
  )
}

function sampleProperties(): Omit<PrivacyRelayerSampleConfig, 'id'> {
  return {
    projectId: 'railgun',
    chain: 'ethereum',
    chainId: 1,
    sinceTimestamp: UnixTime(0),
  }
}

function configuration(
  overrides: Partial<PrivacyRelayerSampleConfig> = {},
): PrivacyRelayerSampleConfig {
  return {
    id: 'config-1',
    ...sampleProperties(),
    ...overrides,
  }
}

function observations(
  ...entries: [number, Partial<RailgunObservationResult>][]
): Map<number, RailgunObservationResult> {
  return new Map(
    entries.map(([chainId, overrides]) => [
      chainId,
      {
        uniqueRelayers: 1,
        messagesReceived: 1,
        messagesParsed: 1,
        messagesAccepted: 1,
        ...overrides,
      },
    ]),
  )
}
