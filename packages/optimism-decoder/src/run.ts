import dotenv from 'dotenv'
import { ethers } from 'ethers'

import { analyzeTransaction } from './analyze'
import { decodeSequencerBatch } from './decode'
import { FourBytesApi } from './FourBytesApi'

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
  const txHash = process.argv[2]
  if (!/^0x[a-f\d]{64}$/i.test(txHash)) {
    printHelpAndExit()
  }
  return { txHash }
}

function printHelpAndExit(): never {
  console.log('USAGE: yarn start [txhash]')
  process.exit(1)
}

export async function run() {
  dotenv.config()

  const alchemyApiKey = getEnv('ALCHEMY_API_KEY')
  const { txHash } = getArgs()

  const rpcUrl = `https://eth-mainnet.alchemyapi.io/v2/${alchemyApiKey}`
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
  const fourBytesApi = new FourBytesApi()

  const { data, project } = await analyzeTransaction(provider, txHash)
  await decodeSequencerBatch(project, data, fourBytesApi)
}
