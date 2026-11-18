import type { Logger } from '@l2beat/backend-tools'
import { type BlobsInBlock, getBlockNumberAtOrBefore } from '@l2beat/shared'
import {
  assert,
  Bytes,
  EthereumAddress,
  type Hash256,
  toBatches,
  UnixTime,
} from '@l2beat/shared-pure'
import { createHash } from 'crypto'
import { BigNumber, type providers } from 'ethers'
import type { ContractSource } from '../../utils/IEtherscanClient'
import { isRevert } from '../utils/isRevert'
import { DebugTransactionCallResponse } from './DebugTransactionTrace'
import type { CacheEntry } from './DiscoveryCache'
import type { RawProviders } from './IProvider'
import {
  HELD_TOKENS_FILTER_MAX,
  type LowLevelProvider,
  type RawContractDeployment,
} from './LowLevelProvider'
import type { MulticallClient } from './multicall/MulticallClient'
import type { ReorgAwareCache } from './ReorgAwareCache'
import { ProviderMeasurement, ProviderStats } from './Stats'

export const REUSABLE_CACHE_INVOCATIONS = {
  getSource: 'getSource-v3',
  getDeployment: 'getDeployment',
  getTransaction: 'getTransaction',
  getBlock: 'getBlock',
  getBlobs: 'getBlobs',
  getDebugTrace: 'getDebugTrace',
  getBlockNumberAtOrBefore: 'getBlockNumberAtOrBefore',
} as const

interface ScheduledCall {
  resolve: (value: Bytes) => void
  reject: (reason: unknown) => void
  address: EthereumAddress
  data: Bytes
  blockNumber: number
}

interface ScheduledStorageRead {
  resolve: (value: Bytes) => void
  reject: (reason: unknown) => void
  address: EthereumAddress
  slot: number | bigint | Bytes
  blockNumber: number
}

interface ScheduledLogRequest {
  resolve: (value: providers.Log[]) => void
  reject: (reason: unknown) => void
  address: EthereumAddress
  topic0: string[]
  toBlock: number
}

interface LogExecutionItem {
  toBlock: number
  address: EthereumAddress
  topic: string
  items: {
    logRequest: ScheduledLogRequest
    entries: CacheEntry[]
    logs: providers.Log[]
    errored: boolean
  }[]
}

// A never-read holder costs the index about 130 ms of disk, one after another
// within a call and against a 10 s limit: 100 holders in one call time out,
// 25 take 3 s. Past 4 calls at once the disks are saturated.
const HELD_TOKENS_HOLDERS_PER_CALL = 25
const HELD_TOKENS_CALLS_IN_FLIGHT = 4
// The RPC refuses to answer with more tokens than this.
const HELD_TOKENS_ANSWER_MAX = 100_000

const REVERT_MARKER_VALUE = '{execution reverted}'
const UNDEFINED_MARKER_VALUE = '{undefined value}'

export class BatchingAndCachingProvider {
  public stats: ProviderStats = new ProviderStats()
  private calls: ScheduledCall[] = []
  private callsTimeout: ReturnType<typeof setTimeout> | undefined

  private logRequests: ScheduledLogRequest[] = []
  private logRequestsTimeout: ReturnType<typeof setTimeout> | undefined

  private storageReads: ScheduledStorageRead[] = []
  private storageReadsTimeout: ReturnType<typeof setTimeout> | undefined

  // Flips to true the first time a state-override eth_call fails, so
  // subsequent storage-read flushes skip the override path and go
  // straight to per-slot fetches.
  private stateOverrideUnsupported = false

  constructor(
    private cache: ReorgAwareCache,
    private provider: LowLevelProvider,
    private multicallClient: MulticallClient,
    private logger: Logger,
  ) {}

  async raw<T>(
    cacheKey: string,
    fn: (providers: RawProviders, logger: Logger) => Promise<T>,
  ): Promise<T> {
    const entry = await this.cache.entry(cacheKey, [], undefined)
    const cached = entry.read()
    if (cached !== undefined) {
      return parseCacheEntry(cached)
    }
    const result = await fn(this.provider.getRawProviders(), this.logger)
    if (result !== undefined) {
      entry.write(JSON.stringify(result))
    }
    return result
  }

