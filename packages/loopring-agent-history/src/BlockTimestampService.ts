import { providers } from 'ethers'

export class BlockTimestampService {
  constructor(private readonly provider: providers.Provider) {}

  async getBlockTimestamp(block: number) {
    const { timestamp } = await this.provider.getBlock(block)
    return timestamp
  }
}
