import {
  AddressAnalyzer,
  HttpClient,
  MainnetEtherscanClient,
} from '@l2beat/common'
import dotenv from 'dotenv'
import { ethers } from 'ethers'

import { getConfig } from './config'
import { walkConfig } from './walkConfig'

function printHelpAndExit(): never {
  console.log('USAGE: yarn start [network]')
  process.exit(1)
}

function getArgs() {
  if (process.argv.length !== 3) {
    printHelpAndExit()
  }
  const network = process.argv[2]
  return network
}

export async function run() {
  dotenv.config()

  const alchemyApiKey = getEnv('ALCHEMY_API_KEY')
  const rpcUrl = `https://eth-mainnet.alchemyapi.io/v2/${alchemyApiKey}`
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
  const network = getArgs()

  const etherscanApiKey = getEnv('ETHERSCAN_API_KEY')
  const httpClient = new HttpClient()
  const etherscanClient = new MainnetEtherscanClient(
    httpClient,
    etherscanApiKey,
  )
  const addressAnalyzer = new AddressAnalyzer(provider, etherscanClient)

  const { libAddressManager, startingPoints, contracts, mainBridge } =
    getConfig(network)

  await walkConfig(
    provider,
    addressAnalyzer,
    contracts,
    libAddressManager,
    startingPoints,
    mainBridge,
    network,
  )
}

function getEnv(key: string) {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Env variable ${key} is not present!`)
  }
  return value
}
