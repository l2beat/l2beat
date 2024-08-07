import path from 'path'
import { chains } from '@l2beat/config'
import { ConfigReader, diffDiscovery } from '@l2beat/discovery'
import {
  type DiscoveryOutput,
  get$Implementations,
} from '@l2beat/discovery-types'
import {
  assert,
  ChainId,
  type ImplementationChangeReportApiResponse,
} from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { unstable_noStore as noStore } from 'next/cache'
import { db } from '~/server/database'

export function getImplementationChangeReport() {
  noStore()
  return getCachedImplementationChangeReport()
}

export type ImplementationChangeReport = Awaited<
  ReturnType<typeof getCachedImplementationChangeReport>
>

const getCachedImplementationChangeReport = async () => {
  console.clear()
  console.log('===============================')
  console.time('getCachedImplementationChangeReport')

  const configReader = new ConfigReader(path.join(process.cwd(), '../backend'))
  const onDiskChains = configReader.readAllChains()
  const onDiskProjects: Record<string, string[]> = {}
  const onDiskDiscoveries: Record<string, Record<string, DiscoveryOutput>> = {}

  console.time('process chains and projects')
  for (const chain of onDiskChains) {
    const projects = configReader.readAllProjectsForChain(chain)
    onDiskProjects[chain] = projects

    for (const project of projects) {
      const discovery = configReader.readDiscovery(project, chain)
      const onDiskDiscovery = onDiskDiscoveries[chain] ?? {}
      onDiskDiscovery[project] = discovery
      onDiskDiscoveries[chain] = onDiskDiscovery
    }
  }
  console.timeEnd('process chains and projects')

  const result: ImplementationChangeReportApiResponse = {
    projects: {},
  }

  console.time('process implementation changes')

  for (const chainName of onDiskChains) {
    const chainProjects = onDiskProjects[chainName]
    if (!chainProjects) continue
    const chainDiscovery = onDiskDiscoveries[chainName]
    if (!chainDiscovery) continue

    const chainId = chainNameToId(chainName)
    const latestDiscoveries =
      await db.updateMonitor.getLatestByProjectNamesAndChain(
        chainProjects,
        chainId,
      )
    const latestDiscoveriesGroupedByChain = groupBy(
      latestDiscoveries,
      (d) => d.chainId,
    )
    const latestDiscoveriesMap = Object.fromEntries(
      Object.entries(latestDiscoveriesGroupedByChain).map(
        ([chainId, discoveries]) => [
          chainId,
          Object.fromEntries(discoveries.map((d) => [d.projectName, d])),
        ],
      ),
    )

    for (const project of chainProjects) {
      const discovery = chainDiscovery[project]
      const newDiscovery = latestDiscoveriesMap[chainId.toString()]?.[project]

      const latestContracts = newDiscovery?.discovery?.contracts
      const diffs =
        latestContracts && discovery
          ? diffDiscovery(discovery.contracts, latestContracts)
          : []
      const implementationChanges = diffs.filter((diff) =>
        diff.diff?.some((f) => f.key === 'values.$implementation'),
      )

      if (implementationChanges.length === 0) {
        continue
      }

      result.projects[project] ??= {}
      const projectRecord = result.projects[project]
      projectRecord[chainName] ??= []
      const chainRecord = projectRecord[chainName]

      for (const diff of implementationChanges) {
        assert(latestContracts, 'latestContracts is undefined')
        const diffedContract = latestContracts.find(
          (c) => c.address === diff.address,
        )
        assert(diffedContract, 'diffedContract is undefined')
        const newImplementations = get$Implementations(diffedContract.values)

        chainRecord.push({
          containingContract: diff.address,
          newImplementations,
        })
      }
    }
  }
  console.timeEnd('process implementation changes')

  console.timeEnd('getCachedImplementationChangeReport')
  return result
}

function chainNameToId(chainName: string): ChainId {
  const chain = chains.find((chain) => chain.name === chainName)
  assert(chain, `Unknown chain name: ${chainName}`)
  return ChainId(chain.chainId)
}
