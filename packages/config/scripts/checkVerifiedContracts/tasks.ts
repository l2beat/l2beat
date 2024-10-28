import { Logger } from '@l2beat/backend-tools'
import { BlockIndexerClient } from '@l2beat/shared'
import { EthereumAddress, toBatches } from '@l2beat/shared-pure'

import { providers } from 'ethers'
import { AddressVerificationStatus, isContractVerified } from './etherscan'
import { VerificationMap } from './output'

export async function verifyContracts(
  addresses: EthereumAddress[],
  previouslyVerified: Set<EthereumAddress>,
  manuallyVerified: Record<string, string>,
  etherscanClient: BlockIndexerClient,
  provider: providers.JsonRpcProvider,
  workersCount: number,
  logger: Logger,
): Promise<VerificationMap> {
  logger.info(`Processing ${addresses.length} addresses.`)

  const getVerificationPromises = (addresses: EthereumAddress[]) =>
    addresses.map(
      async (address): Promise<[string, AddressVerificationStatus]> => {
        if (
          previouslyVerified.has(address) ||
          manuallyVerified[address.toString()]
        ) {
          return [address.toString(), 'verified']
        }

        logger.info(`Checking ${address.toString()}...`)
        const isVerified = await isContractVerified(
          etherscanClient,
          provider,
          address,
        )
        return [address.toString(), isVerified]
      },
    )

  const batches = toBatches(addresses, workersCount)
  const results = []
  for (const batch of batches) {
    const processed = await Promise.all(getVerificationPromises(batch))
    results.push(...processed)
  }

  const convertedToBooleans = results.map(([address, status]) => {
    // sometimes addresses manually added to .ts configs are EOAs,
    // so we need to set their status to verified
    return [address, status === 'verified' || status === 'EOA']
  })
  return Object.fromEntries(convertedToBooleans)
}