  call(
    address: EthereumAddress,
    data: Bytes,
    blockNumber: number,
  ): Promise<Bytes> {
    return new Promise((resolve, reject) => {
      this.calls.push({ resolve, reject, address, data, blockNumber })
      if (!this.callsTimeout) {
        this.callsTimeout = setTimeout(() => {
          this.callsTimeout = undefined
          const calls = this.calls
          this.calls = []
          this.flushCalls(calls).catch((e: unknown) => rejectAll(calls, e))
        }, 0) // TODO: 1?
      }
    })
  }

  async callUnbatched(
    address: EthereumAddress,
    data: Bytes,
    blockNumber: number,
  ): Promise<Bytes> {
    let duration = -performance.now()
    const entry = await this.cache.entry(
      'call',
      [blockNumber, address, data],
      blockNumber,
    )
    const cached = entry.read()
    if (cached !== undefined) {
      duration += performance.now()
      this.stats.mark(ProviderMeasurement.CALL, duration)
      if (cached === REVERT_MARKER_VALUE) {
        throw new Error('Execution reverted')
      }
      return Bytes.fromHex(cached)
    }

    try {
      const result = await this.provider.call(address, data, blockNumber)
      entry.write(result.toString())
      return result
    } catch (e) {
      if (isRevert(e)) {
        entry.write(REVERT_MARKER_VALUE)
      }
      throw e
    }
  }

  private async flushCalls(calls: ScheduledCall[]) {
    const start = performance.now()

    const checkedInCache = await Promise.all(
      calls.map(async (call) => ({
        call,
        entry: await this.cache.entry(
          'call',
          [call.blockNumber, call.address, call.data],
          call.blockNumber,
        ),
      })),
    )

    const toExecute = new Map<
      number,
      { call: ScheduledCall; entry: CacheEntry }[]
    >()
    for (const checked of checkedInCache) {
      const cached = checked.entry.read()
      if (cached === undefined) {
        const calls = toExecute.get(checked.call.blockNumber) ?? []
        calls.push(checked)
        toExecute.set(checked.call.blockNumber, calls)
      } else {
        const duration = performance.now() - start
        this.stats.mark(ProviderMeasurement.CALL, duration)
        if (cached === REVERT_MARKER_VALUE) {
          checked.call.reject(new Error('Execution reverted'))
        } else {
          checked.call.resolve(Bytes.fromHex(cached))
        }
      }
    }

    await Promise.all(
      [...toExecute.entries()].map(([blockNumber, calls]) =>
        this.multicall(calls, blockNumber),
      ),
    )
  }

  private async multicall(
    checked: { call: ScheduledCall; entry: CacheEntry }[],
    blockNumber: number,
  ) {
    try {
      const results = await this.multicallClient.multicall(
        checked.map(({ call }) => ({ address: call.address, data: call.data })),
        blockNumber,
      )
      assert(results.length === checked.length)
      for (let i = 0; i < checked.length; i++) {
        // biome-ignore lint/style/noNonNullAssertion: Checked in assert
        const item = checked[i]!
        // biome-ignore lint/style/noNonNullAssertion: Checked in assert
        const result = results[i]!
        if (result.success) {
          item.call.resolve(result.data)
          item.entry.write(result.data.toString())
        } else {
          item.call.reject(new Error('Multicall item reverted'))
          item.entry.write(REVERT_MARKER_VALUE)
        }
      }
    } catch (e) {
      for (const { call } of checked) {
        call.reject(e)
      }
    }
  }

  getStorage(
    address: EthereumAddress,
    slot: number | bigint | Bytes,
    blockNumber: number,
  ): Promise<Bytes> {
    return new Promise((resolve, reject) => {
      this.storageReads.push({ resolve, reject, address, slot, blockNumber })
      if (!this.storageReadsTimeout) {
        this.storageReadsTimeout = setTimeout(() => {
          this.storageReadsTimeout = undefined
          const reads = this.storageReads
          this.storageReads = []
          this.flushStorageReads(reads).catch((e: unknown) =>
            rejectAll(reads, e),
          )
        }, 0)
      }
    })
  }

