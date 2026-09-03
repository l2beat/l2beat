import { ConfigReader, getDiscoveryPaths } from '@l2beat/discovery'
import {
  type DiscoveryChangelog,
  type DiscoveryChangelogEntry,
  deduplicateUpgradeTimestamps,
  getOssificationInfo,
  type OssificationContractInput,
  type ProjectOssificationInfo,
  parseUpgradeTimestamps,
} from '@l2beat/shared'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { OssificationJsonSchema } from './OssificationJson'

let configReader: ConfigReader | undefined
const projectsRoot = () => getDiscoveryPaths().discovery

/**
 * The ossification factor is computed only for projects that opted in by
 * committing an ossification.json, and only over contracts the research team
 * flagged `critical` in discovery (template default, config.jsonc override).
 * There is no derived fallback — unclassified projects have no factor. Runs at
 * config build time; the result is stored on the project and measured against
 * the current time by the frontend.
 */
export function loadOssificationInfo(
  projectId: string,
  /** Project's own chain start: shared-contract history before it is not the
   *  project's doing and is not charged to its change rate. */
  projectStart?: number,
): ProjectOssificationInfo | undefined {
  const ossification = readOssificationJson(projectId)
  if (ossification === undefined) return undefined
  configReader ??= new ConfigReader(projectsRoot())

  const critical: OssificationContractInput[] = []
  const changelog: DiscoveryChangelogEntry[] = []
  const firstUpgradeIsChange = new Set(
    (ossification.firstUpgradeIsChange ?? []).map((a) => a.toLowerCase()),
  )
  const ignoredUpgradeTransactions = new Map(
    Object.entries(ossification.ignoredUpgradeTransactions ?? {}).map(
      ([address, transactions]) => [
        address.toLowerCase(),
        new Set(transactions.map((t) => t.toLowerCase())),
      ],
    ),
  )
  for (const id of new Set([
    projectId,
    ...(ossification.includeProjects ?? []),
  ])) {
    for (const entry of configReader.readDiscovery(id).entries) {
      if (entry.type !== 'Contract' || entry.critical !== true) continue
      const address = entry.address.toString()
      critical.push({
        address,
        name: entry.name ?? address,
        isVerified: entry.unverified !== true,
        sinceTimestamp: entry.sinceTimestamp,
        upgradeTimestamps: parseUpgradeTimestamps(
          entry.values?.$pastUpgrades,
          ignoredUpgradeTransactions.get(address.toLowerCase()),
        ),
        firstUpgradeIsInitialization: !firstUpgradeIsChange.has(
          address.toLowerCase(),
        ),
        highSeverityFields: Object.entries(entry.fieldMeta ?? {}).flatMap(
          ([field, meta]) => (meta?.severity === 'HIGH' ? [field] : []),
        ),
      })
    }
    changelog.push(...readChangelog(id))
  }

  const historical = (ossification.historicalContracts ?? []).flatMap(
    (contract) =>
      contract.critical === true
        ? [
            {
              address: contract.address,
              name: contract.name,
              upgradeTimestamps: deduplicateUpgradeTimestamps(
                contract.upgradeTimestamps,
              ),
            },
          ]
        : [],
  )

  return getOssificationInfo(
    critical,
    changelog,
    historical,
    ossification.criticalEvents ?? [],
    projectStart,
  )
}

/** Most projects have no ossification.json (and many no discovery folder at
 *  all), so this is a plain existence check on the project directory. */
export function readOssificationJson(projectId: string) {
  const file = join(projectsRoot(), projectId, 'ossification.json')
  if (!existsSync(file)) return undefined
  return OssificationJsonSchema.parse(JSON.parse(readFileSync(file, 'utf-8')))
}

function readChangelog(projectId: string): DiscoveryChangelogEntry[] {
  const file = join(projectsRoot(), projectId, 'changelog.json')
  if (!existsSync(file)) return []
  return (JSON.parse(readFileSync(file, 'utf-8')) as DiscoveryChangelog).entries
}
