import { ConfigReader, diffDiscovery, DiscoveryDiff } from '@l2beat/discovery'
import { DiffHistoryApiResponse, DiscoveryHistory } from '@l2beat/shared-pure'

import { ChainConverter } from '../../../core/ChainConverter'
import { DiscoveryHistoryRepository } from '../../../peripherals/database/discovery/DiscoveryHistoryRepository'

export class DiffHistoryController {
  constructor(
    private readonly discoveryHistoryRepository: DiscoveryHistoryRepository,
    private readonly configReader: ConfigReader,
    private readonly chainConverter: ChainConverter,
  ) {}

  async getRaw(chain: string, project: string): Promise<DiscoveryHistory> {
    const discoveries = await this.discoveryHistoryRepository.getProject(
      project,
      this.chainConverter.toChainId(chain),
    )
    return {
      project: project,
      discoveries: discoveries.map((x) => ({
        timestamp: x.timestamp,
        blockNumber: x.blockNumber,
        discovery: JSON.stringify(x.discovery),
      })),
    }
  }

  async getDiffHistoryPerProject(
    chain: string,
    project: string,
  ): Promise<DiffHistoryApiResponse> {
    const discoveries = await this.discoveryHistoryRepository.getProject(
      project,
      this.chainConverter.toChainId(chain),
    )

    const diffs: Record<number, DiscoveryDiff[]> = {}
    const config = await this.configReader.readConfig(project, chain)
    for (let i = 0; i < discoveries.length - 1; i++) {
      diffs[discoveries[i + 1].timestamp.toNumber()] = diffDiscovery(
        discoveries[i].discovery.contracts,
        discoveries[i + 1].discovery.contracts,
        config,
      )
    }

    const result: DiffHistoryApiResponse = [
      {
        project: project,
        changes: Object.entries(diffs)
          .filter(([_, z]) => z.length > 0)
          .map(([timestamp, diffs]) => ({
            timestamp: timestamp,
            diffs: diffs,
          })),
      },
    ]

    return result
  }

  async getAllDiffHistories(): Promise<DiffHistoryApiResponse> {
    const projects =
      await this.discoveryHistoryRepository.getAvailableProjects()

    const discoveries = await Promise.all(
      projects.map(async (p) => {
        return await this.getDiffHistoryPerProject(
          this.chainConverter.toName(p.chainId),
          p.projectName,
        )
      }),
    )

    return discoveries.flatMap((x) => x)
  }
}