  private async flushStorageReads(reads: ScheduledStorageRead[]) {
    const start = performance.now()

    const checkedInCache = await Promise.all(
      reads.map(async (read) => ({
        read,
        entry: await this.cache.entry(
          'getStorage',
          [read.blockNumber, read.address, read.slot],
          read.blockNumber,
        ),
      })),
    )

    // Group misses by (address, blockNumber) — one eth_call with state
    // override can only target a single address, so each group becomes one
    // batched RPC.
    const toExecute = new Map<
      string,
      { read: ScheduledStorageRead; entry: CacheEntry }[]
    >()
    for (const checked of checkedInCache) {
      const cached = checked.entry.read()
      if (cached === undefined) {
        const key = `${checked.read.blockNumber}.${checked.read.address.toString()}`
        const group = toExecute.get(key) ?? []
        group.push(checked)
        toExecute.set(key, group)
      } else {
        const duration = performance.now() - start
        this.stats.mark(ProviderMeasurement.GET_STORAGE, duration)
        checked.read.resolve(Bytes.fromHex(cached))
      }
    }

    await Promise.all(
      [...toExecute.values()].map((group) => this.batchReadStorage(group)),
    )
  }

  private async batchReadStorage(
    group: { read: ScheduledStorageRead; entry: CacheEntry }[],
  ) {
    const first = group[0]
    assert(first !== undefined, 'empty storage group')
    const { address, blockNumber } = first.read
    const slots = group.map((g) => g.read.slot)

    try {
      let values: Bytes[]
      if (this.stateOverrideUnsupported || slots.length === 1) {
        values = await Promise.all(
          slots.map((slot) =>
            this.provider.getStorage(address, slot, blockNumber),
          ),
        )
      } else {
        try {
          values = await this.provider.batchReadStorage(
            address,
            slots,
            blockNumber,
          )
        } catch (e) {
          this.logger.warn(
            'State override batch storage read failed, falling back to per-slot fetch',
            { error: e },
          )
          this.stateOverrideUnsupported = true
          values = await Promise.all(
            slots.map((slot) =>
              this.provider.getStorage(address, slot, blockNumber),
            ),
          )
        }
      }

      assert(values.length === group.length)
      for (let i = 0; i < group.length; i++) {
        const item = group[i] as {
          read: ScheduledStorageRead
          entry: CacheEntry
        }
        const value = values[i] as Bytes
        item.read.resolve(value)
        item.entry.write(value.toString())
      }
    } catch (e) {
      for (const item of group) {
        item.read.reject(e)
      }
    }
  }

  async getLogs(
    address: EthereumAddress,
    topics: (string | string[] | null)[],
    fromBlock: number,
    toBlock: number,
  ): Promise<providers.Log[]> {
    let duration = -performance.now()
    const topic0 = typeof topics[0] === 'string' ? [topics[0]] : topics[0]
    // Complex case, we can't batch this
    if (fromBlock !== 0 || topics.length !== 1 || !topic0) {
      const topicsHash: string = createHash('sha256')
        .update(JSON.stringify(topics))
        .digest('hex')
      const entry = await this.cache.entry(
        'getLogs',
        [address, fromBlock, toBlock, topicsHash],
        undefined,
      )
      const cached = entry.read()
      if (cached !== undefined) {
        duration += performance.now()
        this.stats.mark(ProviderMeasurement.GET_LOGS, duration)
        return parseCacheEntry(cached)
      }
      const logs = await getAllLogs(
        this.provider,
        address,
        topics,
        fromBlock,
        toBlock,
      )
      entry.write(JSON.stringify(logs))
      return logs
    }

    return new Promise((resolve, reject) => {
      this.logRequests.push({
        resolve,
        reject,
        address,
        topic0,
        toBlock,
      })
      if (!this.logRequestsTimeout) {
        this.logRequestsTimeout = setTimeout(() => {
          this.logRequestsTimeout = undefined
          const logRequests = this.logRequests
          this.logRequests = []
          this.flushLogRequests(logRequests).catch((e: unknown) =>
            rejectAll(logRequests, e),
          )
        }, 0) // TODO: 1?
      }
    })
  }

