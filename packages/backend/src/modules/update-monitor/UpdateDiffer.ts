import type { Logger } from '@l2beat/backend-tools'
import type { Database, UpdateDiffRecord } from '@l2beat/database'
import { type ConfigReader, diffDiscovery } from '@l2beat/discovery'
import type { DiscoveryDiff, DiscoveryOutput } from '@l2beat/discovery'
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

  async runForProject(projectName: string, chain: string, timestamp: UnixTime) {
    const onDiskDiscovery = this.getOnDiskDiscovery({
      name: projectName,
      chain,
    })
    const latestDiscovery = this.discoveryOutputCache.get(projectName, chain)
    if (!latestDiscovery) {
      this.logger.error(
        'No latest discovery found. This should never happen.',
        {
          projectName,
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
      latestDiscovery,
      projectName,
      chain,
      timestamp,
    )

    if (updateDiffs.length === 0) {
      this.logger.info('No changes in project', {
        projectName,
        chain,
      })
      await this.db.updateDiff.deleteByProjectAndChain(projectName, chain)
      return
    }

    await this.db.transaction(async () => {
      await this.db.updateDiff.deleteByProjectAndChain(projectName, chain)
      await this.db.updateDiff.insertMany(updateDiffs)

      this.logger.info('Inserted update diffs', {
        projectName,
        chain,
        updateDiffs: updateDiffs.length,
      })
    })
  }

  getUpdateDiffs(
    diff: DiscoveryDiff[],
    latestDiscovery: DiscoveryOutput,
    projectName: string,
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

        const entry = latestDiscovery.entries.find(
          (e) => e.address === discoveryDiff.address,
        )

        return entry?.receivedPermissions?.[index]?.permission === 'upgrade'
      }),
    )

    if (
      implementationChanges.length === 0 &&
      fieldHighSeverityChanges.length === 0 &&
      upgradeChanges.length === 0
    ) {
      return []
    }

    const updateDiffs: UpdateDiffRecord[] = []

    for (const implementationChange of implementationChanges) {
      updateDiffs.push({
        projectName,
        type: 'implementationChange',
        address: implementationChange.address,
        chain,
        timestamp,
      })
    }

    for (const fieldHighSeverityChange of fieldHighSeverityChanges) {
      updateDiffs.push({
        projectName,
        type: 'highSeverityFieldChange',
        address: fieldHighSeverityChange.address,
        chain,
        timestamp,
      })
    }

    for (const upgradeChange of upgradeChanges) {
      updateDiffs.push({
        projectName,
        type: 'ultimateUpgraderChange',
        address: upgradeChange.address,
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
