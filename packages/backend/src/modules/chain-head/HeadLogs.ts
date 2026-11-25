import type { Logger } from '@l2beat/backend-tools'
import type { LogsTopicFilter } from '@l2beat/shared'
import { type Log, UnixTime } from '@l2beat/shared-pure'
import findLastIndex from 'lodash/findLastIndex'
import uniqBy from 'lodash/uniqBy'
import { isEmptyBloom, isInBloom, parseBloom, toBloomFilter } from './logsBloom'

/** How many blocks' logs are held for the next reader that asks */
const HELD_BLOCKS = 256
/**
 * Blocks older than this are read a range at a time. A source that has just
 * served a block may not have its logs yet and answer a range with none, so
 * the newest blocks are asked for one by one, by hash
 */
const SETTLED_AFTER = 5 * UnixTime.MINUTE

/** The logs a reader reads: of any of the addresses, with the topics as `eth_getLogs` takes them */
export interface LogNeed {
  addresses: string[]
  topics: LogsTopicFilter
}

interface Block {
  number: number
  hash: string
  timestamp: UnixTime
  logsBloom: string | null
}

interface LogSource {
  /** Fails when the answering node does not have the block */
  getLogs(
    blockHash: string,
    addresses: string[],
    topics: LogsTopicFilter,
  ): Promise<Log[]>
  /** Of the blocks with the numbers, both ends included, whatever their hashes */
  getLogsInRange(
    from: number,
    to: number,
    addresses: string[],
    topics: LogsTopicFilter,
  ): Promise<Log[]>
}

/**
 * The logs of a chain's newest blocks, for every reader of the chain's head.
 * Each reader names the logs it needs before any are read. The needs that
 * filter the same topic positions then share one request per block, as
 * `eth_getLogs` matches any of the values at a position. The requests a block
 * takes grow with the kinds of filter, not with the readers.
 *
 * A reader waits only for the request its own need is in, so a filter the
 * source refuses holds back the readers that share it and no others.
 *
 * A block whose logs bloom rules a filter out is not asked about at all: the
 * bloom is in the header the head has stored, and a "no" from it is certain.
 * On a chain with few logs that is nearly every block. The others are asked
 * about by hash, and a block's logs are held by its hash, so a block that
 * replaced another is never answered with the other's logs.
 *
 * Where a chain's blooms say nothing (it does not fill them in, or they are
 * of other blocks' logs), the newest blocks are asked about by hash one by
 * one, and blocks a few minutes old a range at a time, which is what
 * catching up is made of. Every log of a range has to be of the block the
 * head has stored at its number, but a range cannot tell a block with no
 * logs from one the source has no logs of yet: on such a chain that is left
 * to whoever compares what was read here with the hourly data.
 *
 * Blooms are believed only as long as every log that comes back is in its
 * block's bloom
 */
export class HeadLogs {
  private readonly needs: LogNeed[] = []
  /** By kind of filter. Set once the first logs are read */
  private filters: Map<string, LogNeed> | undefined
  /** By block hash, or the hashes a range starts and ends with, and kind of filter */
  private readonly held = new Map<string, Promise<Log[] | Log[][]>>()
  /** By kind of filter: whether a block with the bloom can have its logs */
  private readonly bloomFilters = new Map<
    string,
    (bloom: Uint8Array) => boolean
  >()
  /** A block of the chain had a bloom with a log in it, so its empty blooms mean no logs */
  private fillsBlooms = false
  /** A log came back that its block's bloom does not have */
  private bloomsWrong = false

  /** Goes up when blooms prove wrong: blocks they ruled out may have had logs */
  get epoch(): number {
    return this.bloomsWrong ? 1 : 0
  }

  constructor(
    private readonly $: { chain: string; source: LogSource; logger: Logger },
  ) {}

  /**
   * Returns what reads the reader's logs of blocks the head has stored,
   * oldest first: the logs of each block, in the order of the chain
   */
  need({
    addresses,
    topics: filter,
  }: LogNeed): (blocks: Block[]) => Promise<Log[][]> {
    if (this.filters !== undefined) {
      // the logs held were fetched without this need
      throw new Error('Logs to read were named after the first were read', {
        cause: { chain: this.$.chain },
      })
    }
    if (addresses.length === 0) {
      // `eth_getLogs` takes no addresses for every address
      throw new Error('A reader named no address to read the logs of', {
        cause: { chain: this.$.chain },
      })
    }
    // `[event, null]` filters the same as `[event]`
    const kept = findLastIndex(filter, (topic) => topic !== null) + 1
    const need = { addresses, topics: filter.slice(0, kept) }
    this.needs.push(need)

    const named = new Set(addresses.map(lower))
    const topics = need.topics.map((topic) =>
      topic === null ? null : new Set([topic].flat().map(lower)),
    )
    const isNeeded = (log: Log) =>
      named.has(lower(log.address)) &&
      topics.every((topic, i) => {
        const value = log.topics[i]
        return (
          topic === null || (value !== undefined && topic.has(lower(value)))
        )
      })
    return async (blocks) => {
      const kind = kindOf(need)
      const settledBefore = UnixTime.now() - SETTLED_AFTER
      const logs = new Map<string, Promise<Log[]>>()
      /** Settled blocks in a row whose blooms say nothing */
      let run: Block[] = []
      const readRun = () => {
        const ranged = this.fetchRangeOnce(run, kind)
        run.forEach((block, i) => {
          logs.set(
            block.hash,
            ranged.then((r) => r[i]),
          )
        })
        run = []
      }
      for (const block of blocks) {
        const has = this.mayHaveLogs(block, kind)
        if (has === undefined && block.timestamp < settledBefore) {
          run.push(block)
          continue
        }
        readRun()
        logs.set(
          block.hash,
          has === false ? Promise.resolve([]) : this.fetchOnce(block, kind),
        )
      }
      readRun()
      const read = await Promise.all(blocks.map((b) => logs.get(b.hash) ?? []))
      return read.map((of) => of.filter(isNeeded))
    }
  }

