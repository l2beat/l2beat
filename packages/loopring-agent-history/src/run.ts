import {
  AddressAnalyzer,
  HttpClient,
  MainnetEtherscanClient,
} from '@l2beat/common'
import dotenv from 'dotenv'
import { ethers } from 'ethers'

import { BlockTimestampService } from './BlockTimestampService'
import { EventProcessor } from './EventProcessor'
import { getHistory } from './history'

function getEnv(key: string) {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Env variable ${key} is not present!`)
  }
  return value
}

export async function run() {
  dotenv.config()

  const alchemyApiKey = getEnv('ALCHEMY_API_KEY')

  const rpcUrl = `https://eth-mainnet.alchemyapi.io/v2/${alchemyApiKey}`
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl)

  const etherscanApiKey = getEnv('ETHERSCAN_API_KEY')
  const httpClient = new HttpClient()
  const etherscanClient = new MainnetEtherscanClient(
    httpClient,
    etherscanApiKey
  )

  const blockTimestampService = new BlockTimestampService(provider)

  const addressAnalyzer = new AddressAnalyzer(provider, etherscanClient)

  const eventProcessor = new EventProcessor(
    blockTimestampService,
    addressAnalyzer,
    provider
  )

  await getHistory(provider, eventProcessor)
}
