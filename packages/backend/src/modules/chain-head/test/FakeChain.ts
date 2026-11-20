import type {
  ChainBlockRecord,
  ChainHeadCursorRecord,
  ChainHeadRecord,
  Database,
} from '@l2beat/database'
import {
  type EVMBlockWithTransactions,
  type LogsTopicFilter,
  NotFoundOnRpcError,
} from '@l2beat/shared'
import type { Log, UnixTime } from '@l2beat/shared-pure'
import { mockFn, mockObject } from 'earl'
import range from 'lodash/range'
import { mockDatabase } from '../../../test/database'
import type { HeadSource } from '../ChainHeadIndexer'
import { bloomBits } from '../logsBloom'

/**
 * A chain for tests that grows, reorganizes and is served as badly as real
 * RPCs serve one. Block `n` has hash `0x<n>`, or `0x<n>-<k>` once the k-th
 * reorg replaced it, and every block points at the hash of the one before it
 * on the chain as it is now
 */
export class FakeChain implements HeadSource {
  private replacedFrom: number[] = []
  private lagging = 0
  private readonly notServedOnce = new Set<number>()
  private readonly forkedOnce = new Set<number>()
  private readonly hashForkedOnce = new Set<number>()
  private readonly logsNotServedOnce = new Set<number>()
  /** Blocks come with the bloom of their logs, and not with the `0x` of a chain whose blooms say nothing */
  fillsBlooms = false
  /** Each block's bloom is of the logs of the block before, as on a chain that executes blocks after it has ordered them */
  bloomsOneBehind = false
  private readonly refused = new Set<string>()
  /** By the hash of the block they are in, so a reorg takes them off the chain */
  private readonly emitted = new Map<string, Log[]>()

  constructor(
    public latest: number,
    /** Of block 0. Each block comes a second after the one before */
    private readonly genesis: UnixTime,
  ) {}

  getLatestBlockNumber = mockFn(async () => {
    const lagging = this.lagging
    this.lagging = 0
    return this.latest - lagging
  })

  getBlocks = mockFn(async (from: number, to: number) =>
    range(from, to + 1).map((number) => this.serve(number)),
  )

  getHeaders = mockFn(async (from: number, to: number) =>
    range(from, to + 1).map((number) => this.serve(number)),
  )

  getBlockHash = mockFn(async (number: number) => {
    const hash = this.hashOf(number)
    return this.hashForkedOnce.delete(number) ? `${hash}-fork` : hash
  })

  /** Filters by address only, as a node that returns more than was asked for */
  getLogs = mockFn(
    async (blockHash: string, addresses: string[], _: LogsTopicFilter) => {
      const number = range(0, this.latest + 1).find(
        (number) => this.hashOf(number) === blockHash,
      )
      // as a node answers for a block it does not have, or has no longer
      if (number === undefined || this.logsNotServedOnce.delete(number)) {
        throw new Error('Unknown block')
      }
      if (addresses.some((address) => this.refused.has(address))) {
        throw new Error('Filter refused')
      }
      return (this.emitted.get(blockHash) ?? []).filter((log) =>
        addresses.includes(log.address),
      )
    },
  )

  /** Of the chain as it is now, as a node answers for numbers */
  getLogsInRange = mockFn(
    async (from: number, to: number, addresses: string[], _: LogsTopicFilter) =>
      range(from, to + 1).flatMap((number) =>
        (this.emitted.get(this.hashOf(number)) ?? []).filter((log) =>
          addresses.includes(log.address),
        ),
      ),
  )

  mine(count = 1) {
    this.latest += count
  }

  /** Adds a log to a block of the chain as it is now */
  emit(number: number, log: Pick<Log, 'address' | 'topics' | 'data'>) {
    const blockHash = this.hashOf(number)
    const logs = this.emitted.get(blockHash) ?? []
    logs.push({
      ...log,
      blockNumber: number,
      blockHash,
      transactionHash: `${blockHash}-tx${logs.length}`,
      logIndex: logs.length,
    })
    this.emitted.set(blockHash, logs)
  }

  /** The source refuses every logs request that names the address */
  refuseLogsOf(address: string) {
    this.refused.add(address)
  }

  /** The block's logs are asked of a node that does not have the block yet */
  failToServeLogsOnce(number: number) {
    this.logsNotServedOnce.add(number)
  }

  /** Replaces the blocks from `from` up, leaving the chain `latest` blocks long */
  reorg(from: number, latest = this.latest) {
    this.replacedFrom.push(from)
    this.latest = latest
  }

  /** The next answer for the latest block number comes from a node this many blocks behind */
  lagOnce(blocks: number) {
    this.lagging = blocks
  }

  /** The block is named as the latest before the answering node has it */
  failToServeOnce(number: number) {
    this.notServedOnce.add(number)
  }

  /** The block is served once by a node on another fork */
  serveFromForkOnce(number: number) {
    this.forkedOnce.add(number)
  }

