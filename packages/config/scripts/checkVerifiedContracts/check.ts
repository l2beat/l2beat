import { Logger } from '@l2beat/backend-tools'

import { EthereumAddress } from '@l2beat/shared-pure'
import { merge } from 'lodash'
import { bridges, daLayers, layer2s, layer3s } from '../../src'
import { getManuallyVerifiedContracts } from '../../src/verification/manuallyVerifiedContracts'
import {
  areAllAddressesVerified,
  getUniqueAddressesForDaLayer,
  getUniqueContractsForProject,
} from './addresses'
import { getChainNames, getChainNamesForDA } from './chains'
import { getEtherscanClient } from './etherscan'
import {
  PROJECTS_OUTPUT_PATH,
  VerificationMap,
  getOutputPath,
  loadPreviouslyVerifiedContracts,
  saveResult,
} from './output'
import { verifyContracts } from './tasks'
import { withoutDuplicates } from './utils'

interface CheckResult {
  verificationMap: Record<string, VerificationMap>
  uniqueAddresses: Record<string, EthereumAddress[]>
}

function encodeKey(id: string, chain: string): string {
  return `${id}:${chain}`
}

function decodeKey(key: string): {
  id: string
  chain: string
} {
  const parts = key.split(':')
  return { id: parts[0], chain: parts[1] }
}

export async function check(workersCount: number, logger: Logger) {
  const L2BEAT = await checkL2BEAT(workersCount, logger)
  const DABEAT = await checkDABEAT(workersCount, logger)

  const mergedVerficationMap = merge(
    L2BEAT.verificationMap,
    DABEAT.verificationMap,
  )

  for (const chain of Object.keys(mergedVerficationMap)) {
    const path = getOutputPath(chain)
    await saveResult(path, mergedVerficationMap[chain])
  }

  for (const chain of Object.keys(mergedVerficationMap)) {
    const path = getOutputPath(chain)
    await saveResult(path, mergedVerficationMap[chain])
  }

  const projectVerificationMap: VerificationMap = {}
  Object.entries(L2BEAT.uniqueAddresses).forEach(([key, addresses]) => {
    const { id, chain } = decodeKey(key)

    projectVerificationMap[id] ??= true
    projectVerificationMap[id] &&= areAllAddressesVerified(
      addresses,
      mergedVerficationMap[chain],
    )
  })

  Object.entries(DABEAT.uniqueAddresses).forEach(([key, addresses]) => {
    const { id, chain } = decodeKey(key)

    projectVerificationMap[id] ??= true
    projectVerificationMap[id] &&= areAllAddressesVerified(
      addresses,
      mergedVerficationMap[chain],
    )
  })

  await saveResult(PROJECTS_OUTPUT_PATH, projectVerificationMap)
}

async function checkL2BEAT(
  workersCount: number,
  logger: Logger,
): Promise<CheckResult> {
  const verificationMap: Record<string, VerificationMap> = {}
  const uniqueAddresses: Record<string, EthereumAddress[]> = {}

  const projects = [...layer2s, ...bridges, ...layer3s]
  const chains = getChainNames(projects)
  for (const chain of chains) {
    console.log(`Checking on chain ${chain}...`)

    let addresses = []
    for (const project of projects) {
      const key = encodeKey(project.id, chain)
      const addressesOnChain = getUniqueContractsForProject(project, chain)
      uniqueAddresses[key] = addressesOnChain
      addresses.push(...addressesOnChain)
    }
    addresses = withoutDuplicates(addresses)

    const manuallyVerified = getManuallyVerifiedContracts(chain)
    const previouslyVerified = await loadPreviouslyVerifiedContracts(chain)
    const etherscanClient = getEtherscanClient(chain)
    const addressVerificationMap = await verifyContracts(
      addresses,
      previouslyVerified,
      manuallyVerified,
      etherscanClient,
      workersCount,
      logger,
    )
    verificationMap[chain] = addressVerificationMap
  }

  return { verificationMap, uniqueAddresses }
}

async function checkDABEAT(
  workersCount: number,
  logger: Logger,
): Promise<CheckResult> {
  const verificationMap: Record<string, VerificationMap> = {}
  const uniqueAddresses: Record<string, EthereumAddress[]> = {}

  const chains = getChainNamesForDA(daLayers)
  for (const chain of chains) {
    console.log(`Checking on chain ${chain}...`)

    let addresses = []
    for (const daLayer of daLayers) {
      const key = encodeKey(daLayer.id, chain)
      const addressesOnChain = getUniqueAddressesForDaLayer(daLayer, chain)
      uniqueAddresses[key] = addressesOnChain
      addresses.push(...addressesOnChain)
    }
    addresses = withoutDuplicates(addresses)

    const manuallyVerified = getManuallyVerifiedContracts(chain)
    const previouslyVerified = await loadPreviouslyVerifiedContracts(chain)
    const etherscanClient = getEtherscanClient(chain)
    const addressVerificationMap = await verifyContracts(
      addresses,
      previouslyVerified,
      manuallyVerified,
      etherscanClient,
      workersCount,
      logger,
    )
    verificationMap[chain] = addressVerificationMap
  }

  return { verificationMap, uniqueAddresses }
}