  private async flushLogRequests(logRequests: ScheduledLogRequest[]) {
    const start = performance.now()

    const checkedInCache = await Promise.all(
      logRequests.map(async (logRequest) => ({
        logRequest,
        entries: await Promise.all(
          logRequest.topic0.map((topic) =>
            this.cache.entry(
              'getLogs',
              [logRequest.address, 0, logRequest.toBlock, topic],
              logRequest.toBlock,
            ),
          ),
        ),
      })),
    )

    const toExecute: LogExecutionItem[] = []

    for (const checked of checkedInCache) {
      const missingTopics: string[] = []
      const logs = checked.entries.flatMap((entry, i) => {
        const cached = entry.read()
        if (cached === undefined) {
          // biome-ignore lint/style/noNonNullAssertion: same length as entries
          missingTopics.push(checked.logRequest.topic0[i]!)
          return []
        }
        const duration = performance.now() - start
        this.stats.mark(ProviderMeasurement.GET_LOGS, duration)
        return parseCacheEntry(cached) as providers.Log[]
      })

      if (missingTopics.length === 0) {
        logs.sort(orderLogs)
        checked.logRequest.resolve(logs)
        continue
      }

      for (const topic of missingTopics) {
        let group = toExecute.find(
          (group) =>
            group.toBlock === checked.logRequest.toBlock &&
            group.address === checked.logRequest.address &&
            group.topic === topic,
        )
        if (!group) {
          group = {
            toBlock: checked.logRequest.toBlock,
            address: checked.logRequest.address,
            topic,
            items: [],
          }
          toExecute.push(group)
        }
        group.items.push({ ...checked, logs, errored: false })
      }
    }

    const similar = new Map<string, LogExecutionItem[]>()
    for (const item of toExecute) {
      // Potentially we can even only care about toBlock!
      const key = `${item.address}-${item.toBlock}`
      const group = similar.get(key) ?? []
      group.push(item)
      similar.set(key, group)
    }

    await Promise.all(
      [...similar.values()].map((group) => this.multicallLogs(group)),
    )
  }

  async multicallLogs(items: LogExecutionItem[]) {
    // biome-ignore lint/style/noNonNullAssertion: same length as entries
    const first = items[0]!
    const topics = items.map((item) => item.topic)

    let logs: providers.Log[] = []
    try {
      logs = await getAllLogs(
        this.provider,
        first.address,
        [topics],
        0,
        first.toBlock,
      )
    } catch (e) {
      for (const item of items) {
        for (const nested of item.items) {
          if (!nested.errored) {
            nested.errored = true
            nested.logRequest.reject(e)
          }
        }
      }
      return
    }

    const byTopic = new Map<string, providers.Log[]>()
    for (const log of logs) {
      const topic = log.topics[0] ?? ''
      const topicLogs = byTopic.get(topic) ?? []
      topicLogs.push(log)
      byTopic.set(topic, topicLogs)
    }

    for (const topic of topics) {
      const topicLogs = byTopic.get(topic) ?? []

      // We bypass the entries mechanism to avoid repeated writes
      this.cache.write(
        'getLogs',
        [first.address, 0, first.toBlock, topic],
        first.toBlock,
        JSON.stringify(topicLogs),
      )
    }

    for (const item of items) {
      for (const nested of item.items) {
        const topicLogs = byTopic.get(item.topic) ?? []
        for (const topic of topicLogs) {
          nested.logs.push(topic)
        }
      }
    }

    const uniqueNested = new Set(items.flatMap((x) => x.items))
    for (const nested of uniqueNested) {
      nested.logRequest.resolve(nested.logs.sort(orderLogs))
    }
  }

  async getBlock(blockNumber: number): Promise<providers.Block | undefined> {
    let duration = -performance.now()
    const entry = await this.cache.entry(
      REUSABLE_CACHE_INVOCATIONS.getBlock,
      [blockNumber],
      undefined,
    )
    const cached = entry.read()
    if (cached !== undefined) {
      // This recovers BigNumber instances from the cache
      // BigNumbers are saved in JSON as { type: 'BigNumber', hex: '0x123' }
      const parsed = parseCacheEntry(cached) as providers.Block | null
      if (parsed !== null && parsed !== undefined) {
        duration += performance.now()
        this.stats.mark(ProviderMeasurement.GET_BLOCK, duration)
        return parsed
      }
    }

    const block = await this.provider.getBlock(blockNumber)
    if (block === undefined || block === null) {
      return undefined
    }

    entry.write(JSON.stringify(block))
    return block
  }

