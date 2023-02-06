import { EthereumAddress, EtherscanClient, Logger } from '@l2beat/shared'

import { isContractVerified } from './etherscan'
import { VerificationMap } from './output'

export async function verifyContracts(
  addresses: EthereumAddress[],
  previouslyVerified: Set<EthereumAddress>,
  manuallyVerified: Set<EthereumAddress>,
  etherscanClient: EtherscanClient,
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
  const verifications = []
  for (const verificationPromise of verificationPromises) {
    const verification = await verificationPromise()
    verifications.push(verification)
  }

  return Object.fromEntries(verifications)
}
