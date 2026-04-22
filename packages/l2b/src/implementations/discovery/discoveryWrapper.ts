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
import { generateEntrypointsCommand } from '@l2beat/discovery/dist/discovery/shared-modules/generateEntrypoints'
import { updateDiffHistory } from './updateDiffHistory'

export interface Options {
  logger: Logger
  configReader: ConfigReader
  description?: string
  templateService?: TemplateService
  paths?: DiscoveryPaths
  debug?: boolean
}

export async function discoverAndUpdateDiffHistory(
  config: DiscoveryModuleConfig,
  options: Options,
) {
  await discover(config, getChainConfigs(), options.logger)
  try {
    await modelPermissionsCommand(
      config.project,
      options.configReader,
      options.templateService,
      options.paths,
      options.debug,
      options.logger,
    )
  } catch (error) {
    // Permission modelling is a separate, non-fatal step. We don't want a
    // crash here (e.g. invalid Clingo input) to mask a successful discovery
    // or block the diff-history / entrypoints steps that follow.
    const message = error instanceof Error ? error.message : String(error)
    options.logger.warn(
      `Permission modelling failed (non-fatal): ${message.split('\n')[0]}`,
    )
  }
  await updateDiffHistory(
    config.project,
    options.description,
    config.overwriteCache,
    options.logger,
  )
  await generateEntrypointsCommand(
    options.configReader,
    config.project,
    options.logger,
    {
      updateOnly: true,
      keepLegacy: true,
    },
  )
}