  async getBlockNumberAtOrBefore(timestamp: UnixTime): Promise<number> {
    let duration = -performance.now()
    const entry = await this.cache.entry(
      REUSABLE_CACHE_INVOCATIONS.getBlockNumberAtOrBefore,
      [timestamp],
      undefined,
    )
    const cached = entry.read()
    if (cached !== undefined) {
      duration += performance.now()
      this.stats.mark(
        ProviderMeasurement.GET_BLOCK_NUMBER_AT_OR_BEFORE,
        duration,
      )
      return parseCacheEntry(cached)
    }
    let blockNumber: number
    try {
      blockNumber =
        await this.provider.getBlockNumberAtOrBeforeExplorer(timestamp)
    } catch {
      blockNumber = await getBlockNumberAtOrBefore(
        timestamp,
        1, // NOTE(radomski): We don't support discovery on block 0, but assuming it's fine
        await this.provider.getBlockNumber(),
        async (blockNumber: number) => {
          const block = await this.getBlock(blockNumber)
          assert(block !== undefined, `Could not find block ${blockNumber}`)
          return block
        },
      )
    }

    entry.write(blockNumber.toString())
    return blockNumber
  }

  async getTransaction(
    transactionHash: Hash256,
  ): Promise<providers.TransactionResponse | undefined> {
    let duration = -performance.now()
    const entry = await this.cache.entry(
      REUSABLE_CACHE_INVOCATIONS.getTransaction,
      [transactionHash],
      undefined,
    )
    const cached = entry.read()
    if (cached !== undefined) {
      duration += performance.now()
      this.stats.mark(ProviderMeasurement.GET_TRANSACTION, duration)
      // This recovers BigNumber instances from the cache
      // BigNumbers are saved in JSON as { type: 'BigNumber', hex: '0x123' }
      return parseCacheEntry(cached)
    }

    const transaction = await this.provider.getTransaction(transactionHash)
    if (transaction === undefined) {
      return undefined
    }
    // We don't want to cache nor return non-mined transactions
    assert(transaction.blockNumber, 'Transaction not mined')

    entry.write(JSON.stringify(transaction))
    return transaction
  }

  // Per holder: the `tokens` it ever sent or received, or undefined when the
  // RPC cannot tell, which is the case on every RPC but ours and for chains
  // whose holder index is not built. The caller then has to check every token.
  //
  // Cached under the block, which is sound because a token first touched after
  // that block has no balance at it. Undefined is never cached, so a chain
  // starts using its index as soon as the index is ready.
  async getHeldTokens(
    holders: EthereumAddress[],
    tokens: EthereumAddress[],
    blockNumber: number,
  ): Promise<(EthereumAddress[] | undefined)[]> {
    if (tokens.length === 0) {
      return holders.map(() => [])
    }
    if (tokens.length > HELD_TOKENS_FILTER_MAX) {
      this.logger.warn('Too many tokens for the holder index', {
        tokens: tokens.length,
      })
      return holders.map(() => undefined)
    }

    const start = performance.now()
    const filter = tokens.map((token) => token.toLowerCase())
    const filterHash = createHash('sha256')
      .update(filter.join(','))
      .digest('hex')
    const entries = await Promise.all(
      holders.map((holder) =>
        this.cache.entry(
          'getHeldTokens',
          [blockNumber, holder, filterHash],
          blockNumber,
        ),
      ),
    )

    const held: (EthereumAddress[] | undefined)[] = []
    const missing: number[] = []
    for (let index = 0; index < holders.length; index++) {
      const cached = entries[index]?.read()
      if (cached === undefined) {
        held.push(undefined)
        missing.push(index)
      } else {
        held.push((parseCacheEntry(cached) as string[]).map(EthereumAddress))
        this.stats.mark(
          ProviderMeasurement.GET_HELD_TOKENS,
          performance.now() - start,
        )
      }
    }

    const holdersPerCall = Math.min(
      HELD_TOKENS_HOLDERS_PER_CALL,
      Math.floor(HELD_TOKENS_ANSWER_MAX / tokens.length),
    )
    const fetched = await this.fetchHeldTokens(
      missing.map((index) => holders[index] as EthereumAddress),
      tokens,
      holdersPerCall,
    )
    for (let i = 0; i < missing.length; i++) {
      const index = missing[i] as number
      const answer = fetched[i]
      held[index] = answer
      if (answer !== undefined) {
        entries[index]?.write(JSON.stringify(answer))
      }
    }
    return held
  }

