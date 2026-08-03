import type { Logger } from '@l2beat/backend-tools'
import type { Database, UpdateDiffRecord } from '@l2beat/database'
import {
  type ConfigReader,
  type DiscoveryDiff,
  type DiscoveryOutput,
  diffDiscovery,
  type EntryParameters,
} from '@l2beat/discovery'
import type { UnixTime } from '@l2beat/shared-pure'
import type { DiscoveryOutputCache } from './DiscoveryOutputCache'

interface OnDiskDiscovery {
  project: string
  discovery: DiscoveryOutput
}

// A change at an address belongs to the project that discovered it and to every
// project referencing it, so one shared contract raises an update for all of its
// consumers. Chains need no handling of their own: every project along one
// references the same address, so all of them land here.
function referencedByIndex(
  discoveries: OnDiskDiscovery[],
): Map<string, string[]> {
  const index = new Map<string, string[]>()
  for (const { project, discovery } of discoveries) {
    for (const entry of discovery.entries) {
      if (entry.type === 'Reference') {
        index.set(entry.address, [...(index.get(entry.address) ?? []), project])
      }
    }
  }
  return index
}

export class UpdateDiffer {
  constructor(
    private readonly configReader: ConfigReader,
    private readonly db: Database,
    private readonly discoveryOutputCache: DiscoveryOutputCache,
    private readonly logger: Logger,
  ) {
    this.logger = this.logger.for(this)
  }

  async run(projects: string[], timestamp: UnixTime) {
    const onDisk = projects.map((project) => ({
      project,
      discovery: this.getOnDiskDiscovery(project),
    }))
    const referencedBy = referencedByIndex(onDisk)
    const records = onDisk.flatMap((entry) =>
      this.diffProject(entry, timestamp, referencedBy),
    )

    // Attribution writes rows for projects other than the one being diffed, so
    // every project this run could have touched is replaced in one go.
    const touched = new Set([...projects, ...records.map((r) => r.projectId)])

    await this.db.transaction(async () => {
      for (const projectId of touched) {
        await this.db.updateDiff.deleteByProjectAndChain(projectId)
      }
      await this.db.updateDiff.insertMany(records)
    })

    this.logger.info('Replaced update diffs', {
      projects: projects.length,
      updateDiffs: records.length,
    })
  }

  private diffProject(
    { project, discovery }: OnDiskDiscovery,
    timestamp: UnixTime,
    referencedBy: Map<string, string[]>,
  ): UpdateDiffRecord[] {
    const latestDiscovery = this.discoveryOutputCache.get(project)
    if (!latestDiscovery) {
      this.logger.error(
        'No latest discovery found. This should never happen.',
        { project },
      )
      return []
    }

    if (discovery.timestamp > latestDiscovery.timestamp) {
      this.logger.info(
        'On disk discovery is newer than latest discovery. Skipping.',
        { project },
      )
      return []
    }

    const diff = diffDiscovery(discovery.entries, latestDiscovery.entries)

    return this.getUpdateDiffs(
      diff,
      latestDiscovery.entries,
      project,
      timestamp,
      discovery.timestamp,
      latestDiscovery.timestamp,
    ).flatMap((record) => [
      record,
      ...(referencedBy.get(record.address) ?? []).map((projectId) => ({
        ...record,
        projectId,
      })),
    ])
  }

  getUpdateDiffs(
    diff: DiscoveryDiff[],
    latestContracts: EntryParameters[],
    projectId: string,
    timestamp: UnixTime,
    diffBaseTimestamp: number,
    diffHeadTimestamp: number,
  ) {
    const implementationChanges = diff.filter((discoveryDiff) =>
      discoveryDiff.diff?.some((f) => {
        if (f.key?.startsWith('values.$implementation')) {
          return true
        }
        if (f.key === 'values.$upgradeCount') {
          const before = Number.parseInt(f.before ?? '0')
          const after = Number.parseInt(f.after ?? '0')
          return after > before
        }
        return false
      }),
    )
    const fieldHighSeverityChanges = diff.filter((discoveryDiff) =>
      discoveryDiff.diff?.some((f) => f.severity === 'HIGH'),
    )

    const upgradeChanges = diff.filter((discoveryDiff) =>
      discoveryDiff.diff?.some((f) => {
        if (!f.key.startsWith('receivedPermissions')) {
          return false
        }

        const indexString = f.key.split('.')[1]
        if (indexString === undefined) {
          return false
        }
        const index = Number.parseInt(indexString)

        const entry = latestContracts.find(
          (e) => e.address === discoveryDiff.address,
        )

        return entry?.receivedPermissions?.[index]?.permission === 'upgrade'
      }),
    )

    const becameVerified: DiscoveryDiff[] = diff.filter((discoveryDiff) =>
      discoveryDiff.diff?.some(
        (f) =>
          f.key === 'unverified' &&
          f.after === undefined &&
          f.before === 'true',
      ),
    )

    const updateDiffs: UpdateDiffRecord[] = []

    for (const { address } of implementationChanges) {
      updateDiffs.push({
        projectId,
        type: 'implementationChange',
        address,
        timestamp,
        diffBaseTimestamp,
        diffHeadTimestamp,
      })
    }

    for (const { address } of fieldHighSeverityChanges) {
      updateDiffs.push({
        projectId,
        type: 'highSeverityFieldChange',
        address,
        timestamp,
        diffBaseTimestamp,
        diffHeadTimestamp,
      })
    }

    for (const { address } of upgradeChanges) {
      updateDiffs.push({
        projectId,
        type: 'ultimateUpgraderChange',
        address,
        timestamp,
        diffBaseTimestamp,
        diffHeadTimestamp,
      })
    }

    for (const { address } of becameVerified) {
      updateDiffs.push({
        projectId,
        type: 'becameVerified',
        address,
        timestamp,
        diffBaseTimestamp,
        diffHeadTimestamp,
      })
    }

    return updateDiffs
  }

  getOnDiskDiscovery(name: string): DiscoveryOutput {
    return this.configReader.readDiscovery(name)
  }
}
