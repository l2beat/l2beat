import { Logger } from '@l2beat/backend-tools'
import {
  ConfigReader,
  type DiscoveryOutput,
  discover,
  getChainConfigs,
  getDiscoveryPaths,
} from '@l2beat/discovery'
import { readdirSync, readFileSync, rmSync } from 'fs'
import { join } from 'path'

export type Timing =
  | { blockNumber: number; timing?: undefined }
  | { timestamp: number; blockNumber?: undefined }

export async function rediscoverStructureOnBlock(
  projectName: string,
  timing: Timing,
  saveSources: boolean,
  overwriteCache: boolean,
  logger: Logger,
): Promise<DiscoveryOutput> {
  const timePoint =
    timing.blockNumber !== undefined ? timing.blockNumber : timing.timestamp

  logger.info(`Rediscovering ${projectName} at ${timePoint}`)
  const paths = getDiscoveryPaths()
  const configReader = new ConfigReader(paths.discovery)
  const discoveryFolder = configReader.getProjectPath(projectName)

  // Remove any old sources we fetched before, so that their count doesn't grow
  for (const entry of readdirSync(discoveryFolder)) {
    if (entry.startsWith('.code@') || entry.startsWith('.flat@')) {
      rmSync(join(discoveryFolder, entry), { recursive: true, force: true })
    }
  }

  await discover(
    {
      project: projectName,
      ...timing,
      sourcesFolder: `.code@${timePoint}`,
      flatSourcesFolder: `.flat@${timePoint}`,
      discoveryFilename: `discovered@${timePoint}.json`,
      saveSources,
      overwriteCache,
    },
    getChainConfigs(),
    Logger.SILENT,
  )
  const prevDiscoveryFile = readFileSync(
    `${discoveryFolder}/discovered@${timePoint}.json`,
    'utf-8',
  )
  const prevDiscovery = JSON.parse(prevDiscoveryFile) as DiscoveryOutput

  // Remove discovered@... file, we don't need it
  rmSync(`${discoveryFolder}/discovered@${timePoint}.json`, { force: true })
  return prevDiscovery
}
