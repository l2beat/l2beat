import { Logger } from '@l2beat/backend-tools'
import { assert, ChainId } from '@l2beat/shared-pure'

import { bridges, layer2s } from '../../src'
import { getManuallyVerifiedContracts } from '../../src/verification/manuallyVerifiedContracts'
import {
  areAllProjectContractsVerified,
  getUniqueContractsForAllProjects,
} from './addresses'
import { getEtherscanClient } from './etherscan'
import {
  getOutputPath,
  loadPreviouslyVerifiedContracts,
  saveResult,
  VerificationMap,
} from './output'
import { verifyContracts } from './tasks'

export const SUPPORTED_CHAINS = [ChainId.ETHEREUM]

export async function check(
  chainId: ChainId,
  workersCount: number,
  logger: Logger,
) {
  assert(SUPPORTED_CHAINS.includes(chainId))

  const outputFilePath = getOutputPath(chainId)
  const manuallyVerified = getManuallyVerifiedContracts(chainId)

  const projects = [...layer2s, ...bridges]
  const previouslyVerified = await loadPreviouslyVerifiedContracts(
    outputFilePath,
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
    outputFilePath,
    addressVerificationMap,
    projectVerificationMap,
  )
}
