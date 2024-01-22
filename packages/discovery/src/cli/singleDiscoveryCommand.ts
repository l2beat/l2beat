import { Logger } from '@l2beat/backend-tools'
import { execSync } from 'child_process'
import { providers } from 'ethers'
import path from 'path'
import { rimraf } from 'rimraf'

import { DiscoveryCliConfig } from '../config/types'
import { DiscoveryConfig } from '../discovery/config/DiscoveryConfig'
import { DiscoveryLogger } from '../discovery/DiscoveryLogger'
import { saveDiscoveryResult } from '../discovery/output/saveDiscoveryResult'
import { discover as discovery } from '../discovery/runDiscovery'
import { EtherscanLikeClient } from '../utils/EtherscanLikeClient'
import { HttpClient } from '../utils/HttpClient'

export async function singleDiscoveryCommand(
  { singleDiscovery, chain }: DiscoveryCliConfig,
  logger: Logger,
): Promise<void> {
  if (!singleDiscovery) {
    return
  }

  const projectConfig = new DiscoveryConfig({
    name: singleDiscovery.address.toString(),
    chain: chain.chain,
    initialAddresses: [singleDiscovery.address],
  })

  const http = new HttpClient()
  const provider = new providers.StaticJsonRpcProvider(chain.rpcUrl)
  const etherscanClient = EtherscanLikeClient.createForDiscovery(
    http,
    chain.etherscanUrl,
    chain.etherscanApiKey,
    chain.etherscanUnsupported,
  )
  const blockNumber = await provider.getBlockNumber()

  logger = logger.for('SingleDiscovery')
  logger.info('Starting')

  const results = await discovery(
    provider,
    etherscanClient,
    chain.multicall,
    projectConfig,
    DiscoveryLogger.CLI,
    blockNumber,
    chain.rpcGetLogsMaxRange,
  )

  const rootFolder = `./cache/single-discovery`
  await rimraf(rootFolder)

  await saveDiscoveryResult(results, projectConfig, blockNumber, {
    rootFolder,
  })

  logger.info(
    'Opening discovered.json in the browser, please use firefox or other browser with JSON viewer extension',
  )
  logger.info(
    'The discovered.json & code can be found in "./cache/single-discovery"',
  )

  const jsonFilePath = path.join(rootFolder, 'discovered.json')
  execSync(`open ${jsonFilePath}`)
}
