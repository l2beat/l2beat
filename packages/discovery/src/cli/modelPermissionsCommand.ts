import { Logger } from '@l2beat/backend-tools'
import { TemplateService } from '../discovery/analysis/TemplateService'
import { ConfigReader } from '../discovery/config/ConfigReader'
import {
  type DiscoveryPaths,
  getDiscoveryPaths,
} from '../discovery/config/getDiscoveryPaths'
import { combinePermissionsIntoDiscovery } from '../discovery/modelling/combinePermissionsIntoDiscovery'
import { modelPermissions } from '../discovery/modelling/modelPermissions'
import { saveDiscoveredJson } from '../discovery/output/saveDiscoveryResult'
import { sortEntry } from '../discovery/output/toDiscoveryOutput'
import type { PermissionsOutput } from '../discovery/output/types'

export async function modelPermissionsCommand(
  project: string,
  configReader?: ConfigReader,
  templateService?: TemplateService,
  paths?: DiscoveryPaths,
  debug?: boolean,
  logger: Logger = Logger.DEBUG,
) {
  paths = paths ?? getDiscoveryPaths()
  configReader = configReader ?? new ConfigReader(paths.discovery)
  templateService = templateService ?? new TemplateService(paths.discovery)
  debug = debug ?? false

  logger.info(`Modelling: ${project}`)
  const ultimatePermissions = await modelPermissions(
    project,
    configReader,
    templateService,
    paths,
    debug,
  )

  await writePermissionsIntoDiscovery(
    project,
    ultimatePermissions,
    configReader,
  )
}

export async function writePermissionsIntoDiscovery(
  project: string,
  permissionsOutput: PermissionsOutput,
  configReader: ConfigReader,
) {
  const chainConfigs = configReader
    .readAllChainsForProject(project)
    .flatMap((chain) => configReader.readConfig(project, chain))

  for (const config of chainConfigs) {
    const discovery = configReader.readDiscovery(config.name, config.chain)
    combinePermissionsIntoDiscovery(discovery, permissionsOutput)

    const projectDiscoveryFolder = configReader.getProjectChainPath(
      config.name,
      config.chain,
    )
    discovery.entries = discovery.entries.map((e) => sortEntry(e))
    await saveDiscoveredJson(discovery, projectDiscoveryFolder)
  }
}
