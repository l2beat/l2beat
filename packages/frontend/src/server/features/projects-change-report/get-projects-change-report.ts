import type { ChainConfig } from '@l2beat/config'
import {
  type ContractValue,
  type EntryParameters,
  diffDiscovery,
} from '@l2beat/discovery'
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
  impactfulChange: boolean
}

async function getProjectsChangeReportWithFns() {
  const result = await getCachedProjectsChangeReport()
  return {
    projects: result,
    getChanges: function (projectId: string): ProjectChanges {
      return {
        impactfulChange:
          this.hasImplementationChanged(projectId) ||
          this.hasHighSeverityFieldChanged(projectId) ||
          this.hasUpgradeChange(projectId),
      }
    },
    hasImplementationChanged: function (projectId: string) {
      const chainChanges = this.projects[projectId]
      if (!chainChanges) {
        return false
      }
      return Object.values(chainChanges).some(
        (c) => c.implementationContaining.length > 0,
      )
    },
    hasHighSeverityFieldChanged: function (projectId: string) {
      const ethereumChanges = this.projects[projectId]?.ethereum
      return (
        !!ethereumChanges &&
        ethereumChanges.fieldHighSeverityContaining.length > 0
      )
    },
    hasUpgradeChange: function (projectId: string) {
      const ethereumChanges = this.projects[projectId]?.ethereum
      return !!ethereumChanges && ethereumChanges.upgradeChanges.length > 0
    },
  }
}

type ProjectChangeReport = Record<
  string,
  {
    implementationContaining: EthereumAddress[]
    fieldHighSeverityContaining: EthereumAddress[]
    upgradeChanges: EthereumAddress[]
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
          ..._TEMP_getEntries(onDiskDiscovery),
          ...(onDiskDiscovery.sharedModules ?? []).flatMap((module) =>
            _TEMP_getEntries(onDiskChainDiscovery[module]),
          ),
        ]
        const latestContracts = [
          ..._TEMP_getEntries(newDiscovery.discovery),
          ...(newDiscovery.discovery.sharedModules ?? []).flatMap((module) =>
            newDiscoveries
              .filter(
                (d) =>
                  d.chainId === newDiscovery.chainId &&
                  d.discovery.name === module,
              )
              .flatMap((d) => _TEMP_getEntries(d.discovery)),
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

        const upgradeChanges = discoveryDiffs.filter((discoveryDiff) =>
          discoveryDiff.diff?.some((f) => {
            if (!f.key.startsWith('issuedPermissions')) {
              return false
            }

            const indexString = f.key.split('.')[1]
            if (indexString === undefined) {
              return false
            }
            const index = parseInt(indexString)

            const entry = latestContracts.find(
              (e) => e.address === discoveryDiff.address,
            )

            return entry?.issuedPermissions?.[index]?.permission === 'upgrade'
          }),
        )

        if (
          implementationChanges.length === 0 &&
          fieldHighSeverityChanges.length === 0 &&
          upgradeChanges.length === 0
        ) {
          continue
        }

        result[project] ??= {}
        result[project][onDiskChain] ??= {
          implementationContaining: [],
          fieldHighSeverityContaining: [],
          upgradeChanges: [],
        }

        for (const implementationChange of implementationChanges) {
          const diffedContract = latestContracts.find(
            (c) => c.address === implementationChange.address,
          )
          assert(diffedContract, 'diffedContract is undefined')

          result[project][onDiskChain].implementationContaining.push(
            implementationChange.address,
          )
        }

        for (const fieldHighSeverityChange of fieldHighSeverityChanges) {
          const fieldDiffs = fieldHighSeverityChange.diff?.filter(
            (f) => f.severity === 'HIGH',
          )
          if (!fieldDiffs) continue
          result[project][onDiskChain].fieldHighSeverityContaining.push(
            fieldHighSeverityChange.address,
          )
        }

        for (const upgradeChange of upgradeChanges) {
          result[project][onDiskChain].upgradeChanges.push(
            upgradeChange.address,
          )
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
      impactfulChange: false,
    }),
    hasImplementationChanged: () => false,
    hasHighSeverityFieldChanged: () => false,
    hasUpgradeChange: () => false,
  }
}

function chainNameToId(chainName: string, chains: ChainConfig[]): ChainId {
  const chain = chains.find((chain) => chain.name === chainName)
  assert(chain, `Unknown chain name: ${chainName}`)
  assert(chain.chainId, `Missing chainId for chain: ${chainName}`)
  return ChainId(chain.chainId)
}

export function toAddressArray(value: ContractValue | undefined) {
  if (typeof value === 'string') {
    return [value as unknown as EthereumAddress]
  }
  if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
    return value.map((v) => v as unknown as EthereumAddress)
  }
  return []
}

// TODO: REMOVE THIS CODE ON 2025-03-11
function _TEMP_getEntries(
  value: { entries: EntryParameters[] } | undefined,
): EntryParameters[] {
  if (value === undefined) {
    return []
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return Reflect.get(value, 'contracts') ?? value.entries
}
