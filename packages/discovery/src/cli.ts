import { Logger } from '@l2beat/backend-tools'

import { discoverCommand } from './cli/discoverCommand'
import { flattenCommand } from './cli/flattenCommand'
import { handleCli } from './cli/handleCli'
import { invertCommand } from './cli/invertCommand'
import { singleDiscoveryCommand } from './cli/singleDiscoveryCommand'
import { chains } from './config/chains'
import {
  getChainConfig,
  getDiscoveryCliConfig,
} from './config/config.discovery'

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main(): Promise<void> {
  const cli = handleCli()
  const config = getDiscoveryCliConfig(cli)
  const logger = Logger.DEBUG

  const chainConfigs = chains.flatMap((chain) => {
    try {
      const config = getChainConfig(chain.name)
      return [config]
    } catch {
      return []
    }
  })
  logger.debug('Supported chains', { chains: chainConfigs.map((x) => x.name) })

  await discoverCommand(config, chainConfigs, logger)
  await invertCommand(config, logger)
  await singleDiscoveryCommand(config, chainConfigs, logger)
  await flattenCommand(config, logger)
}
