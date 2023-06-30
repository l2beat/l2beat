import { ChainId, json } from '@l2beat/shared-pure'

import { BlockNumberRepository } from '../../peripherals/database/BlockNumberRepository'

export class BlocksController {
  constructor(private readonly blockNumberRepository: BlockNumberRepository) {}

  async getAllBlocks(): Promise<json> {
    const all = await this.blockNumberRepository.getAll(ChainId.ETHEREUM)
    return all.map((x) => ({
      blockNumber: x.blockNumber.toString(),
      timestamp: x.timestamp.toDate().toISOString(),
    }))
  }
}
