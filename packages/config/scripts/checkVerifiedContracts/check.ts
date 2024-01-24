import { Logger } from '@l2beat/backend-tools'

import { bridges, layer2s, layer3s } from '../../src'
import { getManuallyVerifiedContracts } from '../../src/verification/manuallyVerifiedContracts'
import {
  areAllProjectContractsVerified,
  getUniqueContractsForAllProjects,
} from './addresses'
import { getChainNames } from './chains'
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
  const chains = getChainNames(projects)

  const addressVerificationMapPerChain: VerificationMapPerChain = {}

  for (const chain of chains) {
    console.log(`Checking on chain ${chain}...`)
    const outputFilePath = getOutputPath(chain)
    const manuallyVerified = getManuallyVerifiedContracts(chain)

    const previouslyVerified = await loadPreviouslyVerifiedContracts(chain)
    const addresses = getUniqueContractsForAllProjects(projects, chain)
    const etherscanClient = getEtherscanClient(chain)
    const addressVerificationMap = await verifyContracts(
      addresses,
      previouslyVerified,
      manuallyVerified,
      etherscanClient,
      workersCount,
      logger,
    )
    await saveResult(outputFilePath, addressVerificationMap)
    addressVerificationMapPerChain[chain] = addressVerificationMap
  }

  const projectVerificationMap: VerificationMap = {}
  projects.forEach((project) => {
    projectVerificationMap[project.id.toString()] =
      areAllProjectContractsVerified(project, addressVerificationMapPerChain)
  })
  await saveResult(PROJECTS_OUTPUT_PATH, projectVerificationMap)
}
