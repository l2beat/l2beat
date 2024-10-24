import { resolvedChains } from '@l2beat/config/projects'
import { diffDiscovery } from '@l2beat/discovery'
import { get$Implementations } from '@l2beat/discovery-types'
import {
  assert,
  ChainId,
  type ImplementationChangeReportApiResponse,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { env } from '~/env'
import { db } from '~/server/database'
import { getOnDiskData } from './get-on-disk-data'

export function getImplementationChangeReport() {
  if (env.MOCK) {
    return getImplementationChangeReportMock()
  }
  noStore()
  return getCachedImplementationChangeReport()
}

export type ImplementationChangeReport = Awaited<
  ReturnType<typeof getCachedImplementationChangeReport>
>
const getCachedImplementationChangeReport = cache(
  async () => {
    const onDisk = getOnDiskData()
    const result: ImplementationChangeReportApiResponse = {
      projects: {},
    }

    const newDiscoveries = await db.updateMonitor.getAll()
    for (const chain of onDisk.chains) {
      const chainProjects = onDisk.projects[chain]
      if (!chainProjects) continue
      const chainDiscovery = onDisk.discoveries[chain]
      if (!chainDiscovery) continue

      for (const project of chainProjects) {
        const discovery = chainDiscovery[project]
        const chainId = chainNameToId(chain)

        const newDiscovery = newDiscoveries.find(
          (d) => d.chainId === chainId && d.projectName === project,
        )
        const latestContracts = newDiscovery?.discovery?.contracts
        const diffs =
          discovery && latestContracts
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
  },
  [`implementationChangeReport-${env.VERCEL_GIT_COMMIT_SHA}`],
  { revalidate: UnixTime.HOUR },
)

function getImplementationChangeReportMock(): ImplementationChangeReport {
  return { projects: {} }
}

function chainNameToId(chainName: string): ChainId {
  const chain = resolvedChains.find((chain) => chain.name === chainName)
  assert(chain, `Unknown chain name: ${chainName}`)
  return ChainId(chain.chainId)
}
