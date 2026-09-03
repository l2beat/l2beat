import type { Logger } from '@l2beat/backend-tools'
import type { Database, UpdateDiffRecord } from '@l2beat/database'
import {
  type ConfigReader,
  type DiscoveryDiff,
  type DiscoveryOutput,
  diffDiscovery,
  type EntryParameters,
  entriesForDiffPair,
  type FieldDiff,
  type ReceivedPermission,
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
        return involvesUpgrade(f, entry?.receivedPermissions ?? [])
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

const UPGRADE = 'upgrade'

// `diffContracts` serialises a `receivedPermissions` change in one of three
// shapes, and which one it is decides where the permission name can be read:
//
//   receivedPermissions           the whole array was added or removed
//   receivedPermissions.N         one element was added or removed
//   receivedPermissions.N.field   one element was modified in place
//
// Only the third leaves the latest array safe to index. Adding or removing an
// element shifts every index after it, so reading `latest[N]` there answers a
// question about a different permission entirely.
function involvesUpgrade(f: FieldDiff, latest: ReceivedPermission[]): boolean {
  const segments = f.key.split('.')

  if (segments.length <= 2) {
    return holdsUpgrade(f.before) || holdsUpgrade(f.after)
  }

  // The element sits at the same index on both sides. When it is the
  // permission itself that changed, the latest value tells only half the
  // story: an upgrade replaced by something else is still an upgrader lost.
  if (segments[2] === 'permission') {
    return parseJson(f.before) === UPGRADE || parseJson(f.after) === UPGRADE
  }
  return latest[Number.parseInt(segments[1] ?? '')]?.permission === UPGRADE
}

// The serialised value is either the whole array or a single permission.
function holdsUpgrade(serialized: string | undefined): boolean {
  const parsed = parseJson(serialized)
  const elements = Array.isArray(parsed) ? parsed : [parsed]
  return elements.some(
    (element) =>
      (element as { permission?: string } | null | undefined)?.permission ===
      UPGRADE,
  )
}

// A value that is not JSON is not a permission, so it names no upgrade.
function parseJson(serialized: string | undefined): unknown {
  if (serialized === undefined) {
    return undefined
  }
  try {
    return JSON.parse(serialized)
  } catch {
    return undefined
  }
}
