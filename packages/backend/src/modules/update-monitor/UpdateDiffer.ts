import type { Logger } from '@l2beat/backend-tools'
import type { Database, UpdateDiffRecord } from '@l2beat/database'
import { type ConfigReader, diffDiscovery } from '@l2beat/discovery'
import type { ConfigRegistry, DiscoveryOutput } from '@l2beat/discovery'
import {
  type ChainConverter,
  ChainId,
  type UnixTime,
} from '@l2beat/shared-pure'
import type { DiscoveryRunner } from './DiscoveryRunner'
import { sanitizeDiscoveryOutput } from './sanitizeDiscoveryOutput'

export class UpdateDiffer {
  constructor(
    private readonly configReader: ConfigReader,
    private readonly db: Database,
    private readonly chainConverter: ChainConverter,
    private readonly logger: Logger,
  ) {
    this.logger = this.logger.for(this)
  }

  async run(
    runner: DiscoveryRunner,
    latestDiscovery: DiscoveryOutput,
    projectConfig: ConfigRegistry,
    timestamp: UnixTime,
  ) {
    const previousDiscovery = this.getPreviousDiscovery(runner, projectConfig)

    const unverifiedEntries = previousDiscovery.entries
      .filter((c) => c.unverified)
      .map((c) => c.name)
      .filter((c) => c !== undefined)

    const prevSanitizedDiscovery = sanitizeDiscoveryOutput(previousDiscovery)
    const sanitizedDiscovery = sanitizeDiscoveryOutput(latestDiscovery)

    const diff = diffDiscovery(
      prevSanitizedDiscovery.entries,
      sanitizedDiscovery.entries,
      unverifiedEntries,
    )

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

        const entry = sanitizedDiscovery.entries.find(
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
      this.logger.info('No changes in project', {
        projectName: projectConfig.name,
      })
      return
    }

    const updateDiffs: UpdateDiffRecord[] = []

    for (const implementationChange of implementationChanges) {
      updateDiffs.push({
        projectName: projectConfig.name,
        type: 'implementationChange',
        address: implementationChange.address,
        chainId: ChainId(this.chainConverter.toChainId(runner.chain)),
        timestamp,
      })
    }

    for (const fieldHighSeverityChange of fieldHighSeverityChanges) {
      updateDiffs.push({
        projectName: projectConfig.name,
        type: 'highSeverityFieldChange',
        address: fieldHighSeverityChange.address,
        chainId: ChainId(this.chainConverter.toChainId(runner.chain)),
        timestamp,
      })
    }

    for (const upgradeChange of upgradeChanges) {
      updateDiffs.push({
        projectName: projectConfig.name,
        type: 'ultimateUpgraderChange',
        address: upgradeChange.address,
        chainId: ChainId(this.chainConverter.toChainId(runner.chain)),
        timestamp,
      })
    }

    this.logger.info('Inserting update diffs', {
      projectName: projectConfig.name,
      updateDiffs: updateDiffs.length,
    })
    await this.db.updateDiff.insertMany(updateDiffs)
  }

  private getPreviousDiscovery(
    runner: DiscoveryRunner,
    projectConfig: ConfigRegistry,
  ): DiscoveryOutput {
    console.time('getPreviousDiscovery')
    const previousDiscovery = this.configReader.readDiscovery(
      projectConfig.name,
      runner.chain,
    )

    console.timeEnd('getPreviousDiscovery')

    return previousDiscovery
  }
}
