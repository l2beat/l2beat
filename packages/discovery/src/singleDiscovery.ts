import { EtherscanLikeClient, HttpClient, Logger } from '@l2beat/shared'
import { execSync } from 'child_process'
import { providers } from 'ethers'
import { writeFile } from 'fs/promises'
import { mkdirp } from 'mkdirp'
import { dirname } from 'path'
import { rimraf } from 'rimraf'

import { DiscoveryCliConfig } from './config/config.discovery'
import { DiscoveryConfig } from './discovery/config/DiscoveryConfig'
import { DiscoveryLogger } from './discovery/DiscoveryLogger'
import { getSourceName } from './discovery/output/saveDiscoveryResult'
import { toDiscoveryOutput } from './discovery/output/toDiscoveryOutput'
import { discover as discovery } from './discovery/runDiscovery'

export async function singleDiscovery(
  config: DiscoveryCliConfig,
  logger: Logger,
) {
  if (!config.singleDiscovery) {
    return
  }

  const projectConfig = new DiscoveryConfig({
    name: config.singleDiscovery.address.toString(),
    chain: config.chain.chainId,
    initialAddresses: [config.singleDiscovery.address],
  })
  const chainConfig = config.chain

  const http = new HttpClient()
  const provider = new providers.StaticJsonRpcProvider(chainConfig.rpcUrl)
  const etherscanClient = EtherscanLikeClient.createForDiscovery(
    http,
    chainConfig.etherscanUrl,
    chainConfig.etherscanApiKey,
  )
  const blockNumber = await provider.getBlockNumber()

  logger = logger.for('SingleDiscovery')
  logger.info('Starting')

  const results = await discovery(
    provider,
    etherscanClient,
    projectConfig,
    DiscoveryLogger.CLI,
    blockNumber,
  )
  const discoveryOutput = toDiscoveryOutput(
    projectConfig.name,
    projectConfig.chainId,
    projectConfig.hash,
    blockNumber,
    results,
  )

  const root = `./cache/single-discovery`
  await mkdirp(root)

  const jsonFilePath = `${root}/discovered.json`
  await writeFile(jsonFilePath, JSON.stringify(discoveryOutput, null, 2))

  await rimraf(`${root}/code`)
  for (const result of results) {
    if (result.type === 'EOA') {
      continue
    }
    for (const [i, files] of result.sources.entries()) {
      for (const [file, content] of Object.entries(files)) {
        const codebase = getSourceName(i, result.sources.length)
        const path = `${root}/code/${result.name}${codebase}/${file}`
        await mkdirp(dirname(path))
        await writeFile(path, content)
      }
    }
  }

  logger.info(
    'Opening discovered.json in the browser, please use firefox or other browser with JSON viewer extension',
  )
  logger.info(
    'The discovered.json & code can be found in "./cache/single-discovery"',
  )

  execSync(`open ${jsonFilePath}`)
}
