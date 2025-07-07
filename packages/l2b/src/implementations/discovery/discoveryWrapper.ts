import {
  type ConfigReader,
  type DiscoveryModuleConfig,
  type DiscoveryPaths,
  type TemplateService,
  discover,
  getChainConfigs,
  modelPermissionsCommand,
} from '@l2beat/discovery'
import { updateDiffHistory } from './updateDiffHistory'
import type { Logger } from '@l2beat/backend-tools'

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
