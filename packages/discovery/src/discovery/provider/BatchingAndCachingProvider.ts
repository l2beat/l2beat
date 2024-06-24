import { createHash } from 'crypto'
import {
  assert,
  Bytes,
  EthereumAddress,
  Hash256,
  UnixTime,
} from '@l2beat/shared-pure'
import { BigNumber, providers } from 'ethers'
import { isRevert } from '../utils/isRevert'
import { DebugTransactionCallResponse } from './DebugTransactionTrace'
import { ContractDeployment, ContractSource, RawProviders } from './IProvider'
import { LowLevelProvider } from './LowLevelProvider'
import { CacheEntry, ReorgAwareCache } from './ReorgAwareCache'
import { ProviderStats, getZeroStats } from './Stats'
import { MulticallClient } from './multicall/MulticallClient'

interface ScheduledCall {
  resolve: (value: Bytes) => void
  reject: (reason: unknown) => void
  address: EthereumAddress
  data: Bytes
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

const REVERT_MARKER_VALUE = '{execution reverted}'

export class BatchingAndCachingProvider {
  public stats: ProviderStats = getZeroStats()
  private calls: ScheduledCall[] = []
  private callsTimeout: ReturnType<typeof setTimeout> | undefined

  private logRequests: ScheduledLogRequest[] = []
  private logRequestsTimeout: ReturnType<typeof setTimeout> | undefined

  constructor(
    private cache: ReorgAwareCache,
    private provider: LowLevelProvider,
    private multicallClient: MulticallClient,
  ) {}

  async raw<T>(
    cacheKey: string,
    fn: (providers: RawProviders) => Promise<T>,
  ): Promise<T> {
    const entry = await this.cache.entry(cacheKey, [], undefined)
    const cached = entry.read()
    if (cached !== undefined) {
      return parseCacheEntry(cached)
    }
    const result = await fn(this.provider.getRawProviders())
    if (result !== undefined) {
      entry.write(JSON.stringify(result))
    }
    return result
  }

  async call(
    address: EthereumAddress,
    data: Bytes,
    blockNumber: number,
  ): Promise<Bytes> {
    return new Promise((resolve, reject) => {
      this.calls.push({ resolve, reject, address, data, blockNumber })
      if (!this.callsTimeout) {
        this.callsTimeout = setTimeout(() => {
          this.callsTimeout = undefined
          this.flushCalls()
        }, 0) // TODO: 1?
      }
    })
  }

  async callUnbatched(
    address: EthereumAddress,
    data: Bytes,
    blockNumber: number,
  ): Promise<Bytes> {
    const entry = await this.cache.entry(
      'call',
      [blockNumber, address, data],
      blockNumber,
    )
    const cached = entry.read()
    if (cached !== undefined) {
      this.stats.callCount++
      if (cached === REVERT_MARKER_VALUE) {
        throw new Error('Execution reverted')
      } else {
        return Bytes.fromHex(cached)
      }
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

  private async flushCalls() {
    const calls = [...this.calls]
    this.calls = []

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
        this.stats.callCount++
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

  async getStorage(
    address: EthereumAddress,
    slot: number | bigint | Bytes,
    blockNumber: number,
  ): Promise<Bytes> {
    const entry = await this.cache.entry(
      'getStorage',
      [blockNumber, address, slot],
      blockNumber,
    )
    const cached = entry.read()
    if (cached !== undefined) {
      this.stats.getStorageCount++
      return Bytes.fromHex(cached)
    }
    const storage = await this.provider.getStorage(address, slot, blockNumber)
    entry.write(storage.toString())
    return storage
  }

  async getLogs(
    address: EthereumAddress,
    topics: (string | string[] | null)[],
    fromBlock: number,
    toBlock: number,
  ): Promise<providers.Log[]> {
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
        this.stats.getLogsCount++
        return parseCacheEntry(cached)
      }
      const logs = await this.provider.getLogs(
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
          this.flushLogRequests()
        }, 0) // TODO: 1?
      }
    })
  }

  private async flushLogRequests() {
    const logRequests = [...this.logRequests]
    this.logRequests = []

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
        this.stats.getLogsCount++
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
      logs = await this.provider.getLogs(
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
        nested.logs.push(...topicLogs)
      }
    }

    const uniqueNested = new Set(items.flatMap((x) => x.items))
    for (const nested of uniqueNested) {
      nested.logRequest.resolve(nested.logs.sort(orderLogs))
    }
  }

  async getTransaction(
    transactionHash: Hash256,
  ): Promise<providers.TransactionResponse> {
    const entry = await this.cache.entry(
      'getTransaction',
      [transactionHash],
      undefined,
    )
    const cached = entry.read()
    if (cached !== undefined) {
      this.stats.getTransactionCount++
      // This recovers BigNumber instances from the cache
      // BigNumbers are saved in JSON as { type: 'BigNumber', hex: '0x123' }
      return parseCacheEntry(cached)
    }

    const transaction = await this.provider.getTransaction(transactionHash)
    // We don't want to cache nor return non-mined transactions
    assert(transaction.blockNumber, 'Transaction not mined')

    entry.write(JSON.stringify(transaction))
    return transaction
  }

  async getDebugTrace(
    transactionHash: Hash256,
  ): Promise<DebugTransactionCallResponse> {
    const entry = await this.cache.entry(
      'getDebugTrace',
      [transactionHash],
      undefined,
    )
    const cached = entry.read()
    if (cached !== undefined) {
      this.stats.getDebugTraceCount++
      return DebugTransactionCallResponse.parse(parseCacheEntry(cached))
    }
    const trace = await this.provider.getDebugTrace(transactionHash)
    entry.write(JSON.stringify(trace))
    return trace
  }

  async getBytecode(
    address: EthereumAddress,
    blockNumber: number,
  ): Promise<Bytes> {
    const entry = await this.cache.entry(
      'getBytecode',
      [address, blockNumber],
      blockNumber,
    )
    const cached = entry.read()
    if (cached !== undefined) {
      this.stats.getBytecodeCount++
      return Bytes.fromHex(cached)
    }
    const bytecode = await this.provider.getBytecode(address, blockNumber)
    entry.write(bytecode.toString())
    return bytecode
  }

  async getSource(address: EthereumAddress): Promise<ContractSource> {
    const entry = await this.cache.entry('getSource', [address], undefined)
    const cached = entry.read()
    if (cached !== undefined) {
      this.stats.getSourceCount++
      return parseCacheEntry(cached)
    }
    const source = await this.provider.getSource(address)
    entry.write(JSON.stringify(source))
    return source
  }

  async getDeployment(
    address: EthereumAddress,
  ): Promise<ContractDeployment | undefined> {
    const entry = await this.cache.entry('getDeployment', [address], undefined)
    const cached = entry.read()
    if (cached !== undefined) {
      this.stats.getDeploymentCount++
      const parsed = parseCacheEntry(cached)
      parsed.timestamp = new UnixTime(parsed.timestamp)
      return parsed
    }
    const deployment = await this.provider.getDeployment(address)
    entry.write(JSON.stringify(deployment))
    return deployment
  }
}

function orderLogs(a: providers.Log, b: providers.Log) {
  const blocks = a.blockNumber - b.blockNumber
  if (blocks !== 0) {
    return blocks
  }
  return a.logIndex - b.logIndex
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
