import { Logger } from '@l2beat/backend-tools'
import type { Database, LivePrivacyFlowEventRecord } from '@l2beat/database'
import type { IRpcClient } from '@l2beat/shared'
import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { type InstalledClock, install } from '@sinonjs/fake-timers'
import { expect, mockFn, mockObject } from 'earl'
import { utils } from 'ethers'
import { mockDatabase } from '../../../test/database'
import { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import { ChainHeadIndexer } from '../../chain-head/ChainHeadIndexer'
import {
  FakeChain,
  FakeChainBlocks,
  FakeChainHeadCursors,
  FakeIndexerStates,
} from '../../chain-head/test/FakeChain'
import type { PrivacyFlowIndexerConfig } from '../types'
import {
  LIVE_PRIVACY_FLOWS_KEPT_FOR,
  LivePrivacyFlowIndexer,
} from './LivePrivacyFlowIndexer'

/**
 * Methodology: the real chain head and the real live flow indexer run under
 * UIF, as in production, against a fake chain and tables in memory. The
 * chain starts at block 100, made now, and each later block comes a second
 * after the one before. Fake timers move the head from one tick to the next
 */
const CHAIN = 'ethereum'
const NOW = UnixTime.fromDate(new Date('2026-11-18T12:00:00Z'))
const POOL = EthereumAddress('0x1111111111111111111111111111111111111111')
const DEPOSIT = `0x${'d0'.repeat(32)}`
const WITHDRAWAL = `0x${'e0'.repeat(32)}`

const vault = new utils.Interface([
  'event Transacted(uint256[] outputCommitments, uint256[] nullifierHashes, address indexed asset, uint256 withdrawnValue, address indexed caller)',
])
const ASSET = EthereumAddress('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2')
const PROCESSOR = EthereumAddress('0x4444444444444444444444444444444444444444')
const RELAYER = EthereumAddress('0x2222222222222222222222222222222222222222')

describe(LivePrivacyFlowIndexer.name, () => {
  let time: InstalledClock

  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
    time = install({ now: NOW * 1000 })
  })

  afterEach(() => {
    time.uninstall()
  })

  it('stores the deposits and withdrawals of new blocks as the head gets them', async () => {
    const { chain, flows, start, nextTick } = setup([
      fixed('deposits', 'deposit', DEPOSIT, 100n),
      fixed('withdrawals', 'withdrawal', WITHDRAWAL, 100n),
    ])
    await start()

    chain.mine(2)
    chain.emit(101, { address: POOL, topics: [DEPOSIT], data: '0x' })
    chain.emit(102, { address: POOL, topics: ['0xanother event'], data: '0x' })
    chain.emit(102, { address: POOL, topics: [WITHDRAWAL], data: '0x' })
    await nextTick()

    expect(flows()).toEqual([
      {
        configurationId: 'deposits',
        projectId: 'project',
        bucketId: 'bucket',
        chain: CHAIN,
        direction: 'deposit',
        timestamp: NOW + 1,
        blockNumber: 101,
        blockHash: '0x101',
        txHash: '0x101-tx0',
        logIndex: 0,
        count: 1,
        amount: 100n,
      },
      {
        configurationId: 'withdrawals',
        projectId: 'project',
        bucketId: 'bucket',
        chain: CHAIN,
        direction: 'withdrawal',
        timestamp: NOW + 2,
        blockNumber: 102,
        blockHash: '0x102',
        txHash: '0x102-tx1',
        logIndex: 1,
        count: 1,
        amount: 100n,
      },
    ])
  })

  it('drops the flows of blocks a reorg replaced, and stores those of the blocks that replaced them', async () => {
    const { chain, flows, start, nextTick } = setup([
      fixed('deposits', 'deposit', DEPOSIT, 100n),
    ])
    await start()
    chain.mine(2)
    chain.emit(101, { address: POOL, topics: [DEPOSIT], data: '0x' })
    chain.emit(102, { address: POOL, topics: [DEPOSIT], data: '0x' })
    await nextTick()

    chain.reorg(102, 103)
    chain.emit(103, { address: POOL, topics: [DEPOSIT], data: '0x' })
    await nextTick()

    expect(flows().map((flow) => flow.txHash)).toEqual([
      '0x101-tx0',
      '0x103-1-tx0',
    ])
  })

  it('stores a flow once the node that was behind has its block', async () => {
    const { chain, flows, start, nextTick } = setup([
      fixed('deposits', 'deposit', DEPOSIT, 100n),
    ])
    await start()
    chain.mine(1)
    chain.emit(101, { address: POOL, topics: [DEPOSIT], data: '0x' })
    chain.failToServeLogsOnce(101)

    await nextTick()
    expect(flows()).toEqual([])

    await nextTick()
    expect(flows().map((flow) => flow.txHash)).toEqual(['0x101-tx0'])
  })

  it('reads every block again once a block shows that the blooms are not of the blocks own logs', async () => {
    const { chain, flows, start, nextTick } = setup([
      fixed('deposits', 'deposit', DEPOSIT, 100n),
    ])
    chain.fillsBlooms = true
    chain.bloomsOneBehind = true
    // so the bloom of block 101 has another address and rules the pool out
    chain.emit(100, { address: RELAYER, topics: [DEPOSIT], data: '0x' })
    await start()

    chain.mine(2)
    chain.emit(101, { address: POOL, topics: [DEPOSIT], data: '0x' })
    // asked about, as the bloom of 101's logs has the pool, and it comes
    // back with a topic that bloom does not have
    chain.emit(102, {
      address: POOL,
      topics: [DEPOSIT, `0x${'aa'.repeat(32)}`],
      data: '0x',
    })
    await nextTick()
    await nextTick()

    expect(flows().map((flow) => flow.blockNumber)).toEqual([101, 102])
  })

  it('stores a log only for the configurations whose topics it has', async () => {
    const usdc = `0x${'aa'.repeat(32)}`
    const dai = `0x${'bb'.repeat(32)}`
    const { chain, flows, start, nextTick } = setup([
      { ...fixed('usdc', 'deposit', DEPOSIT, 100n), topics: [usdc] },
      { ...fixed('dai', 'deposit', DEPOSIT, 5n), topics: [dai] },
    ])
    await start()

    chain.mine(1)
    chain.emit(101, { address: POOL, topics: [DEPOSIT, dai], data: '0x' })
    await nextTick()

    expect(flows().map((flow) => [flow.configurationId, flow.amount])).toEqual([
      ['dai', 5n],
    ])
  })

  it('stores nothing for a configuration that starts later', async () => {
    const { chain, flows, start, nextTick } = setup([
      {
        ...fixed('deposits', 'deposit', DEPOSIT, 100n),
        sinceTimestamp: NOW + 2,
      },
    ])
    await start()

    chain.mine(2)
    chain.emit(101, { address: POOL, topics: [DEPOSIT], data: '0x' })
    chain.emit(102, { address: POOL, topics: [DEPOSIT], data: '0x' })
    await nextTick()

    expect(flows().map((flow) => flow.blockNumber)).toEqual([102])
  })

  it('reads a receipt only from the block the log is in', async () => {
    const transacted = vault.encodeEventLog(vault.getEvent('Transacted'), [
      [],
      [],
      ASSET,
      700n,
      PROCESSOR,
    ])
    // a node on another fork answers first, where the transaction is in
    // another block and may have done something else
    const getTransactionReceipt = mockFn()
      .resolvesToOnce({ blockHash: '0x101 on a fork', logs: [] })
      .resolvesTo({
        blockHash: '0x101',
        logs: [{ ...transacted, logIndex: 0 }],
      })
    const { chain, flows, start, nextTick } = setup(
      [
        {
          ...fixed(
            'withdrawals',
            'withdrawal',
            vault.getEventTopic('Transacted'),
            0n,
          ),
          extractor: 'privacyPoolsV2Value',
          params: { tokenAddress: ASSET },
        },
      ],
      mockObject<IRpcClient>({
        getTransaction: mockFn().resolvesTo({ from: RELAYER }),
        getTransactionReceipt,
      }),
    )
    await start()

    chain.mine(1)
    chain.emit(101, { address: POOL, ...transacted })
    await nextTick()
    expect(flows()).toEqual([])

    await nextTick()
    expect(flows().map((flow) => [flow.count, flow.amount])).toEqual([
      [1, 700n],
    ])
  })

  function setup(
    configurations: PrivacyFlowIndexerConfig[],
    rpcClient = mockObject<IRpcClient>({}),
  ) {
    const chain = new FakeChain(100, NOW - 100)
    const stored = new FakeLiveFlows()
    const chainBlocks = new FakeChainBlocks(CHAIN)
    const db = mockDatabase({
      chainBlock: chainBlocks.repository,
      chainHead: chainBlocks.headRepository,
      chainHeadCursor: new FakeChainHeadCursors().repository,
      livePrivacyFlowEvent: stored.repository,
      indexerState: new FakeIndexerStates().repository,
    })

    const head = new ChainHeadIndexer(
      {
        chain: CHAIN,
        source: chain,
        db,
        batchSize: 100,
        keepFor: LIVE_PRIVACY_FLOWS_KEPT_FOR,
      },
      Logger.SILENT,
    )
    const indexer = new LivePrivacyFlowIndexer(
      {
        chain: CHAIN,
        head,
        configurations,
        rpcClient,
        indexerService: new IndexerService(db),
        db,
      },
      Logger.SILENT,
    )

    return {
      chain,
      flows: () => stored.rows,
      start: async () => {
        await indexer.start()
        await head.start()
        await time.tickAsync(1)
      },
      /** The head's tick ten seconds on, and whatever a failed update tries again in that time */
      nextTick: async () => {
        await time.tickAsync(10_000)
      },
    }
  }
})

