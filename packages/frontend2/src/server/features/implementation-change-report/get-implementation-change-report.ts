import path from 'path'
import { chains } from '@l2beat/config'
import { ConfigReader, diffDiscovery } from '@l2beat/discovery'
import { type DiscoveryOutput } from '@l2beat/discovery-types'
import {
  assert,
  ChainId,
  type ImplementationChangeReportApiResponse,
} from '@l2beat/shared-pure'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { env } from '~/env'
import { db } from '~/server/database'

export function getImplementationChangeReport() {
  noStore()
  return getCachedImplementationChangeReport()
}

const getCachedImplementationChangeReport = cache(
  async () => {
    const configReader = new ConfigReader(
      path.join(process.cwd(), '../backend'),
    )
    const onDiskChains = configReader.readAllChains()
    const onDiskProjects: Record<string, string[]> = {}
    const onDiskDiscoveries: Record<
      string,
      Record<string, DiscoveryOutput>
    > = {}

    for (const chain of onDiskChains) {
      const projects = configReader.readAllProjectsForChain(chain)
      onDiskProjects[chain] = projects

      for (const project of projects) {
        const discovery = configReader.readDiscovery(project, chain)

        let onDiskDiscovery = onDiskDiscoveries[chain]
        if (!onDiskDiscovery) {
          onDiskDiscovery = {}
        }
        onDiskDiscovery[project] = discovery
        onDiskDiscoveries[chain] = onDiskDiscovery
      }
    }

    const result: ImplementationChangeReportApiResponse = {
      projects: {},
    }

    for (const chainName of onDiskChains) {
      const chainProjects = onDiskProjects[chainName]
      if (!chainProjects) continue
      for (const project of chainProjects) {
        const chainDiscovery = onDiskDiscoveries[chainName]
        if (!chainDiscovery) continue

        const discovery = chainDiscovery[project]
        const chainId = chainNameToId(chainName)
        const newDiscovery = await db.updateMonitor.findLatest(project, chainId)

        const latestContracts = newDiscovery?.discovery?.contracts
        const diffs =
          latestContracts && discovery
            ? diffDiscovery(discovery.contracts, latestContracts)
            : []
        const implementationChanges = diffs.filter((diff) =>
          diff.diff?.some((f) => f.key?.startsWith('implementation')),
        )

        if (implementationChanges.length === 0) {
          continue
        }

        result.projects[project] ??= {}
        const projectRecord = result.projects[project]!
        projectRecord[chainName] ??= []
        const chainRecord = projectRecord[chainName]!

        for (const diff of implementationChanges) {
          assert(latestContracts, 'latestContracts is undefined')
          const diffedContract = latestContracts.find(
            (c) => c.address === diff.address,
          )
          assert(diffedContract, 'diffedContract is undefined')
          const newImplementations = diffedContract.implementations ?? []

          chainRecord.push({
            containingContract: diff.address,
            newImplementations,
          })
        }
      }
    }

    return result
  },
  ['implementationChangeReport', env.VERCEL_GIT_COMMIT_SHA],
  { revalidate: 60 * 60 },
)

function chainNameToId(chainName: string): ChainId {
  const chain = chains.find((chain) => chain.name === chainName)
  assert(chain, `Unknown chain name: ${chainName}`)
  return ChainId(chain.chainId)
}
