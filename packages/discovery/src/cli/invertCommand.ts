import { Logger } from '@l2beat/backend-tools'

import { DiscoveryCliConfig } from '../config/types'
import { ConfigReader } from '../discovery/config/ConfigReader'
import { runInversion } from '../inversion/runInversion'

export async function invertCommand(
  config: DiscoveryCliConfig,
  logger: Logger,
): Promise<void> {
  if (!config.invert) {
    return
  }

  const { project, useMermaidMarkup, chain } = config.invert

  const configReader = new ConfigReader()

  logger = logger.for('Inversion')
  logger.info('Starting')

  await runInversion(project, configReader, useMermaidMarkup, chain)
}
