import { chains } from '@l2beat/config'
import { diffDiscovery } from '@l2beat/discovery'
import { get$Implementations } from '@l2beat/discovery-types'
import {
  assert,
  ChainId,
  type EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { env } from '~/env'
import { db } from '~/server/database'
import { getOnDiskData } from './get-on-disk-data'

export async function getProjectsChangeReport() {
  if (env.MOCK) {
    return getProjectsChangeReportMock()
  }
  noStore()

  return getProjectsChangeReportWithFns()
}

export type ProjectsChangeReport = Awaited<
  ReturnType<typeof getProjectsChangeReportWithFns>
>
async function getProjectsChangeReportWithFns() {
  const result = await getCachedProjectsChangeReport()
  return {
    projects: result,
    hasImplementationChanged: function (projectId: string) {
      const chainChanges = this.projects[projectId]
      if (!chainChanges) {
        return false
      }
      return Object.values(chainChanges).some(
        (c) => c.implementations.length > 0,
      )
    },
    hasImplementationChangedOnChain: function (
      projectId: string,
      chain: string,
    ) {
      const changes = this.projects[projectId]?.[chain]
      return !!changes && changes.implementations.length > 0
    },
    isAnyChangeSeverityHigh: function (projectId: string) {
      const ethereumChanges = this.projects[projectId]?.ethereum
      return !!ethereumChanges?.isAnyChangeSeverityHigh
    },
  }
}

type ProjectChangeReport = Record<
  string,
  {
    implementations: {
      containingContract: EthereumAddress
      newImplementations: EthereumAddress[]
    }[]
    isAnyChangeSeverityHigh: boolean
  }
>

const getCachedProjectsChangeReport = cache(
  async () => {
    const onDisk = getOnDiskData()
    const result: Record<string, ProjectChangeReport> = {}

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
        const isAnyChangeSeverityHigh = diffs.some((diff) =>
          diff.diff?.some((f) => f.severity === 'HIGH'),
        )

        if (implementationChanges.length === 0 && !isAnyChangeSeverityHigh) {
          continue
        }
        result[project] ??= {}
        result[project][chain] ??= {
          implementations: [],
          isAnyChangeSeverityHigh,
        }

        for (const diff of implementationChanges) {
          assert(latestContracts, 'latestContracts is undefined')
          const diffedContract = latestContracts.find(
            (c) => c.address === diff.address,
          )
          assert(diffedContract, 'diffedContract is undefined')
          const newImplementations = get$Implementations(diffedContract.values)

          result[project][chain].implementations.push({
            containingContract: diff.address,
            newImplementations,
          })
        }
      }
    }
    console.log('result', result)
    return result
  },
  [`projectsChangeReportX-${env.VERCEL_GIT_COMMIT_SHA}`],
  { revalidate: UnixTime.HOUR },
)

function getProjectsChangeReportMock(): ProjectsChangeReport {
  return {
    projects: {},
    hasImplementationChanged: () => false,
    hasImplementationChangedOnChain: () => false,
    isAnyChangeSeverityHigh: () => false,
  }
}

function chainNameToId(chainName: string): ChainId {
  const chain = chains.find((chain) => chain.name === chainName)
  assert(chain, `Unknown chain name: ${chainName}`)
  return ChainId(chain.chainId)
}
