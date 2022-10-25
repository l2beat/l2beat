import { EtherscanClient, HttpClient, Logger, TaskQueue } from '@l2beat/common'
import { EthereumAddress } from '@l2beat/types'
import { config as dotenv } from 'dotenv'
import { readFile, writeFile } from 'fs/promises'

import { Bridge, bridges, Layer2, layer2s } from '../src'
import { getEnv, getUniqueContractsForProject } from '../src/utils'

const OUTPUT_FILEPATH = 'src/common/verifiedContracts.json'

function getUniqueContractAddresses(
  projects: (Layer2 | Bridge)[],
): EthereumAddress[] {
  const addresses = []
  for (const project of projects) {
    addresses.push(...getUniqueContractsForProject(project))
  }
  // Cast to Set to remove duplicates
  return [...new Set(addresses)]
}

async function isContractVerified(
  etherscanClient: EtherscanClient,
  address: EthereumAddress,
): Promise<boolean> {
  const resp = await etherscanClient.getContractSource(address)
  return resp.SourceCode !== ''
}

async function checkVerificationOfAddresses(
  addresses: EthereumAddress[],
  previouslyVerified: Set<EthereumAddress>,
  workers: number,
): Promise<Map<EthereumAddress, boolean>> {
  console.log(`Processing ${addresses.length} unique addresses.`)
  const etherscanClient = new EtherscanClient(
    new HttpClient(),
    'https://api.etherscan.io/api',
    getEnv('ETHERSCAN_API_KEY'),
  )
  const result = new Map<EthereumAddress, boolean>()
  const taskQueue = new TaskQueue(
    async (address: EthereumAddress) => {
      console.log(`Checking ${address.toString()}...`)
      const isVerified = await isContractVerified(etherscanClient, address)
      result.set(address, isVerified)
    },
    Logger.WARN,
    {
      workers,
      // Force exit the script on first error.
      shouldRetry: () => process.exit(1),
    },
  )
  addresses.forEach((address) => {
    if (previouslyVerified.has(address)) {
      result.set(address, true)
    } else {
      taskQueue.addToBack(address)
    }
  })
  await taskQueue.waitTilEmpty()
  return result
}

async function loadPreviouslyVerifiedContracts(): Promise<
  Set<EthereumAddress>
> {
  const result = new Set<EthereumAddress>()

  try {
    const data = await readFile(OUTPUT_FILEPATH, 'utf-8')
    const verifiedContracts = JSON.parse(data) as Record<string, boolean>
    for (const address in verifiedContracts) {
      if (verifiedContracts[address]) {
        result.add(EthereumAddress(address))
      }
    }
    console.log(`Loaded ${result.size} previously verified contracts.`)
  } catch (e) {
    console.log('Unable to load previously verified contracts.')
  }
  return result
}

export async function main() {
  const envWorkersVar = 'ETHERSCAN_WORKERS'
  const workers = parseInt(getEnv(envWorkersVar, '4'))
  console.log('Check Verified Contracts.')
  console.log('=========================')
  console.log(
    `${envWorkersVar}=${workers} (can be changed via environment variable)`,
  )

  const previouslyVerified = await loadPreviouslyVerifiedContracts()
  const addresses = getUniqueContractAddresses([...layer2s, ...bridges])
  const verifiedMap = await checkVerificationOfAddresses(
    addresses,
    previouslyVerified,
    workers,
  )
  // JS Maps are iterated in insertion order.
  // Sorting the map to make git diff comprehensible.
  const sortedMap = new Map([...verifiedMap.entries()].sort())
  await writeFile(
    OUTPUT_FILEPATH,
    JSON.stringify(Object.fromEntries(sortedMap), null, 2),
  )
}

dotenv()
main().catch((error) => {
  console.error(error)
  process.exit(1)
})