  // Stops asking at the first refusal: an RPC without the index would refuse
  // every call, and each one uploads the whole filter.
  private async fetchHeldTokens(
    holders: EthereumAddress[],
    tokens: EthereumAddress[],
    holdersPerCall: number,
  ): Promise<(EthereumAddress[] | undefined)[]> {
    assert(holdersPerCall >= 1, 'A call has to ask about some holder')
    const calls = toBatches(holders, holdersPerCall)
    const answers: (EthereumAddress[][] | undefined)[] = calls.map(
      () => undefined,
    )

    let next = 0
    let refused = false
    const askUntilRefused = async () => {
      while (!refused && next < calls.length) {
        const index = next++
        try {
          answers[index] = await this.provider.getHeldTokens(
            calls[index] as EthereumAddress[],
            tokens,
          )
        } catch (e) {
          refused = true
          this.logger.warn('Holder index unavailable', {
            reason: toRpcErrorMessage(e),
          })
        }
      }
    }
    await Promise.all(
      Array.from({ length: HELD_TOKENS_CALLS_IN_FLIGHT }, askUntilRefused),
    )

    return calls.flatMap(
      (call, index) => answers[index] ?? call.map(() => undefined),
    )
  }

  async getDebugTrace(
    transactionHash: Hash256,
  ): Promise<DebugTransactionCallResponse> {
    let duration = -performance.now()
    const entry = await this.cache.entry(
      REUSABLE_CACHE_INVOCATIONS.getDebugTrace,
      [transactionHash],
      undefined,
    )
    const cached = entry.read()
    if (cached !== undefined) {
      duration += performance.now()
      this.stats.mark(ProviderMeasurement.GET_DEBUG_TRACE, duration)
      return DebugTransactionCallResponse.parse(parseCacheEntry(cached))
    }
    const trace = await this.provider.getDebugTrace(transactionHash)
    if (trace.calls) {
      entry.write(JSON.stringify(trace))
    }
    return trace
  }

  async getBytecode(
    address: EthereumAddress,
    blockNumber: number,
  ): Promise<Bytes> {
    let duration = -performance.now()
    const entry = await this.cache.entry(
      'getBytecode',
      [address, blockNumber],
      blockNumber,
    )
    const cached = entry.read()
    if (cached !== undefined) {
      duration += performance.now()
      this.stats.mark(ProviderMeasurement.GET_BYTECODE, duration)
      return Bytes.fromHex(cached)
    }
    const bytecode = await this.provider.getBytecode(address, blockNumber)
    entry.write(bytecode.toString())
    return bytecode
  }

  async getSource(address: EthereumAddress): Promise<ContractSource> {
    let duration = -performance.now()
    const entry = await this.cache.entry(
      REUSABLE_CACHE_INVOCATIONS.getSource,
      [address],
      undefined,
    )
    const cached = entry.read()
    if (cached !== undefined) {
      duration += performance.now()
      this.stats.mark(ProviderMeasurement.GET_SOURCE, duration)
      return parseCacheEntry(cached)
    }
    const source = await this.provider.getSource(address)
    if (source.isVerified) {
      entry.write(JSON.stringify(source))
    }
    return source
  }

