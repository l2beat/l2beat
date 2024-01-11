import { ChainId } from '@l2beat/shared-pure'

import { DiscoveryHistoryRepository } from '../../../peripherals/database/discovery/DiscoveryHistoryRepository'

export class DiffHistoryController {
  constructor(
    private readonly discoveryHistoryRepository: DiscoveryHistoryRepository,
  ) {}

  async getRaw(chainId: ChainId, project: string): Promise<string> {
    const discoveries = await this.discoveryHistoryRepository.getProject(
      project,
      chainId,
    )
    return JSON.stringify(discoveries)
  }

  async getDiff(chainId: ChainId, project: string): Promise<string> {
    const discoveries = await this.discoveryHistoryRepository.getProject(
      project,
      chainId,
    )
    return JSON.stringify(discoveries)
  }
}
