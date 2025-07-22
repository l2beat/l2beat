import type { Logger } from '@l2beat/backend-tools'
import {
  type ConfigReader,
  type DiscoveryModuleConfig,
  type DiscoveryPaths,
  discover,
  getChainConfigs,
  modelPermissionsCommand,
  type TemplateService,
} from '@l2beat/discovery'
import { updateDiffHistory } from './updateDiffHistory'

export interface Options {
  logger: Logger
  description?: string
  configReader?: ConfigReader
  templateService?: TemplateService
  paths?: DiscoveryPaths
  debug?: boolean
}

export async function discoverAndUpdateDiffHistory(
  config: DiscoveryModuleConfig,
  options: Options,
) {
  await discover(config, getChainConfigs(), options.logger)
  await modelPermissionsCommand(
    config.project,
    options.configReader,
    options.templateService,
    options.paths,
    options.debug,
    options.logger,
  )
  await updateDiffHistory(
    config.project,
    options.description,
    config.overwriteCache,
    options.logger,
  )
}
