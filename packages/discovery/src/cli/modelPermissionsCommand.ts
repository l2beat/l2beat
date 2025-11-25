import { Logger } from '@l2beat/backend-tools'
import { TemplateService } from '../discovery/analysis/TemplateService.js'
import { ConfigReader } from '../discovery/config/ConfigReader.js'
import {
  type DiscoveryPaths,
  getDiscoveryPaths,
} from '../discovery/config/getDiscoveryPaths.js'
import { combinePermissionsIntoDiscovery } from '../discovery/modelling/combinePermissionsIntoDiscovery.js'
import {
  DiscoveryRegistry,
  modelPermissions,
} from '../discovery/modelling/modelPermissions.js'
import { saveDiscoveredJson } from '../discovery/output/saveDiscoveryResult.js'
import { sortEntry } from '../discovery/output/toDiscoveryOutput.js'
import type { PermissionsOutput } from '../discovery/output/types.js'

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
  const dependencies: string[] = [project]
  const discoveries = new DiscoveryRegistry()
  for (const dependency of dependencies) {
    const discovery = configReader.readDiscovery(dependency)
    logger.info(` - ${dependency}`)
    discoveries.set(dependency, discovery)
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
  const discovery = configReader.readDiscovery(project)
  combinePermissionsIntoDiscovery(discovery, permissionsOutput, {
    skipDependentDiscoveries: !rawConfig.modelCrossChainPermissions,
  })

  const projectDiscoveryFolder = configReader.getProjectPath(project)
  discovery.entries = discovery.entries.map((e) => sortEntry(e))
  await saveDiscoveredJson(discovery, projectDiscoveryFolder)
}
