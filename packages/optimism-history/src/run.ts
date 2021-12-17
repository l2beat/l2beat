import dotenv from 'dotenv'
import { ethers } from 'ethers'

import { config } from './config'
import { EtherscanApi } from './EtherscanApi'
import { getHistory } from './history'

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

  const alchemyApiKey = getEnv('ALCHEMY_API_KEY')
  const { networkConfig } = getArgs()

  const etherscanApiKey = getEnv('ETHERSCAN_API_KEY')
  const etherscanApi = new EtherscanApi(etherscanApiKey)

  const rpcUrl = `https://eth-mainnet.alchemyapi.io/v2/${alchemyApiKey}`
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl)

  await getHistory(provider, etherscanApi, networkConfig)
}
