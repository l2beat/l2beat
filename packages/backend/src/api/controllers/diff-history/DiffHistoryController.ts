import { ConfigReader, diffDiscovery, DiscoveryDiff } from '@l2beat/discovery'
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

    const diffs: Record<number, DiscoveryDiff[]> = {}
    const configReader = new ConfigReader()
    const config = await configReader.readConfig(project, chainId)
    for (let i = 0; i < discoveries.length - 1; i++) {
      diffs[discoveries[i + 1].timestamp.toNumber()] = diffDiscovery(
        discoveries[i].discovery.contracts,
        discoveries[i + 1].discovery.contracts,
        config,
      )
    }

    const result = Object.fromEntries(
      Object.entries(diffs).filter(([_, z]) => z.length > 0),
    )

    return JSON.stringify(result)
  }
}
