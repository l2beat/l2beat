import { EtherscanClient, HttpClient, Logger, TaskQueue } from '@l2beat/common'
import { EthereumAddress } from '@l2beat/types'
import { config as dotenv } from 'dotenv'
import { writeFile } from 'fs/promises'

import { Bridge, bridges, Layer2, layer2s } from '../src'
import { getEnv, getUniqueContractsForProject } from '../src/utils'

function getUniqueContractAddresses(projects: (Layer2 | Bridge)[]): EthereumAddress[] {
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
  workers: number,
): Promise<Map<EthereumAddress, boolean>> {
  console.log(`Processing ${addresses.length} unique addresses.`)
  const etherscanClient = new EtherscanClient(
    new HttpClient(),
    'https://api.etherscan.io/api',
    getEnv('ETHERSCAN_API_KEY'),
  )
  const verificationMap = new Map<EthereumAddress, boolean>()
  const taskQueue = new TaskQueue(
    async (address: EthereumAddress) => {
      verificationMap.set(
        address,
        await isContractVerified(etherscanClient, address),
      )
    },
    Logger.WARN,
    {
      workers,
      // Force exit the script on first error
      shouldRetry: () => process.exit(1),
    },
  )
  addresses.forEach((address) => taskQueue.addToBack(address))
  await taskQueue.waitTilEmpty()
  console.log('Done.')
  return verificationMap
}

export async function main() {
  const envWorkersVar = 'ETHERSCAN_WORKERS'
  const workers = parseInt(getEnv(envWorkersVar, '5'))
  console.log('Check Verified Contracts.')
  console.log('=========================')
  console.log(
    `${envWorkersVar}=${workers} (can be changed via environment variable)`,
  )

  const addresses = getUniqueContractAddresses([...layer2s, ...bridges])
  const verifiedMap = await checkVerificationOfAddresses(addresses.slice(1, 10), workers)
  await writeFile(
    'build/verifiedContracts.json',
    JSON.stringify(Object.fromEntries(verifiedMap), null, 2)
  )
}

dotenv()
main().catch((error) => {
  console.error(error)
  process.exit(1)
})
