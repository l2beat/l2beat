import type { IRpcClient } from '@l2beat/shared'
import { assert, EthereumAddress } from '@l2beat/shared-pure'

const TRANSACTION_LOOKUP_BATCH_SIZE = 25

export interface PrivacyTransaction {
  from: EthereumAddress
  to: EthereumAddress | undefined
}

/** Looks up transactions in batches, keyed by lowercase hash. */
export async function getPrivacyTransactions(
  rpcClient: IRpcClient,
  transactionHashes: string[],
): Promise<Map<string, PrivacyTransaction>> {
  const result = new Map<string, PrivacyTransaction>()

  for (
    let start = 0;
    start < transactionHashes.length;
    start += TRANSACTION_LOOKUP_BATCH_SIZE
  ) {
    const batch = transactionHashes.slice(
      start,
      start + TRANSACTION_LOOKUP_BATCH_SIZE,
    )
    const transactions = await Promise.all(
      batch.map((hash) => rpcClient.getTransaction(hash)),
    )

    for (let i = 0; i < batch.length; i++) {
      const requestedHash = batch[i]
      const transaction = transactions[i]
      assert(requestedHash !== undefined && transaction !== undefined)
      assert(
        transaction.hash.toLowerCase() === requestedHash.toLowerCase(),
        `Transaction hash mismatch for ${requestedHash}`,
      )
      result.set(requestedHash.toLowerCase(), {
        from: EthereumAddress(transaction.from),
        to:
          transaction.to === undefined
            ? undefined
            : EthereumAddress(transaction.to),
      })
    }
  }

  return result
}
