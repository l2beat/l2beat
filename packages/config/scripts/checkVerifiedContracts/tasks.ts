import { EtherscanClient, Logger, promiseAllPlus } from '@l2beat/common'
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

  const verificationPromises = addresses.map(
    (address) => async (): Promise<[string, boolean]> => {
      if (previouslyVerified.has(address) || manuallyVerified.has(address)) {
        return [address.toString(), true]
      }

      logger.info(`Checking ${address.toString()}...`)
      const isVerified = await isContractVerified(etherscanClient, address)
      return [address.toString(), isVerified]
    },
  )

  const verification = await promiseAllPlus(verificationPromises, logger, {
    maxConcurrency: workersCount,
  })

  return Object.fromEntries(verification)
}
