import { Logger } from '../../tools/Logger'
import { SimpleDate } from '../model'
import { AlchemyApi } from './api/AlchemyApi'
import { EtherscanApi } from './api/EtherscanApi'
import { AsyncCache } from './AsyncCache'

export class BlockInfo {
  constructor(
    private alchemyApi: AlchemyApi,
    private etherscanApi: EtherscanApi,
    private asyncCache: AsyncCache,
    private logger: Logger
  ) {}

  async getMaxBlock(date: SimpleDate) {
    return this.asyncCache.getOrFetch(`getMaxBlock,${date}`, () =>
      this._getMaxBlock(date)
    )
  }

  private async _getMaxBlock(date: SimpleDate) {
    const timestamp = date.addDays(1).toUnixTimestamp()
    const block = await this.etherscanApi.getLastBlockBefore(timestamp)
    this.logger.info(`fetched max block for ${date}`)
    return block
  }

  async getBlockDate(block: number) {
    return this.asyncCache.getOrFetch(
      `getBlockDate,${block}`,
      () => this._getBlockDate(block),
      (date) => date.toString(),
      (json) => SimpleDate.fromString(json)
    )
  }

  private async _getBlockDate(block: number) {
    const { timestamp } = await this.alchemyApi.getBlock(block)
    this.logger.info(`fetched block date for ${block}`)
    return SimpleDate.fromUnixTimestamp(timestamp)
  }
}
