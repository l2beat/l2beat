import {
  AddressAnalyzer,
  Cache,
  FileCacheBackend,
  HttpClient,
  MainnetEtherscanClient,
} from '@l2beat/common'
import dotenv from 'dotenv'
import { ethers } from 'ethers'

import { BlockTimestampService } from './BlockTimestampService'
import { config } from './config'
import { EventProcessor } from './EventProcessor'
import { getHistory } from './history'
import { OptimismNameService } from './OptimismNameService'

function getEnv(key: string) {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Env variable ${key} is not present!`)
  }
  return value
}

function getArgs() {
  if (process.argv.length !== 3) {
    printHelpAndExit()
  }
  const network = process.argv[2]
  const networkConfig = config[network]
  if (!networkConfig) {
    console.log('Unsupported network', network)
    printHelpAndExit()
  }
  return { network, networkConfig }
}

function printHelpAndExit(): never {
  console.log('USAGE: yarn start [network]')
  process.exit(1)
}

export async function run() {
  dotenv.config()

  const cacheBackend = new FileCacheBackend()
  const cache = new Cache(cacheBackend)

  const alchemyApiKey = getEnv('ALCHEMY_API_KEY')
  const { networkConfig } = getArgs()

  const rpcUrl = `https://eth-mainnet.alchemyapi.io/v2/${alchemyApiKey}`
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl)

  const etherscanApiKey = getEnv('ETHERSCAN_API_KEY')
  const httpClient = new HttpClient()
  const etherscanClient = new MainnetEtherscanClient(
    httpClient,
    etherscanApiKey
  )

  const blockTimestampService = new BlockTimestampService(provider)
  cache.wrapMethod(blockTimestampService, 'getBlockTimestamp')

  const optimismNameService = new OptimismNameService(provider, cache)

  const addressAnalyzer = new AddressAnalyzer(provider, etherscanClient)
  cache.wrapMethod(addressAnalyzer, 'getName')

  const eventProcessor = new EventProcessor(
    provider,
    blockTimestampService,
    optimismNameService,
    addressAnalyzer
  )

  await getHistory(provider, networkConfig, eventProcessor)
}
