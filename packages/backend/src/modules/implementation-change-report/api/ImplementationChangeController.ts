import { ConfigReader, diffDiscovery } from '@l2beat/discovery'
import {
  assert,
  ChainConverter,
  ImplementationChangeReportApiResponse,
} from '@l2beat/shared-pure'

import { Database } from '@l2beat/database'
import { DiscoveryOutput, get$Implementations } from '@l2beat/discovery-types'

export class ImplementationChangeController {
  private readonly onDiskChains: string[] = []
  private readonly onDiskProjects: Record<string, string[]> = {}
  private readonly onDiskDiscoveries: Record<
    string,
    Record<string, DiscoveryOutput>
  > = {}

  constructor(
    private readonly db: Database,
    private readonly configReader: ConfigReader,
    private readonly chainConverter: ChainConverter,
  ) {
    this.onDiskChains = this.configReader.readAllChains()
    for (const chain of this.onDiskChains) {
      const projects = this.configReader.readAllProjectsForChain(chain)
      this.onDiskProjects[chain] = projects

      for (const project of projects) {
        const discovery = this.configReader.readDiscovery(project, chain)

        this.onDiskDiscoveries[chain] ??= {}
        this.onDiskDiscoveries[chain][project] = discovery
      }
    }
  }

  async getImplementationChangeReport(): Promise<ImplementationChangeReportApiResponse> {
    const result: ImplementationChangeReportApiResponse = {
      projects: {},
    }

    const newDiscoveries = await this.db.updateMonitor.getAll()
    for (const chain of this.onDiskChains) {
      for (const project of this.onDiskProjects[chain]) {
        const discovery = this.onDiskDiscoveries[chain][project]
        const chainId = this.chainConverter.toChainId(chain)

        const newDiscovery = newDiscoveries.find(
          (d) => d.chainId === chainId && d.projectName === project,
        )
        const latestContracts = newDiscovery?.discovery?.contracts
        const diffs = latestContracts
          ? diffDiscovery(discovery.contracts, latestContracts)
          : []
        const implementationChanges = diffs.filter((diff) =>
          diff.diff?.some((f) => f.key && f.key === 'values.$implementation'),
        )

        if (implementationChanges.length === 0) {
          continue
        }

        result.projects[project] ??= {}

        for (const diff of implementationChanges) {
          result.projects[project][chain] ??= []
          assert(latestContracts, 'latestContracts is undefined')
          const diffedContract = latestContracts.find(
            (c) => c.address === diff.address,
          )
          assert(diffedContract, 'diffedContract is undefined')
          const newImplementations = get$Implementations(diffedContract.values)

          result.projects[project][chain].push({
            containingContract: diff.address,
            newImplementations,
          })
        }
      }
    }

    return result
  }
}
