import { chains } from '@l2beat/config'
import { type FieldDiff, diffDiscovery } from '@l2beat/discovery'
import { get$Implementations } from '@l2beat/discovery-types'
import {
  assert,
  ChainId,
  type EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getOnDiskData } from './get-on-disk-data'

export async function getProjectsChangeReport() {
  if (env.MOCK) {
    return getProjectsChangeReportMock()
  }

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
    hasHighSeverityFieldChanged: function (projectId: string) {
      const ethereumChanges = this.projects[projectId]?.ethereum
      return (
        !!ethereumChanges && ethereumChanges.fieldHighSeverityChanges.length > 0
      )
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
    fieldHighSeverityChanges: {
      address: EthereumAddress
      fields: FieldDiff[]
    }[]
  }
>

const getCachedProjectsChangeReport = cache(
  async () => {
    const result: Record<string, ProjectChangeReport> = {}

    const db = getDb()
    const onDisk = getOnDiskData()
    const newDiscoveries = await db.updateMonitor.getAll()

    for (const onDiskChain of onDisk.chains) {
      const onDiskChainProjects = onDisk.projects[onDiskChain]
      if (!onDiskChainProjects) continue
      const onDiskChainDiscovery = onDisk.discoveries[onDiskChain]
      if (!onDiskChainDiscovery) continue

      for (const project of onDiskChainProjects) {
        const onDiskDiscovery = onDiskChainDiscovery[project]
        const chainId = chainNameToId(onDiskChain)

        const newDiscovery = newDiscoveries.find(
          (d) => d.chainId === chainId && d.projectName === project,
        )

        if (!newDiscovery || !onDiskDiscovery) {
          continue
        }

        // Skip if the new discovery is older than the on-disk discovery
        if (onDiskDiscovery.blockNumber > newDiscovery.blockNumber) {
          continue
        }

        const latestContracts = newDiscovery.discovery.contracts
        const discoveryDiffs = diffDiscovery(
          onDiskDiscovery.contracts,
          latestContracts,
        )

        const implementationChanges = discoveryDiffs.filter((discoveryDiff) =>
          discoveryDiff.diff?.some(
            (f) => f.key && f.key === 'values.$implementation',
          ),
        )
        const fieldHighSeverityChanges = discoveryDiffs.filter(
          (discoveryDiff) =>
            discoveryDiff.diff?.some((f) => f.severity === 'HIGH'),
        )

        if (
          implementationChanges.length === 0 &&
          fieldHighSeverityChanges.length === 0
        ) {
          continue
        }

        result[project] ??= {}
        result[project][onDiskChain] ??= {
          implementations: [],
          fieldHighSeverityChanges: [],
        }

        for (const implementationChange of implementationChanges) {
          const diffedContract = latestContracts.find(
            (c) => c.address === implementationChange.address,
          )
          assert(diffedContract, 'diffedContract is undefined')
          const newImplementations = get$Implementations(diffedContract.values)

          result[project][onDiskChain].implementations.push({
            containingContract: implementationChange.address,
            newImplementations,
          })
        }

        for (const fieldHighSeverityChange of fieldHighSeverityChanges) {
          const fieldDiffs = fieldHighSeverityChange.diff?.filter(
            (f) => f.severity === 'HIGH',
          )
          if (!fieldDiffs) continue
          result[project][onDiskChain].fieldHighSeverityChanges.push({
            address: fieldHighSeverityChange.address,
            fields: fieldDiffs,
          })
        }
      }
    }
    return result
  },
  [`projectsChangeReport-${env.VERCEL_GIT_COMMIT_SHA}`],
  { revalidate: UnixTime.HOUR },
)

function getProjectsChangeReportMock(): ProjectsChangeReport {
  return {
    projects: {},
    hasImplementationChanged: () => false,
    hasHighSeverityFieldChanged: () => false,
  }
}

function chainNameToId(chainName: string): ChainId {
  const chain = chains.find((chain) => chain.name === chainName)
  assert(chain, `Unknown chain name: ${chainName}`)
  return ChainId(chain.chainId)
}
