import dotenv from 'dotenv'
import { ethers, utils } from 'ethers'

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

  const addresses = {
    Bridge: '0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a',
    Rollup: '0x5eF0D09d1E6204141B4d37530808eD19f60FBa35',
    RollupEventInbox: '0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f',
    SequencerInbox: '0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6',
    Inbox: '0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f',
    ChallengeManager: '0xe5896783a2F463446E1f624e64Aa6836BE4C6f58',
    Outbox: '0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840',
    L1CustomGateway: '0xcEe284F754E854890e311e3280b767F80797180d',
    L1GatewayRouter: '0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef',
    L1ERC20Gateway: '0xa3A7B6F88361F48403514059F1F16C8E78d60EeC',
  }

  const results = []

  for (const [key, address] of Object.entries(addresses)) {
    const admin = await provider.getStorageAt(address, adminSlot)
    const implementation = await provider.getStorageAt(
      address,
      implementationSlot,
    )
    results.push({
      contract: key,
      address: utils.getAddress(address),
      admin: utils.getAddress('0x' + admin.slice(26)),
      implementation: utils.getAddress('0x' + implementation.slice(26)),
    })
  }

  console.table(results)
}

function getEnv(key: string) {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Env variable ${key} is not present!`)
  }
  return value
}