  async getDeployment(
    address: EthereumAddress,
  ): Promise<RawContractDeployment | undefined> {
    let duration = -performance.now()
    const entry = await this.cache.entry(
      REUSABLE_CACHE_INVOCATIONS.getDeployment,
      [address],
      undefined,
    )
    const cached = entry.read()
    if (cached !== undefined) {
      duration += performance.now()
      this.stats.mark(ProviderMeasurement.GET_DEPLOYMENT, duration)
      // legacy, markers no longer inserted
      if (cached === UNDEFINED_MARKER_VALUE) {
        return undefined
      }
      const parsed = parseCacheEntry(cached)
      parsed.timestamp = UnixTime(parsed.timestamp)
      return parsed
    }
    const deployment = await this.provider.getDeployment(address)
    if (deployment !== undefined) {
      entry.write(JSON.stringify(deployment))
    }
    return deployment
  }

  async getBlobs(txHash: string): Promise<BlobsInBlock> {
    const entry = await this.cache.entry(
      REUSABLE_CACHE_INVOCATIONS.getBlobs,
      [txHash],
      undefined,
    )
    const cached = entry.read()
    if (cached !== undefined) {
      return parseCacheEntry(cached)
    }
    const blobs = await this.provider.getBlobs(txHash)
    entry.write(JSON.stringify(blobs))
    return blobs
  }

  async celestiaBlobExists(
    height: number,
    namespace: string,
    commitment: string,
  ) {
    const entry = await this.cache.entry(
      'celestiaBlobExists',
      [height, namespace, commitment],
      undefined,
    )
    const cached = entry.read()
    if (cached !== undefined) {
      return parseCacheEntry(cached)
    }

    const blobExists = await this.provider.celestiaBlobExists(
      height,
      namespace,
      commitment,
    )

    entry.write(JSON.stringify(blobExists))

    return blobExists
  }

  async getCelestiaBlockResultEvents(height: number) {
    const entry = await this.cache.entry(
      'getCelestiaBlockResultEvents',
      [height],
      undefined,
    )
    const cached = entry.read()
    if (cached !== undefined) {
      return parseCacheEntry(cached)
    }
    const events = await this.provider.getCelestiaBlockResultEvents(height)
    entry.write(JSON.stringify(events))
    return events
  }
}

export function orderLogs(a: providers.Log, b: providers.Log) {
  const blocks = a.blockNumber - b.blockNumber
  if (blocks !== 0) {
    return blocks
  }
  return a.logIndex - b.logIndex
}

function rejectAll(
  requests: { reject: (reason: unknown) => void }[],
  error: unknown,
) {
  for (const request of requests) {
    request.reject(error)
  }
}

function parseCacheEntry(entry: string) {
  return JSON.parse(entry, (_, value: unknown) => {
    if (
      typeof value === 'object' &&
      value !== null &&
      Reflect.get(value, 'type') === 'BigNumber'
    ) {
      return BigNumber.from(Reflect.get(value, 'hex'))
    }
    return value
  })
}

async function getAllLogs(
  provider: LowLevelProvider,
  address: EthereumAddress,
  topics: (string | string[] | null)[],
  fromBlock: number,
  toBlock: number,
): Promise<providers.Log[]> {
  if (fromBlock === toBlock) {
    return await provider.getLogs(address, topics, fromBlock, toBlock)
  }
  try {
    return await provider.getLogs(address, topics, fromBlock, toBlock)
  } catch (e) {
    if (e instanceof Error && isRangeTooLarge(e)) {
      const midPoint = fromBlock + Math.floor((toBlock - fromBlock) / 2)
      const [a, b] = await Promise.all([
        getAllLogs(provider, address, topics, fromBlock, midPoint),
        getAllLogs(provider, address, topics, midPoint + 1, toBlock),
      ])
      return a.concat(b)
    }
    throw e
  }
}

// Alchemy answers a range that is too slow to scan, rather than too big to
// return, with a timeout that asks for a smaller range; splitting helps
// with both.
function isRangeTooLarge(error: Error): boolean {
  return (
    error.message.includes('Log response size exceeded') ||
    error.message.includes('Consider reducing your block range')
  )
}

// The error itself is not logged: ethers puts the RPC URL in it, API key
// included. The message of the JSON-RPC error inside carries the reason.
function toRpcErrorMessage(error: unknown): string {
  const rpcError = (error as { error?: unknown } | null)?.error
  const message = (rpcError as { message?: unknown } | null)?.message
  return typeof message === 'string' ? message : 'unknown'
}
