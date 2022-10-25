import { EtherscanClient, HttpClient, Logger, TaskQueue } from '@l2beat/common'
import { EthereumAddress } from '@l2beat/types'
import { config as dotenv } from 'dotenv'
import { setTimeout as wait } from 'timers/promises'

import {
  Bridge,
  bridges,
  Layer2,
  layer2s,
  ProjectContracts,
  ProjectUpgradeability,
} from '../src'

function gatherAddressesFromUpgradeability(
  item: ProjectUpgradeability,
): string[] {
  const result: string[] = []
  switch (item.type) {
    case 'Custom':
    case 'CustomWithoutAdmin':
    case 'EIP1967':
    case 'ZeppelinOs':
    case 'NutBerry':
      result.push(item.implementation)
      break
    case 'StarkWare':
      result.push(item.implementation)
      if (item.callImplementation) {
        result.push(item.callImplementation)
      }
      break
    case 'Arbitrum':
      result.push(item.adminImplementation)
      result.push(item.userImplementation)
      break
    case 'Beacon':
      result.push(item.beacon)
      result.push(item.implementation)
      break
    case 'Reference':
      // Ignoring type "Reference"
      break
    default:
      // This call makes sure that we handled all possible cases
      assertUnreachable(item)
  }
  return result
}

// This method triggers a compile-time error if not all cases has been covered!
function assertUnreachable(_: never): never {
  throw new Error(
    'There are more values to this type than handled in the switch statement.',
  )
}

function gatherAddressesFromContracts(contracts: ProjectContracts): string[] {
  const result: string[] = []
  for (const contract of contracts.addresses) {
    result.push(contract.address)

    if (contract.upgradeability) {
      result.push(...gatherAddressesFromUpgradeability(contract.upgradeability))
    }
  }
  return result
}

function gatherAddresses(projects: (Layer2 | Bridge)[]): string[] {
  const result: string[] = []
  for (const project of projects) {
    if (project.contracts) {
      result.push(...gatherAddressesFromContracts(project.contracts))
    }
  }
  return result
}

async function isContractUnverified(
  etherscanClient: EtherscanClient,
  address: string,
) {
  // console.log(`Checking ${address}`)
  const sourceCodeResponse = await etherscanClient.getContractSource(
    EthereumAddress(address),
  )
  const result = sourceCodeResponse.SourceCode === ''
  // console.log(result)
}

export function getEnv(name: string, fallback?: string): string {
  const value = process.env[name]
  if (value !== undefined) {
    return value
  }
  if (fallback !== undefined) {
    return fallback
  }
  throw new Error(`Missing environment variable ${name}!`)
}

export async function main() {
  console.log(
    'Gathering validation status of Layer2s and Bridges on Etherscan.',
  )
  console.log('===============================================================')

  console.log('Gathering contract addresses...')
  const addresses = gatherAddresses([...layer2s, ...bridges])
  console.log(`Found ${addresses.length} contract addresses,`)
  const uniqueAddresses = new Set(addresses)
  console.log(`of which ${uniqueAddresses.size} are unique.`)


  console.log('Checking source code verification of each contract...')
  const etherscanClient = new EtherscanClient(
    new HttpClient(),
    'https://api.etherscan.io/api',
    getEnv('ETHERSCAN_API_KEY'),
  )
  const workers = parseInt(getEnv('WORKERS', '5'))
  const taskQueue = new TaskQueue(
    (address: string) => isContractUnverified(etherscanClient, address), 
    Logger.WARN, 
    { 
      workers, 
      // Force exit the script on first error
      shouldRetry: () => process.exit(1) 
    }
  )
  uniqueAddresses.forEach(address => taskQueue.addToBack(address))
  while (taskQueue.length > 0) {
    console.log(`Remaining: ${taskQueue.length}`)
    await wait(5000)
  }
}

dotenv()
main().catch((error) => {
  console.error(error)
  process.exit(1)
})
