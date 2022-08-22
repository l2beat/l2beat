import { json } from '@l2beat/types'

import { BlockNumberRepository } from '../../peripherals/database/BlockNumberRepository'

export class BlocksController {
  constructor(private blockNumberRepository: BlockNumberRepository) {}

  async getAllBlocks(): Promise<json> {
    const all = await this.blockNumberRepository.getAll()
    return all.map((x) => ({
      blockNumber: x.blockNumber.toString(),
      timestamp: x.timestamp.toDate().toISOString(),
    }))
  }
}
