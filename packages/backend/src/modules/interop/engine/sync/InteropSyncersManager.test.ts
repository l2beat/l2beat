import { Logger } from '@l2beat/backend-tools'
import type {
  Database,
  InteropPluginSyncedRangeRecord,
  InteropPluginSyncStateRecord,
} from '@l2beat/database'
import {
  type Block,
  type Log,
  type LongChainName,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { ChainApi } from '../../../../config/chain/ChainApi'
import type { PluginCluster } from '../../plugins'
import type {
  InteropPlugin,
  InteropPluginResyncable,
} from '../../plugins/types'
import type { InteropEventStore } from '../capture/InteropEventStore'
import { InteropDataCleaner } from './InteropDataCleaner'
import { InteropEventSyncer } from './InteropEventSyncer'
import { InteropSyncersManager } from './InteropSyncersManager'

describe(InteropSyncersManager.name, () => {
  describe('constructor runtime checks', () => {
    it('throws when cluster mixes resyncable and non-resyncable plugins', () => {
      const cluster: PluginCluster = {
        name: 'mixed-cluster',
        plugins: [
          makeResyncablePlugin('across'),
          makeNonResyncablePlugin('celer'),
        ],
      }

      expect(
        () =>
          new InteropSyncersManager(
            [cluster],
            ['ethereum'],
            [makeChainConfig('ethereum')],
            mockStore(),
            mockDb(),
            Logger.SILENT,
          ),
      ).toThrow(/mix of non- and resyncable plugins/)
    })

    it('skips clusters without resyncable plugins', () => {
      const cleanerStart = mockFn()
      const originalCleanerStart = InteropDataCleaner.prototype.start
      InteropDataCleaner.prototype.start =
        cleanerStart as unknown as InteropDataCleaner['start']

      try {
        const cluster: PluginCluster = {
          name: 'non-resyncable',
          plugins: [
            makeNonResyncablePlugin('across'),
            makeNonResyncablePlugin('celer'),
          ],
        }

        const manager = new InteropSyncersManager(
          [cluster],
          ['ethereum'],
          [makeChainConfig('ethereum')],
          mockStore(),
          mockDb(),
          Logger.SILENT,
        )

        manager.start()

        expect(manager.getSyncer('non-resyncable', 'ethereum')).toEqual(
          undefined,
        )
        expect(cleanerStart).not.toHaveBeenCalled()
      } finally {
        InteropDataCleaner.prototype.start = originalCleanerStart
      }
    })

    it('throws when chain config is missing for an enabled chain', () => {
      expect(
        () =>
          new InteropSyncersManager(
            [makeCluster('cluster-a')],
            ['ethereum'],
            [],
            mockStore(),
            mockDb(),
            Logger.SILENT,
          ),
      ).toThrow('Missing configuration for chain ethereum')
    })

    it('throws when rpc config is missing for an enabled chain', () => {
      expect(
        () =>
          new InteropSyncersManager(
            [makeCluster('cluster-a')],
            ['ethereum'],
            [makeChainConfig('ethereum', { withRpc: false })],
            mockStore(),
            mockDb(),
            Logger.SILENT,
          ),
      ).toThrow('Missing RPC config for chain ethereum')
    })
  })

  describe(InteropSyncersManager.prototype.getSyncer.name, () => {
    it('creates syncers for each resyncable cluster and enabled chain', () => {
      const manager = makeManager({
        clusters: [makeCluster('cluster-a'), makeCluster('cluster-b')],
        chains: ['ethereum', 'arbitrum'],
      })

      expect(manager.getSyncer('cluster-a', 'ethereum')).toBeA(
        InteropEventSyncer,
      )
      expect(manager.getSyncer('cluster-a', 'arbitrum')).toBeA(
        InteropEventSyncer,
      )
      expect(manager.getSyncer('cluster-b', 'ethereum')).toBeA(
        InteropEventSyncer,
      )
      expect(manager.getSyncer('cluster-b', 'arbitrum')).toBeA(
        InteropEventSyncer,
      )
      expect(manager.getSyncer('missing', 'ethereum')).toEqual(undefined)
    })

    it('reuses rpc clients per chain across clusters', () => {
      const manager = makeManager({
        clusters: [makeCluster('cluster-a'), makeCluster('cluster-b')],
        chains: ['ethereum', 'arbitrum'],
      })

      const aEth = manager.getSyncer('cluster-a', 'ethereum')
      const bEth = manager.getSyncer('cluster-b', 'ethereum')
      const aArb = manager.getSyncer('cluster-a', 'arbitrum')

      expect(aEth).toBeA(InteropEventSyncer)
      expect(bEth).toBeA(InteropEventSyncer)
      expect(aArb).toBeA(InteropEventSyncer)

      expect(aEth?.rpcClient).toEqual(bEth?.rpcClient)
      expect(aEth?.rpcClient).not.toEqual(aArb?.rpcClient)
    })
  })

  describe(InteropSyncersManager.prototype.start.name, () => {
    it('starts all syncers and data cleaners', () => {
      const syncerStart = mockFn().returns(undefined)
      const cleanerStart = mockFn().returns(undefined)

      const originalSyncerStart = InteropEventSyncer.prototype.start
      const originalCleanerStart = InteropDataCleaner.prototype.start

      InteropEventSyncer.prototype.start =
        syncerStart as unknown as InteropEventSyncer['start']
      InteropDataCleaner.prototype.start =
        cleanerStart as unknown as InteropDataCleaner['start']

      try {
        const manager = makeManager({
          clusters: [makeCluster('cluster-a'), makeCluster('cluster-b')],
          chains: ['ethereum', 'arbitrum'],
        })

        manager.start()

        expect(syncerStart.calls.length).toEqual(4)
        expect(cleanerStart.calls.length).toEqual(2)
      } finally {
        InteropEventSyncer.prototype.start = originalSyncerStart
        InteropDataCleaner.prototype.start = originalCleanerStart
      }
    })
  })

  describe(InteropSyncersManager.prototype.processNewestBlock.name, () => {
    it('processes the newest block on all syncers for the target chain', async () => {
      const manager = makeManager({
        clusters: [makeCluster('cluster-a'), makeCluster('cluster-b')],
        chains: ['ethereum', 'arbitrum'],
      })

      const block = makeBlock(10)
      const logs: Log[] = []

      const aEth = manager.getSyncer('cluster-a', 'ethereum')
      const bEth = manager.getSyncer('cluster-b', 'ethereum')
      const aArb = manager.getSyncer('cluster-a', 'arbitrum')

      const aEthProcess = mockFn().resolvesTo(undefined)
      const bEthProcess = mockFn().resolvesTo(undefined)
      const aArbProcess = mockFn().resolvesTo(undefined)

      if (aEth) aEth.processNewestBlock = aEthProcess
      if (bEth) bEth.processNewestBlock = bEthProcess
      if (aArb) aArb.processNewestBlock = aArbProcess

      await manager.processNewestBlock('ethereum', block, logs)

      expect(aEthProcess).toHaveBeenCalledWith(block, logs)
      expect(bEthProcess).toHaveBeenCalledWith(block, logs)
      expect(aArbProcess).not.toHaveBeenCalled()
    })
  })

  describe(InteropSyncersManager.prototype.getBlockProcessor.name, () => {
    it('delegates processing to processNewestBlock', async () => {
      const manager = makeManager({
        clusters: [makeCluster('cluster-a')],
        chains: ['ethereum'],
      })

      const processNewestBlock = mockFn().resolvesTo(undefined)
      manager.processNewestBlock = processNewestBlock

      const processor = manager.getBlockProcessor('ethereum')
      const block = makeBlock(7)
      const logs: Log[] = []

      await processor.processBlock(block, logs)

      expect(processor.chain).toEqual('ethereum')
      expect(processNewestBlock).toHaveBeenCalledWith('ethereum', block, logs)
    })
  })

  describe(InteropSyncersManager.prototype.areAllSyncersFollowing.name, () => {
    it('returns false when any syncer is not following', () => {
      const manager = makeManager({
        clusters: [makeCluster('cluster-a')],
        chains: ['ethereum'],
      })

      expect(manager.areAllSyncersFollowing()).toEqual(true)

      const syncer = manager.getSyncer('cluster-a', 'ethereum')
      if (!syncer) {
        throw new Error('Expected syncer to exist')
      }
      syncer.state = {
        type: 'timeLoop',
        name: 'catchingUp',
        status: 'waiting',
        run: async () => syncer.state,
      }

      expect(manager.areAllSyncersFollowing()).toEqual(false)
    })
  })

  describe(InteropSyncersManager.prototype.getPluginSyncStatuses.name, () => {
    it('merges db ranges, db states, and existing syncers, then sorts the result', async () => {
      const syncedRanges: InteropPluginSyncedRangeRecord[] = [
        makeSyncedRangeRecord('cluster-a', 'ethereum', 10n),
        makeSyncedRangeRecord('cluster-b', 'arbitrum', 20n),
      ]
      const syncStates: InteropPluginSyncStateRecord[] = [
        makeSyncStateRecord('cluster-a', 'ethereum', 'boom', UnixTime(123)),
        makeSyncStateRecord('cluster-a', 'arbitrum', 'arb-err', null),
        makeSyncStateRecord('cluster-c', 'ethereum', 'missing', null),
      ]

      const db = mockDb({ syncedRanges, syncStates })
      const manager = makeManager({
        clusters: [makeCluster('cluster-a'), makeCluster('cluster-b')],
        chains: ['ethereum', 'arbitrum'],
        db,
      })

      const result = await manager.getPluginSyncStatuses()

      expect(result.map((r) => `${r.pluginName}:${r.chain}`)).toEqual([
        'cluster-a:arbitrum',
        'cluster-a:ethereum',
        'cluster-b:arbitrum',
        'cluster-b:ethereum',
        'cluster-c:ethereum',
      ])

      const aEth = result.find(
        (r) => r.pluginName === 'cluster-a' && r.chain === 'ethereum',
      )
      const bEth = result.find(
        (r) => r.pluginName === 'cluster-b' && r.chain === 'ethereum',
      )
      const cEth = result.find(
        (r) => r.pluginName === 'cluster-c' && r.chain === 'ethereum',
      )

      expect(aEth).toEqual({
        pluginName: 'cluster-a',
        chain: 'ethereum',
        syncMode: 'following-starting',
        toBlock: 10n,
        toTimestamp: UnixTime(10),
        lastError: 'boom',
        resyncRequestedFrom: UnixTime(123),
      })
      expect(bEth?.syncMode).toEqual('following-starting')
      expect(bEth?.toBlock).toEqual(undefined)
      expect(cEth?.syncMode).toEqual('undefined-undefined')
      expect(cEth?.lastError).toEqual('missing')
    })
  })
})

function makeManager(params: {
  clusters: PluginCluster[]
  chains: LongChainName[]
  db?: Database
}) {
  const chains = params.chains
  const chainConfigs = chains.map((chain) => makeChainConfig(chain))
  return new InteropSyncersManager(
    params.clusters,
    chains,
    chainConfigs,
    mockStore(),
    params.db ?? mockDb(),
    Logger.SILENT,
  )
}

function makeCluster(name: string): PluginCluster {
  return {
    name,
    plugins: [makeResyncablePlugin(`${name}-plugin`)],
  }
}

function makeResyncablePlugin(name: string): InteropPluginResyncable {
  return {
    name: name as InteropPluginResyncable['name'],
    capture: () => undefined,
    getDataRequests: () => [],
  }
}

function makeNonResyncablePlugin(name: string): InteropPlugin {
  return {
    name: name as InteropPlugin['name'],
  }
}

function makeChainConfig(
  name: LongChainName,
  options: { withRpc: boolean } = { withRpc: true },
): ChainApi {
  return {
    name,
    blockApis: options.withRpc
      ? [
          {
            type: 'rpc',
            url: `http://localhost/${name}`,
            callsPerMinute: 1,
            retryStrategy: 'TEST',
          },
        ]
      : [
          {
            type: 'svm-rpc',
            url: `http://localhost/${name}`,
            callsPerMinute: 1,
            retryStrategy: 'TEST',
          },
        ],
    indexerApis: [],
  }
}

function makeBlock(number: number): Block {
  return {
    number,
    timestamp: number,
    hash: '0x',
    logsBloom: '0x',
    transactions: [],
  }
}

function makeSyncedRangeRecord(
  pluginName: string,
  chain: LongChainName,
  toBlock: bigint,
): InteropPluginSyncedRangeRecord {
  return {
    pluginName,
    chain,
    fromBlock: 1n,
    fromTimestamp: UnixTime(1),
    toBlock,
    toTimestamp: UnixTime(Number(toBlock)),
  }
}

function makeSyncStateRecord(
  pluginName: string,
  chain: LongChainName,
  lastError: string,
  resyncRequestedFrom: UnixTime | null,
): InteropPluginSyncStateRecord {
  return {
    pluginName,
    chain,
    lastError,
    resyncRequestedFrom,
    wipeRequired: false,
  }
}

function mockStore() {
  return mockObject<InteropEventStore>({
    saveNewEvents: mockFn().resolvesTo(undefined),
    deleteAllForPlugin: mockFn().resolvesTo(undefined),
  })
}

function mockDb(params?: {
  syncedRanges?: InteropPluginSyncedRangeRecord[]
  syncStates?: InteropPluginSyncStateRecord[]
}): Database {
  return mockObject<Database>({
    transaction: mockFn().executes(async (cb) => await cb()),
    interopPluginSyncedRange: mockObject<Database['interopPluginSyncedRange']>({
      getAll: mockFn().resolvesTo(params?.syncedRanges ?? []),
      upsert: mockFn().resolvesTo(undefined),
      findByPluginNameAndChain: mockFn().resolvesTo(undefined),
    }),
    interopPluginSyncState: mockObject<Database['interopPluginSyncState']>({
      getAll: mockFn().resolvesTo(params?.syncStates ?? []),
      setLastError: mockFn().resolvesTo(undefined),
      findByPluginName: mockFn().resolvesTo([]),
      updateByPluginName: mockFn().resolvesTo(0),
      findByPluginNameAndChain: mockFn().resolvesTo(undefined),
    }),
    interopEvent: mockObject<Database['interopEvent']>({
      getOldestEventForPluginAndChain: mockFn().resolvesTo(undefined),
    }),
    interopMessage: mockObject<Database['interopMessage']>({
      deleteForPlugin: mockFn().resolvesTo(undefined),
    }),
    interopTransfer: mockObject<Database['interopTransfer']>({
      deleteForPlugin: mockFn().resolvesTo(undefined),
    }),
  })
}
