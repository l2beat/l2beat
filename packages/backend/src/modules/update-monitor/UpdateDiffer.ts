import type { Logger } from '@l2beat/backend-tools'
import type { Database, UpdateDiffRecord } from '@l2beat/database'
import { type ConfigReader, diffDiscovery } from '@l2beat/discovery'
import type {
  DiscoveryDiff,
  DiscoveryOutput,
  EntryParameters,
} from '@l2beat/discovery'
import { assert, type UnixTime } from '@l2beat/shared-pure'
import type { DiscoveryOutputCache } from './DiscoveryOutputCache'

export class UpdateDiffer {
  constructor(
    private readonly configReader: ConfigReader,
    private readonly db: Database,
    private readonly discoveryOutputCache: DiscoveryOutputCache,
    private readonly logger: Logger,
  ) {
    this.logger = this.logger.for(this)
  }

  async runForChain(chain: string, timestamp: UnixTime) {
    const projectConfigs = this.configReader.readAllConfigsForChain(chain)

    for (const projectConfig of projectConfigs) {
      assert(
        projectConfig.chain === chain,
        `Discovery runner and project config chain mismatch in project ${projectConfig.name}. Update the config.json file or config.discovery.`,
      )

      try {
        await this.runForProject(projectConfig.name, chain, timestamp)
      } catch (error) {
        this.logger.error(
          `[chain: ${chain}] Failed to update project [${projectConfig.name}]`,
          error,
        )
      }
    }
  }

  async runForProject(projectId: string, chain: string, timestamp: UnixTime) {
    const onDiskDiscovery = this.getOnDiskDiscovery({
      name: projectId,
      chain,
    })
    const latestDiscovery = this.discoveryOutputCache.get(projectId, chain)
    if (!latestDiscovery) {
      this.logger.error(
        'No latest discovery found. This should never happen.',
        {
          projectId,
          chain,
        },
      )
      return
    }

    if (onDiskDiscovery.blockNumber > latestDiscovery.blockNumber) {
      this.logger.info(
        'On disk discovery is newer than latest discovery. Skipping.',
        {
          projectId,
          chain,
        },
      )
      return
    }

    const onDiskContracts = [
      ...onDiskDiscovery.entries,
      ...(onDiskDiscovery.sharedModules ?? []).flatMap(
        (module) =>
          this.getOnDiskDiscovery({
            name: module,
            chain,
          }).entries,
      ),
    ]

    const latestContracts = [
      ...latestDiscovery.entries,
      ...(latestDiscovery.sharedModules ?? []).flatMap(
        (module) => this.discoveryOutputCache.get(module, chain)?.entries ?? [],
      ),
    ]

    const diff = diffDiscovery(onDiskContracts, latestContracts)

    const updateDiffs = this.getUpdateDiffs(
      diff,
      latestContracts,
      projectId,
      chain,
      timestamp,
    )

    if (updateDiffs.length === 0) {
      this.logger.info('No changes in project', {
        projectId,
        chain,
      })
      await this.db.updateDiff.deleteByProjectAndChain(projectId, chain)
      return
    }

    await this.db.transaction(async () => {
      await this.db.updateDiff.deleteByProjectAndChain(projectId, chain)
      await this.db.updateDiff.insertMany(updateDiffs)

      this.logger.info('Inserted update diffs', {
        projectId,
        chain,
        updateDiffs: updateDiffs.length,
      })
    })
  }

  getUpdateDiffs(
    diff: DiscoveryDiff[],
    latestContracts: EntryParameters[],
    projectId: string,
    chain: string,
    timestamp: UnixTime,
  ) {
    const implementationChanges = diff.filter((discoveryDiff) =>
      discoveryDiff.diff?.some(
        (f) => f.key && f.key === 'values.$implementation',
      ),
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
        const index = parseInt(indexString)

        const entry = latestContracts.find(
          (e) => e.address === discoveryDiff.address,
        )

        return entry?.receivedPermissions?.[index]?.permission === 'upgrade'
      }),
    )

    const verificationChanges: DiscoveryDiff[] = diff.filter((discoveryDiff) =>
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
        address: address,
        chain,
        timestamp,
      })
    }

    for (const { address } of fieldHighSeverityChanges) {
      updateDiffs.push({
        projectId,
        type: 'highSeverityFieldChange',
        address: address,
        chain,
        timestamp,
      })
    }

    for (const { address } of upgradeChanges) {
      updateDiffs.push({
        projectId,
        type: 'ultimateUpgraderChange',
        address: address,
        chain,
        timestamp,
      })
    }

    for (const { address } of verificationChanges) {
      updateDiffs.push({
        projectId,
        type: 'verificationChange',
        address,
        chain,
        timestamp,
      })
    }

    return updateDiffs
  }

  getOnDiskDiscovery({
    name,
    chain,
  }: { name: string; chain: string }): DiscoveryOutput {
    return this.configReader.readDiscovery(name, chain)
  }
}
