import { EtherscanClient, Logger, TaskQueue } from '@l2beat/common'
import { EthereumAddress } from '@l2beat/types'

import { isContractVerified } from './etherscan'
import { VerificationMap } from './output'

export async function verifyContracts(
  addresses: EthereumAddress[],
  previouslyVerified: Set<EthereumAddress>,
  etherscanClient: EtherscanClient,
  workersCount: number,
  logger: Logger,
): Promise<VerificationMap> {
  logger.info(`Processing ${addresses.length} addresses.`)
  const result: VerificationMap = {}
  let errorOccured = false

  // Copy previously verified contracts directly to result
  addresses
    .filter((a) => previouslyVerified.has(a))
    .forEach((a) => (result[a.toString()] = true))

  const taskQueue = new TaskQueue(
    async (address: EthereumAddress) => {
      if (!errorOccured) {
        logger.info(`Checking ${address.toString()}...`)
        const isVerified = await isContractVerified(etherscanClient, address)
        result[address.toString()] = isVerified
      } else {
        logger.warn('Job skipped due to previous error.')
      }
    },
    logger,
    {
      workers: workersCount,
      shouldRetry: (_) => {
        errorOccured = true
        return { retry: false }
      },
    },
  )
  // Only check contracts that were not already verified
  addresses
    .filter((a) => !previouslyVerified.has(a))
    .forEach((a) => taskQueue.addToBack(a))

  await taskQueue.waitTilEmpty()

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (errorOccured) {
    throw new Error('An error occured while fetching verification status.')
  }
  return result
}