  /** The block's hash is answered once by a node on another fork */
  answerHashFromForkOnce(number: number) {
    this.hashForkedOnce.add(number)
  }

  /** The bloom of the block's logs, as a chain that fills blooms in has it. Needs logs with hex addresses and topics */
  private bloomOf(number: number): string {
    const bloom = new Uint8Array(256)
    for (const log of this.emitted.get(this.hashOf(number)) ?? []) {
      for (const value of [log.address, ...log.topics]) {
        for (const [byte, mask] of bloomBits(value)) bloom[byte] |= mask
      }
    }
    return `0x${Buffer.from(bloom).toString('hex')}`
  }

  block(number: number): EVMBlockWithTransactions {
    return {
      number,
      hash: this.hashOf(number),
      parentHash: this.hashOf(number - 1),
      timestamp: this.genesis + number,
      logsBloom: this.fillsBlooms
        ? this.bloomOf(this.bloomsOneBehind ? number - 1 : number)
        : '0x',
      gasUsed: 2_000_000,
      transactions: [],
    }
  }

  hashOf(number: number) {
    const reorgs = this.replacedFrom.filter((from) => number >= from).length
    return reorgs === 0 ? `0x${number}` : `0x${number}-${reorgs}`
  }

  fetched() {
    return this.getBlocks.calls.map((call) => call.args)
  }

  private serve(number: number): EVMBlockWithTransactions {
    if (number > this.latest || this.notServedOnce.delete(number)) {
      throw new NotFoundOnRpcError('Block not found')
    }
    const block = this.block(number)
    if (!this.forkedOnce.delete(number)) return block
    return { ...block, hash: `${block.hash}x`, parentHash: '0xother' }
  }
}

/** The `ChainBlock` table of one chain, in memory */
export class FakeChainBlocks {
  rows: ChainBlockRecord[]

  readonly repository = mockObject<Database['chainBlock']>({
    getNewest: async (_, limit) => this.rows.slice(-limit),
    getByNumberRange: async (_, from, to) =>
      this.rows.filter((r) => r.number >= from && r.number <= to),
    upsertMany: async (records) => {
      const numbers = new Set(records.map((r) => r.number))
      this.rows = [
        ...this.rows.filter((r) => !numbers.has(r.number)),
        ...records,
      ]
      this.rows.sort((a, b) => a.number - b.number)
      return records.length
    },
    findOldestSince: async (_, timestamp) =>
      this.rows.find((r) => r.timestamp >= timestamp),
    deleteAfter: async (_, number) => this.keep((r) => r.number <= number),
    deleteByChain: async () => this.keep(() => false),
    deleteBefore: async (_, timestamp) =>
      this.keep((r) => r.timestamp >= timestamp),
  })
  /** What the head last wrote of its source having nothing newer */
  confirmed: ChainHeadRecord | undefined
  readonly headRepository = mockObject<Database['chainHead']>({
    upsert: async (record) => {
      this.confirmed = record
    },
  })
  readonly db = mockDatabase({
    chainBlock: this.repository,
    chainHead: this.headRepository,
  })

  constructor(chain: string, blocks: EVMBlockWithTransactions[] = []) {
    this.rows = blocks.map((block) => ({
      chain,
      number: block.number,
      hash: block.hash,
      parentHash: block.parentHash,
      timestamp: block.timestamp,
      logsBloom: block.logsBloom,
    }))
  }

  numbers() {
    return this.rows.map((r) => r.number)
  }

  hashes() {
    return this.rows.map((r) => r.hash)
  }

  private keep(predicate: (row: ChainBlockRecord) => boolean) {
    const before = this.rows.length
    this.rows = this.rows.filter(predicate)
    return before - this.rows.length
  }
}

/** The `ChainHeadCursor` table, in memory */
export class FakeChainHeadCursors {
  rows = new Map<string, ChainHeadCursorRecord>()

  readonly repository = mockObject<Database['chainHeadCursor']>({
    findByIndexerId: async (indexerId) => this.rows.get(indexerId),
    upsert: async (record) => {
      this.rows.set(record.indexerId, record)
    },
    deleteByIndexerIds: async (indexerIds) =>
      indexerIds.filter((indexerId) => this.rows.delete(indexerId)).length,
  })
}

/** The `IndexerState` table, in memory: the heights UIF saves */
export class FakeIndexerStates {
  rows = new Map<string, { safeHeight: number; configHash?: string }>()

  readonly repository = mockObject<Database['indexerState']>({
    findByIndexerId: async (indexerId) => {
      const state = this.rows.get(indexerId)
      return state && { indexerId, ...state }
    },
    upsert: async (record) => {
      this.rows.set(record.indexerId, record)
    },
    updateSafeHeight: async (indexerId, safeHeight) => {
      this.rows.set(indexerId, { ...this.rows.get(indexerId), safeHeight })
      return 1
    },
  })
}
