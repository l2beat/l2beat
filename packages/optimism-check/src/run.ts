import {
  AddressAnalyzer,
  HttpClient,
  MainnetEtherscanClient,
} from '@l2beat/common'
import dotenv from 'dotenv'
import { ethers } from 'ethers'

import { config } from './config'
import { walkConfig } from './walkConfig'

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
  const addressAnalyzer = new AddressAnalyzer(provider, etherscanClient)

  const libAddressManager = '0xde1fcfb0851916ca5101820a69b13a4e276bd81f'
  const startingPoint = 'OVM_L1CrossDomainMessenger'

  await walkConfig(provider, addressAnalyzer, config, libAddressManager, [startingPoint])
}

function getEnv(key: string) {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Env variable ${key} is not present!`)
  }
  return value
}
