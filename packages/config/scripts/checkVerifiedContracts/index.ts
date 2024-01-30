import { getEnv, Logger } from '@l2beat/backend-tools'

import { check } from './check'

export async function main() {
  const logger = new Logger({ logLevel: 'INFO', format: 'pretty' })
  const envWorkersVar = 'ETHERSCAN_WORKERS'
  const workersCount = getEnv().integer(envWorkersVar, 4)

  console.log('Check Verified Contracts.')
  console.log('=========================')
  console.log(
    `${envWorkersVar}=${workersCount} (can be changed via environment variable)`,
  )

  await check(workersCount, logger)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