function fixed(
  id: string,
  direction: 'deposit' | 'withdrawal',
  event: string,
  amount: bigint,
): PrivacyFlowIndexerConfig {
  return {
    id,
    projectId: 'project',
    bucketId: 'bucket',
    direction,
    chain: CHAIN,
    address: POOL,
    event,
    sinceTimestamp: UnixTime(0),
    priceId: 'ethereum',
    decimals: 18,
    extractor: 'fixedAmount',
    params: { amount: amount.toString() },
  }
}

/** The `LivePrivacyFlowEvent` table, in memory */
class FakeLiveFlows {
  rows: LivePrivacyFlowEventRecord[] = []

  readonly repository = mockObject<Database['livePrivacyFlowEvent']>({
    upsertMany: async (records) => {
      const key = (r: LivePrivacyFlowEventRecord) =>
        `${r.configurationId}:${r.txHash}:${r.logIndex}`
      const replaced = new Set(records.map(key))
      this.rows = [
        ...this.rows.filter((row) => !replaced.has(key(row))),
        ...records,
      ].sort((a, b) => a.blockNumber - b.blockNumber || a.logIndex - b.logIndex)
      return records.length
    },
    deleteByChainAfter: async (_, blockNumber) =>
      this.keep((row) => row.blockNumber <= blockNumber),
    deleteByChainBefore: async (_, timestamp) =>
      this.keep((row) => row.timestamp >= timestamp),
  })

  private keep(predicate: (row: LivePrivacyFlowEventRecord) => boolean) {
    const before = this.rows.length
    this.rows = this.rows.filter(predicate)
    return before - this.rows.length
  }
}
