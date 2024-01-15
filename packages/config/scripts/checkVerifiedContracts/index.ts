import { getEnv, Logger } from '@l2beat/backend-tools'
import { ChainId } from '@l2beat/shared-pure'

import { check, SUPPORTED_CHAINS } from './check'

export async function main() {
  const logger = new Logger({ logLevel: 'INFO', format: 'pretty' })
  const envWorkersVar = 'ETHERSCAN_WORKERS'
  const workersCount = getEnv().integer(envWorkersVar, 4)

  console.log('Check Verified Contracts.')
  console.log('=========================')
  console.log(
    `${envWorkersVar}=${workersCount} (can be changed via environment variable)`,
  )

  for (const chainId of SUPPORTED_CHAINS) {
    console.log(`Checking ${ChainId.getName(chainId)}...`)
    await check(chainId, workersCount, logger)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
