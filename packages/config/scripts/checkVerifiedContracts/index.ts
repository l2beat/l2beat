import { getEnv, Logger } from '@l2beat/backend-tools'

import { bridges, layer2s } from '../../src'
import { getManuallyVerifiedContracts } from '../../src/verification/manuallyVerifiedContracts'
import {
  areAllProjectContractsVerified,
  getUniqueContractsForAllProjects,
} from './addresses'
import { getEtherscanClient } from './etherscan'
import {
  loadPreviouslyVerifiedContracts,
  saveResult,
  VerificationMap,
} from './output'
import { verifyContracts } from './tasks'

export const OUTPUT_FILEPATH = 'src/verified.json'

export async function main() {
  const logger = new Logger({ logLevel: 'INFO', format: 'pretty' })
  const envWorkersVar = 'ETHERSCAN_WORKERS'
  const workersCount = getEnv().integer(envWorkersVar, 4)
  const manuallyVerified = await getManuallyVerifiedContracts()

  console.log('Check Verified Contracts.')
  console.log('=========================')
  console.log(
    `${envWorkersVar}=${workersCount} (can be changed via environment variable)`,
  )

  const projects = [...layer2s, ...bridges]
  const previouslyVerified = await loadPreviouslyVerifiedContracts(
    OUTPUT_FILEPATH,
  )
  const addresses = getUniqueContractsForAllProjects(projects)
  const etherscanClient = getEtherscanClient()
  const addressVerificationMap = await verifyContracts(
    addresses,
    previouslyVerified,
    manuallyVerified,
    etherscanClient,
    workersCount,
    logger,
  )
  const projectVerificationMap: VerificationMap = {}
  projects.forEach((project) => {
    projectVerificationMap[project.id.toString()] =
      areAllProjectContractsVerified(project, addressVerificationMap)
  })
  await saveResult(
    OUTPUT_FILEPATH,
    addressVerificationMap,
    projectVerificationMap,
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
