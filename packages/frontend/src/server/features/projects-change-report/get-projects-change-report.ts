import type { ChainConfig } from '@l2beat/config'
import type { FieldDiff } from '@l2beat/discovery'
import { diffDiscovery } from '@l2beat/discovery'
import { get$Implementations } from '@l2beat/discovery-types'
import type { EthereumAddress } from '@l2beat/shared-pure'
import { assert, ChainId, UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
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

export interface ProjectChanges {
  implementationChanged: boolean
  highSeverityFieldChanged: boolean
}

async function getProjectsChangeReportWithFns() {
  const result = await getCachedProjectsChangeReport()
  return {
    projects: result,
    getChanges: function (projectId: string): ProjectChanges {
      return {
        implementationChanged: this.hasImplementationChanged(projectId),
        highSeverityFieldChanged: this.hasHighSeverityFieldChanged(projectId),
      }
    },
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

    const chains = (await ps.getProjects({ select: ['chainConfig'] })).map(
      (p) => p.chainConfig,
    )

    for (const onDiskChain of onDisk.chains) {
      const onDiskChainProjects = onDisk.projects[onDiskChain]
      if (!onDiskChainProjects) continue
      const onDiskChainDiscovery = onDisk.discoveries[onDiskChain]
      if (!onDiskChainDiscovery) continue

      for (const project of onDiskChainProjects) {
        const onDiskDiscovery = onDiskChainDiscovery[project]
        const chainId = chainNameToId(onDiskChain, chains)

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

        const onDiskContracts = [
          ...onDiskDiscovery.contracts,
          ...(onDiskDiscovery.sharedModules ?? []).flatMap(
            (module) => onDiskChainDiscovery[module]?.contracts ?? [],
          ),
        ]
        const latestContracts = [
          ...newDiscovery.discovery.contracts,
          ...(newDiscovery.discovery.sharedModules ?? []).flatMap((module) =>
            newDiscoveries
              .filter(
                (d) =>
                  d.chainId === newDiscovery.chainId &&
                  d.discovery.name === module,
              )
              .flatMap((d) => d.discovery.contracts ?? []),
          ),
        ]
        const discoveryDiffs = diffDiscovery(onDiskContracts, latestContracts)

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
  { tags: ['hourly-data'], revalidate: UnixTime.HOUR },
)

function getProjectsChangeReportMock(): ProjectsChangeReport {
  return {
    projects: {},
    getChanges: () => ({
      implementationChanged: false,
      highSeverityFieldChanged: false,
    }),
    hasImplementationChanged: () => false,
    hasHighSeverityFieldChanged: () => false,
  }
}

function chainNameToId(chainName: string, chains: ChainConfig[]): ChainId {
  const chain = chains.find((chain) => chain.name === chainName)
  assert(chain, `Unknown chain name: ${chainName}`)
  return ChainId(chain.chainId)
}
