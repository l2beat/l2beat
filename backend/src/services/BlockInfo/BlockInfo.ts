import { providers } from 'ethers'
import { AsyncCache } from '../AsyncCache'
import { AsyncQueue } from '../AsyncQueue'
import { Logger } from '../Logger'
import { SimpleDate } from '../SimpleDate'
import fetch from 'node-fetch'
import { IBlockInfo } from './IBlockInfo'

export class BlockInfo implements IBlockInfo {
  private dateQueue = new AsyncQueue({ length: 1, rateLimitPerMinute: 200 })
  private ethersQueue = new AsyncQueue({ length: 1 })

  constructor(
    private etherscanApiKey: string,
    private provider: providers.Provider,
    private asyncCache: AsyncCache,
    private logger: Logger
  ) {}

  async getMaxBlock(date: SimpleDate) {
    return this.asyncCache.getOrFetch(['getMaxBlock', date], () =>
      this._getMaxBlock(date)
    )
  }

  private async _getMaxBlock(date: SimpleDate) {
    const url =
      'https://api.etherscan.io/api?module=block&action=getblocknobytime&closest=before'
    const timestamp = date.addDays(1).toUnixTimestamp()
    const block = await this.dateQueue.enqueue(() =>
      fetch(`${url}&timestamp=${timestamp}&apikey=${this.etherscanApiKey}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(res.statusText)
          }
          return res.json()
        })
        .then((data) => parseInt(data.result))
    )
    this.logger.log(`fetched max block for ${date}`)
    return block
  }

  async getBlockDate(block: number) {
    return this.asyncCache.getOrFetch(
      ['getBlockDate', block],
      () => this._getBlockDate(block),
      (date) => date.toString(),
      (json) => SimpleDate.fromString(json)
    )
  }

  private async _getBlockDate(block: number) {
    const { timestamp } = await this.ethersQueue.enqueue(() =>
      this.provider.getBlock(block)
    )
    this.logger.log(`fetched block date for ${block}`)
    return SimpleDate.fromUnixTimestamp(timestamp)
  }
}
