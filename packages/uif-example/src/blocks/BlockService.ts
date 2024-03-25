import { setTimeout } from 'timers/promises'

export class BlockService {
  async getBlockNumberBefore(timestamp: number): Promise<number> {
    await setTimeout(200)
    return Math.floor(timestamp / 123456)
  }
}