  /**
   * What the block's bloom says of the logs of the kind: false when it rules
   * them out, undefined when it says nothing
   */
  private mayHaveLogs(block: Block, kind: string): boolean | undefined {
    const bloom = this.bloomsWrong ? undefined : parseBloom(block.logsBloom)
    if (bloom === undefined) return undefined
    if (isEmptyBloom(bloom)) return this.fillsBlooms ? false : undefined
    this.fillsBlooms = true

    this.filters ??= mergeNeeds(this.needs)
    const filter = this.filters.get(kind)
    if (filter === undefined) return false
    let mayMatch = this.bloomFilters.get(kind)
    if (mayMatch === undefined) {
      mayMatch = toBloomFilter(filter)
      this.bloomFilters.set(kind, mayMatch)
    }
    return mayMatch(bloom)
  }

  /** The logs of settled blocks for every need of the kind, block by block */
  private fetchRangeOnce(blocks: Block[], kind: string): Promise<Log[][]> {
    const [first, last] = [blocks.at(0), blocks.at(-1)]
    if (first === undefined || last === undefined) return Promise.resolve([])
    if (first === last) {
      return this.fetchOnce(first, kind).then((logs) => [logs])
    }
    return this.hold(`${first.hash}:${last.hash}:${kind}`, async () => {
      const filter = this.filters?.get(kind)
      const logs = filter
        ? await this.$.source.getLogsInRange(
            first.number,
            last.number,
            filter.addresses,
            filter.topics,
          )
        : []
      const hashes = new Map(blocks.map((b) => [b.number, b.hash]))
      const other = logs.find((l) => hashes.get(l.blockNumber) !== l.blockHash)
      if (other) {
        throw new Error('Source served logs of another block', {
          cause: { chain: this.$.chain, number: other.blockNumber },
        })
      }
      return blocks.map((block) =>
        logs
          .filter((log) => log.blockNumber === block.number)
          .sort((a, b) => a.logIndex - b.logIndex),
      )
    })
  }

  /** The block's logs for every need of the kind, asked for by its hash */
  private fetchOnce(block: Block, kind: string): Promise<Log[]> {
    return this.hold(`${block.hash}:${kind}`, () => this.fetch(block, kind))
  }

  /** Fetches once for all who ask, and again only after a failure */
  private hold<T extends Log[] | Log[][]>(
    key: string,
    fetch: () => Promise<T>,
  ): Promise<T> {
    this.filters ??= mergeNeeds(this.needs)
    const held = this.held.get(key)
    if (held !== undefined) return held as Promise<T>

    const logs = fetch()
    this.held.set(key, logs)
    logs.catch(() => {
      if (this.held.get(key) === logs) this.held.delete(key)
    })
    for (const oldest of this.held.keys()) {
      if (this.held.size <= HELD_BLOCKS * this.filters.size) break
      this.held.delete(oldest)
    }
    return logs
  }

  private async fetch(block: Block, kind: string) {
    const filter = this.filters?.get(kind)
    if (filter === undefined) return []
    const logs = await this.$.source.getLogs(
      block.hash,
      filter.addresses,
      filter.topics,
    )
    if (logs.some((log) => log.blockHash !== block.hash)) {
      throw new Error('Source served logs of another block', {
        cause: { chain: this.$.chain, number: block.number },
      })
    }
    const bloom = parseBloom(block.logsBloom)
    if (bloom && !this.bloomsWrong && !logs.every((l) => isInBloom(bloom, l))) {
      // every block is asked about from here on, as before blooms were used
      this.bloomsWrong = true
      this.$.logger.warn('Logs bloom of a block does not have its logs', {
        chain: this.$.chain,
        number: block.number,
      })
    }
    return logs.sort((a, b) => a.logIndex - b.logIndex)
  }
}

/** One filter for the needs that filter the same topic positions, by kind */
export function mergeNeeds(needs: LogNeed[]): Map<string, LogNeed> {
  const kinds = new Map<string, LogNeed[]>()
  for (const need of needs) {
    kinds.set(kindOf(need), [...(kinds.get(kindOf(need)) ?? []), need])
  }
  return new Map(
    [...kinds].map(([kind, sharing]) => [
      kind,
      {
        addresses: uniqBy(
          sharing.flatMap((need) => need.addresses),
          lower,
        ),
        topics: sharing[0].topics.map((topic, i) =>
          topic === null
            ? null
            : uniqBy(
                sharing.flatMap((need) => need.topics[i] ?? []),
                lower,
              ),
        ),
      },
    ]),
  )
}

/** Which topic positions the need filters */
function kindOf(need: LogNeed): string {
  return need.topics.map((topic) => (topic === null ? '_' : 'x')).join('')
}

function lower(value: string) {
  return value.toLowerCase()
}
