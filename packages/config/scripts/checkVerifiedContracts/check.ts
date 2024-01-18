import { Logger } from '@l2beat/backend-tools'

import { bridges, layer2s, layer3s } from '../../src'
import { getManuallyVerifiedContracts } from '../../src/verification/manuallyVerifiedContracts'
import {
  areAllProjectContractsVerified,
  getUniqueContractsForAllProjects,
} from './addresses'
import { getChainDevIds } from './chains'
import { getEtherscanClient } from './etherscan'
import {
  getOutputPath,
  loadPreviouslyVerifiedContracts,
  PROJECTS_OUTPUT_PATH,
  saveResult,
  VerificationMap,
  VerificationMapPerChain,
} from './output'
import { verifyContracts } from './tasks'

export async function check(workersCount: number, logger: Logger) {
  const projects = [...layer2s, ...bridges, ...layer3s]
  const devIds = getChainDevIds(projects)

  const addressVerificationMapPerChain: VerificationMapPerChain = {}

  for (const devId of devIds) {
    console.log(`Checking on chain ${devId}...`)
    const outputFilePath = getOutputPath(devId)
    const manuallyVerified = getManuallyVerifiedContracts(devId)

    const previouslyVerified = await loadPreviouslyVerifiedContracts(devId)
    const addresses = getUniqueContractsForAllProjects(projects, devId)
    const etherscanClient = getEtherscanClient(devId)
    const addressVerificationMap = await verifyContracts(
      addresses,
      previouslyVerified,
      manuallyVerified,
      etherscanClient,
      workersCount,
      logger,
    )
    await saveResult(outputFilePath, addressVerificationMap)
    addressVerificationMapPerChain[devId] = addressVerificationMap
  }

  const projectVerificationMap: VerificationMap = {}
  projects.forEach((project) => {
    projectVerificationMap[project.id.toString()] =
      areAllProjectContractsVerified(project, addressVerificationMapPerChain)
  })
  await saveResult(PROJECTS_OUTPUT_PATH, projectVerificationMap)
}
