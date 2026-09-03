import type { Logger } from '@l2beat/backend-tools'
import type { Database, UpdateDiffRecord } from '@l2beat/database'
import {
  type ConfigReader,
  type DiscoveryDiff,
  type DiscoveryOutput,
  diffDiscovery,
  type EntryParameters,
  entriesForDiffPair,
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
    const [previousEntries, latestEntries] = entriesForDiffPair(
      discovery,
      latestDiscovery,
    )
    const diff = diffDiscovery(previousEntries, latestEntries)

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
    const fieldHighSeverityChanges = diff.filter((discoveryDiff) =>
      discoveryDiff.diff?.some((f) => f.severity === 'HIGH'),
    )

    const upgradeChanges = diff.filter((discoveryDiff) =>
      discoveryDiff.diff?.some((f) => {
        if (!f.key.startsWith('receivedPermissions')) {
          return false
        }

        const entry = latestContracts.find(
          (e) => e.address === discoveryDiff.address,
        )
        const permissions = entry?.receivedPermissions ?? []

        // Both sides of the change, not only the latest one. An upgrader that
        // went away is named only by the value that was removed: when a holder
        // loses its last permission the latest entry is empty, and when a
        // permission is replaced the latest entry holds whatever replaced it.
        const indexString = f.key.split('.')[1]
        const latest =
          indexString === undefined
            ? permissions
            : [permissions[Number.parseInt(indexString)]]

        return (
          latest.some((p) => p?.permission === 'upgrade') ||
          namesUpgrade(f.key, f.before) ||
          namesUpgrade(f.key, f.after)
        )
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

// One side of a `receivedPermissions` field diff, as `diffContracts`
// serialised it: the whole array when the field appeared or disappeared, and
// the bare permission name when one element's `.permission` changed. Anything
// else is not a permission and cannot name an upgrade.
function namesUpgrade(key: string, serialized: string | undefined): boolean {
  if (serialized === undefined) {
    return false
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(serialized)
  } catch {
    return false
  }
  if (key.endsWith('.permission')) {
    return parsed === 'upgrade'
  }
  if (!Array.isArray(parsed)) {
    return false
  }
  return parsed.some(
    (entry) => (entry as { permission?: string }).permission === 'upgrade',
  )
}
