import type { Logger } from '@l2beat/backend-tools'
import type { Database, UpdateDiffRecord } from '@l2beat/database'
import { type ConfigReader, diffDiscovery } from '@l2beat/discovery'
import type { DiscoveryDiff, DiscoveryOutput } from '@l2beat/discovery'
import {
  type ChainConverter,
  ChainId,
  type UnixTime,
} from '@l2beat/shared-pure'
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
    projectName: string,
    chain: string,
    latestDiscovery: DiscoveryOutput,
    timestamp: UnixTime,
  ) {
    await this.deleteOldRecords(
      projectName,
      ChainId(this.chainConverter.toChainId(chain)),
    )
    const previousDiscovery = this.getPreviousDiscovery({
      name: projectName,
      chain,
    })

    const prevSanitizedDiscovery = sanitizeDiscoveryOutput(previousDiscovery)
    const sanitizedDiscovery = sanitizeDiscoveryOutput(latestDiscovery)

    const diff = diffDiscovery(
      prevSanitizedDiscovery.entries,
      sanitizedDiscovery.entries,
    )

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
      })
      return
    }

    this.logger.info('Inserting update diffs', {
      projectName,
      updateDiffs: updateDiffs.length,
    })
    await this.db.updateDiff.insertMany(updateDiffs)
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
      this.logger.info('No changes in project', {
        projectName,
      })
      return []
    }

    const updateDiffs: UpdateDiffRecord[] = []

    for (const implementationChange of implementationChanges) {
      updateDiffs.push({
        projectName,
        type: 'implementationChange',
        address: implementationChange.address,
        chainId: ChainId(this.chainConverter.toChainId(chain)),
        timestamp,
      })
    }

    for (const fieldHighSeverityChange of fieldHighSeverityChanges) {
      updateDiffs.push({
        projectName,
        type: 'highSeverityFieldChange',
        address: fieldHighSeverityChange.address,
        chainId: ChainId(this.chainConverter.toChainId(chain)),
        timestamp,
      })
    }

    for (const upgradeChange of upgradeChanges) {
      updateDiffs.push({
        projectName,
        type: 'ultimateUpgraderChange',
        address: upgradeChange.address,
        chainId: ChainId(this.chainConverter.toChainId(chain)),
        timestamp,
      })
    }

    return updateDiffs
  }

  async deleteOldRecords(projectName: string, chainId: ChainId) {
    this.logger.info('Deleting all update diffs')
    await this.db.updateDiff.deleteByProjectAndChain(projectName, chainId)
  }

  getPreviousDiscovery({
    name,
    chain,
  }: { name: string; chain: string }): DiscoveryOutput {
    return this.configReader.readDiscovery(name, chain)
  }
}
