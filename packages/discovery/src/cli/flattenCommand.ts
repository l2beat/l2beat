import { Logger } from '@l2beat/backend-tools'

import { DiscoveryCliConfig } from '../config/types'
import { runFlatten } from '../flatten/runFlatten'

export async function flattenCommand(
  config: DiscoveryCliConfig,
  logger: Logger,
): Promise<void> {
  if (!config.flatten) {
    return
  }

  const { path, rootContractName } = config.flatten
  logger.info('Starting')

  await runFlatten(path, rootContractName, logger)
}
