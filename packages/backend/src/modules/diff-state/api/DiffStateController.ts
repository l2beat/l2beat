import { ConfigReader, diffDiscovery } from '@l2beat/discovery'
import { assert, DiffStateApiResponse } from '@l2beat/shared-pure'

import { ChainConverter } from '../../../tools/ChainConverter'
import { UpdateMonitorRepository } from '../../update-monitor/repositories/UpdateMonitorRepository'

export class DiffStateController {
  constructor(
    private readonly updateMonitorRepository: UpdateMonitorRepository,
    private readonly configReader: ConfigReader,
    private readonly chainConverter: ChainConverter,
  ) {}

  async getDiffState(): Promise<DiffStateApiResponse> {
    const result: DiffStateApiResponse = {
      projects: {},
    }

    const chains = this.configReader.readAllChains()
    for (const chain of chains) {
      const projects = this.configReader.readAllProjectsForChain(chain)
      for (const project of projects) {
        const config = await this.configReader.readConfig(project, chain)
        const discovery = await this.configReader.readDiscovery(project, chain)
        const chainId = this.chainConverter.toChainId(chain)
        const newDiscovery = await this.updateMonitorRepository.findLatest(
          config.name,
          chainId,
        )

        const latestContracts = newDiscovery?.discovery?.contracts
        const diffs = latestContracts
          ? diffDiscovery(discovery.contracts, latestContracts, config)
          : []
        const implementationChanges = diffs.filter((diff) =>
          diff.diff?.some((f) => f.key && f.key.startsWith('implementation')),
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
          const newImlementations = diffedContract.implementations ?? []

          result.projects[project][chain].push({
            containingContract: diff.address,
            newImlementations,
          })
        }
      }
    }

    return result
  }
}
