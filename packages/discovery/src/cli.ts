import { Logger } from '@l2beat/backend-tools'

import { discoverCommand } from './cli/discoverCommand'
import { flattenCommand } from './cli/flattenCommand'
import { handleCli } from './cli/handleCli'
import { invertCommand } from './cli/invertCommand'
import { singleDiscoveryCommand } from './cli/singleDiscoveryCommand'
import { getDiscoveryCliConfig } from './config/config.discovery'

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main(): Promise<void> {
  const cli = handleCli()
  const config = getDiscoveryCliConfig(cli)
  const logger = Logger.DEBUG

  await discoverCommand(config, logger)
  await invertCommand(config, logger)
  await singleDiscoveryCommand(config, logger)
  await flattenCommand(config, logger)
}
