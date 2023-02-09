import { json } from '@l2beat/shared'

import { BlockNumberRepository } from '../../peripherals/database/BlockNumberRepository'

export class BlocksController {
  constructor(private readonly blockNumberRepository: BlockNumberRepository) {}

  async getAllBlocks(): Promise<json> {
    const all = await this.blockNumberRepository.getAll()
    return all.map((x) => ({
      blockNumber: x.blockNumber.toString(),
      timestamp: x.timestamp.toDate().toISOString(),
    }))
  }
}
