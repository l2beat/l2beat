import { Logger } from '@l2beat/backend-tools'
import {
  ConfigReader,
  type DiscoveryOutput,
  discover,
  getChainConfig,
  getChainConfigs,
  getDiscoveryPaths,
} from '@l2beat/discovery'
import { readFileSync } from 'fs'
import { rimraf } from 'rimraf'

export async function rediscoverStructureOnBlock(
  projectName: string,
  chain: string,
  blockNumber: number,
  saveSources = false,
  overwriteCache = false,
): Promise<DiscoveryOutput> {
  process.stdout.write(
    `Rediscovering ${projectName} on ${chain} at block ${blockNumber}... `,
  )
  const paths = getDiscoveryPaths()
  const configReader = new ConfigReader(paths.discovery)
  const discoveryFolder = configReader.getProjectChainPath(projectName, chain)

  // Remove any old sources we fetched before, so that their count doesn't grow
  await rimraf(`${discoveryFolder}/.code@*`, { glob: true })
  await rimraf(`${discoveryFolder}/.flat@*`, { glob: true })

  await discover(
    {
      project: projectName,
      chain: getChainConfig(chain),
      blockNumber: blockNumber,
      sourcesFolder: `.code@${blockNumber}`,
      flatSourcesFolder: `.flat@${blockNumber}`,
      discoveryFilename: `discovered@${blockNumber}.json`,
      saveSources,
      overwriteCache,
    },
    getChainConfigs(),
    Logger.SILENT,
  )
  const prevDiscoveryFile = readFileSync(
    `${discoveryFolder}/discovered@${blockNumber}.json`,
    'utf-8',
  )
  const prevDiscovery = JSON.parse(prevDiscoveryFile) as DiscoveryOutput

  // Remove discovered@... file, we don't need it
  await rimraf(`${discoveryFolder}/discovered@${blockNumber}.json`)
  process.stdout.write('done\n')
  return prevDiscovery
}
