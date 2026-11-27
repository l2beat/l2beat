import type {
  EVMBlockWithTransactions,
  IRpcClient,
  LogsTopicFilter,
} from '@l2beat/shared'
import { assert, type Log } from '@l2beat/shared-pure'
import range from 'lodash/range'
import type { Header, HeadSource } from './ChainHeadIndexer'

export class RpcHeadSource implements HeadSource {
  constructor(private readonly rpc: IRpcClient) {}

  getLatestBlockNumber(): Promise<number> {
    return this.rpc.getLatestBlockNumber()
  }

  async getBlocks(
    from: number,
    to: number,
  ): Promise<EVMBlockWithTransactions[]> {
    return await Promise.all(
      range(from, to + 1).map(async (number) => {
        const block = await this.rpc.getBlockWithTransactions(number)
        assert(block.number === number, 'Invalid block number in response', {
          expected: number,
          actual: block.number,
        })
        return block
      }),
    )
  }

  async getHeaders(from: number, to: number): Promise<Header[]> {
    return await Promise.all(
      range(from, to + 1).map(async (number) => {
        const block = await this.rpc.getBlock(number, false)
        assert(block.number === number, 'Invalid block number in response', {
          expected: number,
          actual: block.number,
        })
        return block
      }),
    )
  }

  async getBlockHash(number: number): Promise<string> {
    return (await this.rpc.getBlock(number, false)).hash
  }

  getLogs(
    blockHash: string,
    addresses: string[],
    topics: LogsTopicFilter,
  ): Promise<Log[]> {
    return this.rpc.getLogsByBlockHash(blockHash, addresses, topics)
  }

  getLogsInRange(
    from: number,
    to: number,
    addresses: string[],
    topics: LogsTopicFilter,
  ): Promise<Log[]> {
    return this.rpc.getLogs(from, to, addresses, topics)
  }
}
