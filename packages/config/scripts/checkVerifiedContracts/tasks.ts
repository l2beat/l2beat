import { EtherscanClient, Logger, TaskQueue } from '@l2beat/common'
import { EthereumAddress } from '@l2beat/types'

import { isContractVerified } from './etherscan'
import { VerificationMap } from './output'

function prepareTaskQueue(
  task: (task: EthereumAddress) => Promise<void>,
  etherscanClient: EtherscanClient,
  workersCount: number,
): TaskQueue<EthereumAddress> {
  return new TaskQueue(task, Logger.WARN, {
    workers: workersCount,
    // Force exit the script on first error.
    shouldRetry: () => process.exit(1),
  })
}

export async function verifyContracts(
  addresses: EthereumAddress[],
  previouslyVerified: Set<EthereumAddress>,
  etherscanClient: EtherscanClient,
  workersCount: number,
): Promise<VerificationMap> {
  console.log(`Processing ${addresses.length} unique addresses.`)
  const result: VerificationMap = {}

  // Copy previously verified contracts directly to result
  addresses
    .filter((a) => previouslyVerified.has(a))
    .forEach((a) => (result[a.toString()] = true))

  const taskQueue = prepareTaskQueue(
    async (address: EthereumAddress) => {
      console.log(`Checking ${address.toString()}...`)
      const isVerified = await isContractVerified(etherscanClient, address)
      result[address.toString()] = isVerified
    },
    etherscanClient,
    workersCount,
  )

  // Only check contracts that were not already verified
  addresses
    .filter((a) => !previouslyVerified.has(a))
    .forEach((a) => taskQueue.addToBack(a))
  await taskQueue.waitTilEmpty()
  return result
}
