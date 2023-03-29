import { HttpClient, MainnetEtherscanClient } from '@l2beat/shared'
import { providers } from 'ethers'

import { getCliParameters } from './cli/getCliParameters'
import { ConfigReader } from './core/discovery/ConfigReader'
import { runDiscovery } from './core/discovery/runDiscovery'

main().catch((e) => {
  console.error(e)

  process.exit(1)
})

async function main() {
  const cli = getCliParameters()
  if (cli.mode === 'help') {
    // TODO print usage
    return
  }

  const config = {
    // TODO get env
    project: '',
    // blockNumber?: cli.
    alchemyApiKey: '',
    etherscanApiKey: '',
  }

  const http = new HttpClient()

  const provider = new providers.AlchemyProvider(
    'mainnet',
    config.alchemyApiKey,
  )
  const etherscanClient = new MainnetEtherscanClient(
    http,
    config.etherscanApiKey,
  )

  const configReader = new ConfigReader()

  await runDiscovery(provider, etherscanClient, configReader, config)
  return
}
