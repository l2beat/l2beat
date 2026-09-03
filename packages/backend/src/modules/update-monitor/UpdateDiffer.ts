import type { Logger } from '@l2beat/backend-tools'
import type { Database, UpdateDiffRecord } from '@l2beat/database'
import {
  type ConfigReader,
  type DiscoveryDiff,
  type DiscoveryOutput,
  diffDiscovery,
  type EntryParameters,
  entriesForDiff,
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

    // A project's rows are rebuilt only once its own comparison completed.
    // Anything else leaves them untouched, so a missing or stale cache entry
    // cannot drop a warning without producing a replacement for it.
    const completed = new Set<string>()
    const diffed: UpdateDiffRecord[] = []
    for (const entry of onDisk) {
      const records = this.diffProject(entry, timestamp, referencedBy)
      if (records === undefined) {
        continue
      }
      completed.add(entry.project)
      diffed.push(...records)
    }
    const records = diffed.filter((record) => completed.has(record.projectId))

    await this.db.transaction(async () => {
      for (const project of completed) {
        await this.db.updateDiff.deleteByProjectAndChain(project)
      }
      await this.db.updateDiff.insertMany(records)
    })

    this.logger.info('Replaced update diffs', {
      projects: completed.size,
      updateDiffs: records.length,
    })
  }

  private diffProject(
    { project, discovery }: OnDiskDiscovery,
    timestamp: UnixTime,
    referencedBy: Map<string, string[]>,
  ): UpdateDiffRecord[] | undefined {
    const latestDiscovery = this.discoveryOutputCache.get(project)
    if (!latestDiscovery) {
      this.logger.error(
        'No latest discovery found. This should never happen.',
        { project },
      )
      return undefined
    }

    if (discovery.timestamp > latestDiscovery.timestamp) {
      this.logger.info(
        'On disk discovery is newer than latest discovery. Skipping.',
        { project },
      )
      return undefined
    }

    // One join, so the diff and the grading below index the same entries.
    const latestEntries = entriesForDiff(latestDiscovery)
    const diff = diffDiscovery(entriesForDiff(discovery), latestEntries)

    return this.getUpdateDiffs(
      diff,
      latestEntries,
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
    // MEDIUM counts here on purpose: it puts the project under review on the
    // frontend without resetting the ossification clock (that stays HIGH-only).
    const fieldHighSeverityChanges = diff.filter((discoveryDiff) =>
      discoveryDiff.diff?.some(
        (f) => f.severity === 'HIGH' || f.severity === 'MEDIUM',
      ),
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
