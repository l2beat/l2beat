import {
  EthereumAddress,
  EtherscanClient,
  Logger,
  toBatches,
} from '@l2beat/shared'

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
    async (address): Promise<[string, boolean]> => {
      if (previouslyVerified.has(address) || manuallyVerified.has(address)) {
        return [address.toString(), true]
      }

      logger.info(`Checking ${address.toString()}...`)
      const isVerified = await isContractVerified(etherscanClient, address)
      return [address.toString(), isVerified]
    },
  )

  const batches = toBatches(verificationPromises, workersCount)
  const verifications = (
    await Promise.all(batches.map((batch) => Promise.all(batch)))
  ).flat()

  return Object.fromEntries(verifications)
}
