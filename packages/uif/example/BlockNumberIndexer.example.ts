import { Logger } from '@l2beat/backend-tools'

import { ChildIndexer, RootIndexer } from '../src'

interface Hash256 extends String {
  _Hash256Brand: string
}

function Hash256(hash: string): Hash256 {
  return hash as unknown as Hash256
}

interface UnixTime extends Number {
  _UnixTimeBrand: string
}

function UnixTime(timestamp: number): UnixTime {
  return timestamp as unknown as UnixTime
}

interface BlockFromClient {
  parentHash: string
  hash: string
  number: number
  timestamp: number
}

interface EthereumClient {
  getBlock: (block: Hash256 | number) => Promise<BlockFromClient>
  getBlockByTimestamp: (timestamp: UnixTime) => Promise<BlockFromClient>
  getBlockNumber: () => Promise<number>
  onBlock: (handler: (blockNumber: number) => void) => () => void
}

interface BlockRecord {
  number: number
  hash: Hash256
  timestamp: number
}

interface BlockRepository {
  findLast: () => Promise<BlockRecord | undefined>
  findByNumber: (number: number) => Promise<BlockRecord | undefined>
  findByTimestamp: (timestamp: UnixTime) => Promise<BlockRecord | undefined>
  addMany: (blocks: BlockRecord[]) => Promise<void>
  deleteAfter: (block: number) => Promise<void>
}

interface IndexerRepository {
  getSafeHeight: (indexerId: string) => Promise<number>
  setSafeHeight: (indexerId: string, height: number) => Promise<void>
}

export class ClockIndexer extends RootIndexer {
  override async start(): Promise<void> {
    await super.start()
    setInterval(() => this.requestTick(), 4 * 1000)
  }

  async tick(): Promise<number> {
    return Promise.resolve(getTimeSeconds())
  }
}

function getTimeSeconds(): number {
  return Math.floor(Date.now() / 1000)
}

export class BlockDownloader extends ChildIndexer {
  private lastKnownNumber = 0
  private reorgedBlocks = [] as BlockRecord[]
  private readonly id: string

  constructor(
    private readonly ethereumClient: EthereumClient,
    private readonly blockRepository: BlockRepository,
    private readonly indexerRepository: IndexerRepository,
    clockIndexer: ClockIndexer,
    logger: Logger,
  ) {
    super(logger, [clockIndexer])
    this.id = 'BlockDownloader' // this should be unique across all indexers
  }

  override async start(): Promise<void> {
    await super.start()
    this.lastKnownNumber = (await this.blockRepository.findLast())?.number ?? 0
  }

  protected async update(
    _fromTimestamp: number,
    toTimestamp: number,
  ): Promise<number> {
    if (this.reorgedBlocks.length > 0) {
      // we do not need to check if lastKnown < to because we are sure that
      // those blocks are from the past
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.lastKnownNumber = this.reorgedBlocks.at(-1)!.number
      await this.blockRepository.addMany(this.reorgedBlocks)
      this.reorgedBlocks = []
    }

    const tip = await this.ethereumClient.getBlockByTimestamp(
      UnixTime(toTimestamp),
    )
    if (tip.number <= this.lastKnownNumber) {
      return tip.timestamp
    }

    return await this.advanceChain(this.lastKnownNumber + 1)
  }

  protected async invalidate(to: number): Promise<number> {
    await this.blockRepository.deleteAfter(to)
    return to
  }

  private async advanceChain(blockNumber: number): Promise<number> {
    let [block, parent] = await Promise.all([
      this.ethereumClient.getBlock(blockNumber),
      this.getKnownBlock(blockNumber - 1),
    ])
    if (Hash256(block.parentHash) !== parent.hash) {
      const changed = [block]

      let current = blockNumber
      while (Hash256(block.parentHash) !== parent.hash) {
        current--
        ;[block, parent] = await Promise.all([
          this.ethereumClient.getBlock(Hash256(block.parentHash)),
          this.getKnownBlock(current - 1),
        ])
        changed.push(block)
      }

      this.reorgedBlocks = changed.reverse().map((block) => ({
        number: block.number,
        hash: Hash256(block.hash),
        timestamp: block.timestamp,
      }))

      return parent.timestamp
    }

    const record: BlockRecord = {
      number: block.number,
      hash: Hash256(block.hash),
      timestamp: block.timestamp,
    }
    await this.blockRepository.addMany([record])
    return block.timestamp
  }

  protected async setSafeHeight(height: number): Promise<void> {
    await this.indexerRepository.setSafeHeight(this.id, height)
  }

  getSafeHeight(): Promise<number> {
    return this.indexerRepository.getSafeHeight(this.id)
  }

  private async getKnownBlock(blockNumber: number): Promise<BlockRecord> {
    const known = await this.blockRepository.findByNumber(blockNumber)
    if (known) {
      return known
    }
    const downloaded = await this.ethereumClient.getBlock(blockNumber)
    const record: BlockRecord = {
      number: downloaded.number,
      hash: Hash256(downloaded.hash),
      timestamp: downloaded.timestamp,
    }
    await this.blockRepository.addMany([record])
    return record
  }
}
