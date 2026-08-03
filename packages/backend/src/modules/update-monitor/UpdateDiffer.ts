import type { Logger } from '@l2beat/backend-tools'
import type { Database, UpdateDiffRecord } from '@l2beat/database'
import {
  type ConfigReader,
  type DiscoveryDiff,
  type DiscoveryOutput,
  diffDiscovery,
  type EntryParameters,
} from '@l2beat/discovery'
import { notUndefined, type UnixTime } from '@l2beat/shared-pure'
import uniq from 'lodash/uniq'
import type { DiscoveryOutputCache } from './DiscoveryOutputCache'

function discoveredEntries(
  discovery: DiscoveryOutput | undefined,
): EntryParameters[] {
  return (discovery?.entries ?? []).filter(
    (entry) => entry.type !== 'Reference',
  )
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

  async runForProject(projectId: string, timestamp: UnixTime) {
    const onDiskDiscovery = this.getOnDiskDiscovery(projectId)
    const latestDiscovery = this.discoveryOutputCache.get(projectId)
    if (!latestDiscovery) {
      this.logger.error(
        'No latest discovery found. This should never happen.',
        { projectId },
      )
      return
    }

    if (onDiskDiscovery.timestamp > latestDiscovery.timestamp) {
      this.logger.info(
        'On disk discovery is newer than latest discovery. Skipping.',
        { projectId },
      )
      return
    }

    // A reference is an immutable stub, so a change inside the project that
    // owns it would otherwise be invisible here. The owner's real entries are
    // folded into both sides so that consumers report the change as their own.
    // Stubs are dropped because they carry the very address they stand for and
    // diffDiscovery matches on the first entry with a given address.
    const referenced = this.getReferencedProjects(
      onDiskDiscovery,
      latestDiscovery,
    )

    const onDiskContracts = [
      ...discoveredEntries(onDiskDiscovery),
      ...referenced.flatMap((project) =>
        discoveredEntries(this.tryGetOnDiskDiscovery(project)),
      ),
    ]

    // Projects are discovered concurrently in a shuffled order, so a referenced
    // project may not have run yet. Falling back to its on-disk state keeps both
    // sides equal instead of reporting every entry of it as deleted, and the
    // next update picks the change up.
    const latestContracts = [
      ...discoveredEntries(latestDiscovery),
      ...referenced.flatMap((project) =>
        discoveredEntries(
          this.discoveryOutputCache.get(project) ??
            this.tryGetOnDiskDiscovery(project),
        ),
      ),
    ]

    const diff = diffDiscovery(onDiskContracts, latestContracts)
    const diffBaseTimestamp = onDiskDiscovery.timestamp
    const diffHeadTimestamp = latestDiscovery.timestamp

    const updateDiffs = this.getUpdateDiffs(
      diff,
      latestContracts,
      projectId,
      timestamp,
      diffBaseTimestamp,
      diffHeadTimestamp,
    )

    if (updateDiffs.length === 0) {
      this.logger.info('No changes in project', {
        projectId,
      })
      await this.db.updateDiff.deleteByProjectAndChain(projectId)
      return
    }

    await this.db.transaction(async () => {
      await this.db.updateDiff.deleteByProjectAndChain(projectId)
      await this.db.updateDiff.insertMany(updateDiffs)

      this.logger.info('Inserted update diffs', {
        projectId,
        updateDiffs: updateDiffs.length,
      })
    })
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

  getReferencedProjects(...discoveries: DiscoveryOutput[]): string[] {
    return uniq(
      discoveries.flatMap((discovery) =>
        discovery.entries
          .filter((entry) => entry.type === 'Reference')
          .map((entry) => entry.targetProject)
          .filter(notUndefined),
      ),
    )
  }

  tryGetOnDiskDiscovery(name: string): DiscoveryOutput | undefined {
    try {
      return this.getOnDiskDiscovery(name)
    } catch (error) {
      this.logger.error('Cannot read discovery of a referenced project', {
        project: name,
        error,
      })
      return undefined
    }
  }
}
