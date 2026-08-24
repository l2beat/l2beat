import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import type { Configuration } from '../../../tools/uif/multi/types'
import type {
  RailgunBroadcasterProvider,
  RailgunObservationResult,
} from '../railgun/RailgunBroadcasterProvider'
import type { PrivacyRelayerSampleIndexerConfig } from '../types'
import { PrivacyRelayerSampleIndexer } from './PrivacyRelayerSampleIndexer'

const TODAY = UnixTime.toStartOf(UnixTime.now(), 'day')

describe(PrivacyRelayerSampleIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  it('observes and saves a sample for the current day', async () => {
    const from = UnixTime(TODAY - 2 * UnixTime.HOUR)
    const to = UnixTime(TODAY + 2 * UnixTime.HOUR)

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

    const indexer = createIndexer(provider, privacyRelayerSample)

    const save = await indexer.multiUpdate(from, to, [configuration()])

    expect(provider.observe).toHaveBeenOnlyCalledWith({
      chainIds: [1],
      durationMs: 10 * 60 * 1000,
    })
    expect(privacyRelayerSample.upsertMany).not.toHaveBeenCalled()
    expect(await save()).toEqual(to)
    expect(privacyRelayerSample.upsertMany).toHaveBeenOnlyCalledWith([
      {
        configurationId: 'config-1',
        projectId: 'railgun',
        chain: 'ethereum',
        timestamp: TODAY,
        relayerCount: 46,
        messagesReceived: 1000,
        messagesParsed: 995,
        messagesAccepted: 990,
      },
    ])
  })

  it('skips configurations that already have a sample for today', async () => {
    const from = UnixTime(TODAY + UnixTime.HOUR)
    const to = UnixTime(TODAY + 2 * UnixTime.HOUR)

    const provider = mockObject<RailgunBroadcasterProvider>({
      observe: mockFn(),
    })
    const privacyRelayerSample = mockObject<Database['privacyRelayerSample']>({
      getConfigurationIdsByTimestamp: mockFn().resolvesToOnce(['config-1']),
      upsertMany: mockFn(),
    })

    const indexer = createIndexer(provider, privacyRelayerSample)

    const save = await indexer.multiUpdate(from, to, [configuration()])

    expect(provider.observe).not.toHaveBeenCalled()
    expect(privacyRelayerSample.upsertMany).not.toHaveBeenCalled()
    expect(await save()).toEqual(to)
  })

  it('never observes for a past day', async () => {
    const from = UnixTime(TODAY - 26 * UnixTime.HOUR)
    const to = UnixTime(TODAY - 2 * UnixTime.HOUR)

    const provider = mockObject<RailgunBroadcasterProvider>({
      observe: mockFn(),
    })
    const privacyRelayerSample = mockObject<Database['privacyRelayerSample']>({
      getConfigurationIdsByTimestamp: mockFn(),
      upsertMany: mockFn(),
    })

    const indexer = createIndexer(provider, privacyRelayerSample)

    const save = await indexer.multiUpdate(from, to, [configuration()])

    expect(
      privacyRelayerSample.getConfigurationIdsByTimestamp,
    ).not.toHaveBeenCalled()
    expect(provider.observe).not.toHaveBeenCalled()
    expect(await save()).toEqual(to)
  })

  it('throws instead of saving when the observation saw no messages', async () => {
    const from = UnixTime(TODAY - 2 * UnixTime.HOUR)
    const to = UnixTime(TODAY + 2 * UnixTime.HOUR)

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

    const indexer = createIndexer(provider, privacyRelayerSample)

    await expect(
      indexer.multiUpdate(from, to, [configuration()]),
    ).toBeRejectedWith('saw no fee messages')
    expect(privacyRelayerSample.upsertMany).not.toHaveBeenCalled()
  })

  it('throws instead of saving when received messages cannot be parsed', async () => {
    const from = UnixTime(TODAY - 2 * UnixTime.HOUR)
    const to = UnixTime(TODAY + 2 * UnixTime.HOUR)

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

    const indexer = createIndexer(provider, privacyRelayerSample)

    await expect(
      indexer.multiUpdate(from, to, [configuration()]),
    ).toBeRejectedWith('parsed no fee messages')
    expect(privacyRelayerSample.upsertMany).not.toHaveBeenCalled()
  })

  it('saves zero when valid messages contain no eligible relayers', async () => {
    const from = UnixTime(TODAY - 2 * UnixTime.HOUR)
    const to = UnixTime(TODAY + 2 * UnixTime.HOUR)

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

    const indexer = createIndexer(provider, privacyRelayerSample)
    const save = await indexer.multiUpdate(from, to, [configuration()])

    expect(privacyRelayerSample.upsertMany).not.toHaveBeenCalled()
    expect(await save()).toEqual(to)
    expect(privacyRelayerSample.upsertMany).toHaveBeenOnlyCalledWith([
      {
        configurationId: 'config-1',
        projectId: 'railgun',
        chain: 'ethereum',
        timestamp: TODAY,
        relayerCount: 0,
        messagesReceived: 10,
        messagesParsed: 10,
        messagesAccepted: 0,
      },
    ])
  })

  it('observes all chains together and saves every sample atomically', async () => {
    const from = UnixTime(TODAY - 2 * UnixTime.HOUR)
    const to = UnixTime(TODAY + 2 * UnixTime.HOUR)
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
    const indexer = createIndexer(
      provider,
      privacyRelayerSample,
      configurations,
    )

    const save = await indexer.multiUpdate(from, to, configurations)

    expect(provider.observe).toHaveBeenOnlyCalledWith({
      chainIds: [1, 137],
      durationMs: 10 * 60 * 1000,
    })
    expect(privacyRelayerSample.upsertMany).not.toHaveBeenCalled()
    expect(await save()).toEqual(to)
    expect(privacyRelayerSample.upsertMany).toHaveBeenOnlyCalledWith([
      {
        configurationId: 'config-1',
        projectId: 'railgun',
        chain: 'ethereum',
        timestamp: TODAY,
        relayerCount: 10,
        messagesReceived: 1,
        messagesParsed: 1,
        messagesAccepted: 1,
      },
      {
        configurationId: 'config-137',
        projectId: 'railgun',
        chain: 'polygonpos',
        timestamp: TODAY,
        relayerCount: 5,
        messagesReceived: 1,
        messagesParsed: 1,
        messagesAccepted: 1,
      },
    ])
  })

  it('does not expose partial samples when any chain is unhealthy', async () => {
    const from = UnixTime(TODAY - 2 * UnixTime.HOUR)
    const to = UnixTime(TODAY + 2 * UnixTime.HOUR)
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
      upsertMany: mockFn(),
    })
    const indexer = createIndexer(
      provider,
      privacyRelayerSample,
      configurations,
    )

    await expect(
      indexer.multiUpdate(from, to, configurations),
    ).toBeRejectedWith('saw no fee messages for chainId 137')
    expect(privacyRelayerSample.upsertMany).not.toHaveBeenCalled()
  })

  describe(PrivacyRelayerSampleIndexer.idToConfigurationId.name, () => {
    it('is deterministic for the same input', () => {
      const properties = sampleProperties()

      expect(
        PrivacyRelayerSampleIndexer.idToConfigurationId(properties),
      ).toEqual(PrivacyRelayerSampleIndexer.idToConfigurationId(properties))
    })

    it('differs by chain id', () => {
      const properties = sampleProperties()

      expect(
        PrivacyRelayerSampleIndexer.idToConfigurationId(properties),
      ).not.toEqual(
        PrivacyRelayerSampleIndexer.idToConfigurationId({
          ...properties,
          chainId: 137,
        }),
      )
    })
  })

  function createIndexer(
    provider: RailgunBroadcasterProvider,
    privacyRelayerSample: Database['privacyRelayerSample'],
    configurations = [configuration()],
  ) {
    return new PrivacyRelayerSampleIndexer(
      {
        configurations,
        provider,
        db: mockDatabase({ privacyRelayerSample }),
        parents: [],
        indexerService: mockObject<IndexerService>({}),
      },
      Logger.SILENT,
    )
  }
})

function sampleProperties(): Omit<PrivacyRelayerSampleIndexerConfig, 'id'> {
  return {
    projectId: 'railgun',
    chain: 'ethereum',
    chainId: 1,
    sinceTimestamp: UnixTime(0),
  }
}

function configuration(
  overrides: Partial<PrivacyRelayerSampleIndexerConfig> = {},
): Configuration<PrivacyRelayerSampleIndexerConfig> {
  const properties: PrivacyRelayerSampleIndexerConfig = {
    id: 'config-1',
    ...sampleProperties(),
    ...overrides,
  }

  return {
    id: properties.id,
    minHeight: properties.sinceTimestamp,
    maxHeight: null,
    properties,
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
