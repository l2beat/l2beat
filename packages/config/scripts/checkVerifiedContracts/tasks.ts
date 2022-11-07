import { EtherscanClient, Logger, TaskQueue } from '@l2beat/common'
import { EthereumAddress } from '@l2beat/types'

import { isContractVerified } from './etherscan'
import { VerificationMap } from './output'

export async function verifyContracts(
  addresses: EthereumAddress[],
  previouslyVerified: Set<EthereumAddress>,
  manuallyVerified: Set<EthereumAddress>,
  etherscanClient: EtherscanClient,
  workersCount: number,
  logger: Logger,
): Promise<VerificationMap> {
  logger.info(`Processing ${addresses.length} addresses.`)
  const result: VerificationMap = {}

  const { taskQueue, queueStatus } = prepareTaskQueueWithQuickFail(
    async (address: EthereumAddress) => {
      logger.info(`Checking ${address.toString()}...`)
      const isVerified = await isContractVerified(etherscanClient, address)
      result[address.toString()] = isVerified
    },
    logger,
    workersCount,
  )

  addresses.forEach((address) => {
    if (previouslyVerified.has(address) || manuallyVerified.has(address)) {
      result[address.toString()] = true
    } else {
      taskQueue.addToBack(address)
    }
  })

  await taskQueue.waitTilEmpty()
  if (queueStatus.errorOccurred) {
    throw new Error('An error occurred while fetching verification status.')
  }
  return result
}

interface QueueStatus {
  errorOccurred: boolean
}

// Returns a queue that discards remaining tasks as soon as one fails.
function prepareTaskQueueWithQuickFail(
  task: (a: EthereumAddress) => Promise<void>,
  logger: Logger,
  workersCount: number,
): {
  taskQueue: TaskQueue<EthereumAddress>
  queueStatus: QueueStatus
} {
  const queueStatus: QueueStatus = {
    errorOccurred: false,
  }

  const taskQueue = new TaskQueue(
    async (address: EthereumAddress) => {
      if (!queueStatus.errorOccurred) {
        await task(address)
      } else {
        logger.warn('Job skipped due to previous error.')
      }
    },
    logger,
    {
      workers: workersCount,
      shouldRetry: (_) => {
        queueStatus.errorOccurred = true
        return { retry: false }
      },
    },
  )

  return { taskQueue, queueStatus }
}
