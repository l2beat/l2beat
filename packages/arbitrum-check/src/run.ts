import dotenv from 'dotenv'
import { ethers } from 'ethers'

export async function run() {
  dotenv.config()

  const alchemyApiKey = getEnv('ALCHEMY_API_KEY')
  const rpcUrl = `https://eth-mainnet.alchemyapi.io/v2/${alchemyApiKey}`
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl)

  /** https://etherscan.io/address/0x8315177ab297ba92a06054ce80a67ed4dbd7ed3a#code#F4#L106 */
  const adminSlot =
    '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103'
  /** https://etherscan.io/address/0x8315177ab297ba92a06054ce80a67ed4dbd7ed3a#code#F4#L28 */
  const implementationSlot =
    '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'
  const bridgeAddress = '0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a'

  const admin = await provider.getStorageAt(bridgeAddress, adminSlot)
  const implementation = await provider.getStorageAt(
    bridgeAddress,
    implementationSlot,
  )

  console.log({ admin, implementation })
}

function getEnv(key: string) {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Env variable ${key} is not present!`)
  }
  return value
}
