import type { IRpcClient, ReceiptLog } from '@l2beat/shared'

/**
 * Batched portal operations share one receipt, so fetch each at most once.
 * Create one per indexer update: a cache that outlives it could serve logs of
 * a reorged-out transaction.
 */
export class ReceiptLogCache {
  private readonly logs = new Map<string, Promise<ReceiptLog[]>>()

  constructor(private readonly rpc: IRpcClient) {}

  get(transactionHash: string): Promise<ReceiptLog[]> {
    const key = transactionHash.toLowerCase()
    const cached = this.logs.get(key)
    if (cached) return cached

    const logs = this.rpc
      .getTransactionReceipt(transactionHash)
      .then((receipt) => receipt.logs)
    this.logs.set(key, logs)
    return logs
  }
}
