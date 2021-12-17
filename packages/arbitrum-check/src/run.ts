import dotenv from 'dotenv'
import { ethers } from 'ethers'

import { config } from './config'
import { EtherscanApi } from './EtherscanApi'
import { walkConfig } from './walkConfig'

export async function run() {
  dotenv.config()

  const alchemyApiKey = getEnv('ALCHEMY_API_KEY')
  const rpcUrl = `https://eth-mainnet.alchemyapi.io/v2/${alchemyApiKey}`
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl)

  const etherscanApiKey = getEnv('ETHERSCAN_API_KEY')
  const etherscanApi = new EtherscanApi(etherscanApiKey)

  const rollupAddress = '0xC12BA48c781F6e392B49Db2E25Cd0c28cD77531A'
  const l1GatewayRouter = '0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef'
  const l1ERC20Gateway = '0xa3A7B6F88361F48403514059F1F16C8E78d60EeC'

  await walkConfig(provider, etherscanApi, config, [
    rollupAddress,
    l1GatewayRouter,
    l1ERC20Gateway,
  ])
}

function getEnv(key: string) {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Env variable ${key} is not present!`)
  }
  return value
}
