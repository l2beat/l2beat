import { Logger } from '@l2beat/backend-tools'
import { TemplateService } from '../discovery/analysis/TemplateService'
import { ConfigReader } from '../discovery/config/ConfigReader'
import {
  type DiscoveryPaths,
  getDiscoveryPaths,
} from '../discovery/config/getDiscoveryPaths'
import { combinePermissionsIntoDiscovery } from '../discovery/modelling/combinePermissionsIntoDiscovery'
import {
  DiscoveryRegistry,
  getDependenciesToDiscoverForProject,
  modelPermissions,
} from '../discovery/modelling/modelPermissions'
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
  logger.info('Reading all related discoveries:')
  const dependencies = getDependenciesToDiscoverForProject(
    project,
    configReader,
  )
  const discoveries = new DiscoveryRegistry()
  for (const dependency of dependencies) {
    const discovery = configReader.readDiscovery(
      dependency.project,
      dependency.chain,
    )
    logger.info(` - ${dependency.project} on ${dependency.chain}`)
    discoveries.set(dependency.project, dependency.chain, discovery)
  }

  const ultimatePermissions = await modelPermissions(
    project,
    discoveries,
    configReader,
    templateService,
    paths,
    { debug },
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
  const rawConfig = configReader.readRawConfig(project)
  const chainConfigs = configReader
    .readAllDiscoveredChainsForProject(project)
    .flatMap((chain) => configReader.readConfig(project, chain))

  for (const config of chainConfigs) {
    const discovery = configReader.readDiscovery(config.name, config.chain)
    combinePermissionsIntoDiscovery(discovery, permissionsOutput, {
      skipDependentDiscoveries: !rawConfig.modelCrossChainPermissions,
    })

    const projectDiscoveryFolder = configReader.getProjectChainPath(
      config.name,
      config.chain,
    )
    discovery.entries = discovery.entries.map((e) => sortEntry(e))
    await saveDiscoveredJson(discovery, projectDiscoveryFolder)
  }
}
