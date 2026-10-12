import type { EVMTransaction, IRpcClient, ReceiptLog } from '@l2beat/shared'

/**
 * Batched portal operations share a receipt and transaction, so fetch each at most once.
 * Create one per indexer update: a cache that outlives it could serve logs of
 * a reorged-out transaction.
 */
export class ReceiptLogCache {
  private readonly logs = new Map<string, Promise<ReceiptLog[]>>()
  private readonly transactions = new Map<string, Promise<EVMTransaction>>()

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

  getTransaction(transactionHash: string): Promise<EVMTransaction> {
    const key = transactionHash.toLowerCase()
    const cached = this.transactions.get(key)
    if (cached) return cached

    const transaction = this.rpc.getTransaction(transactionHash)
    this.transactions.set(key, transaction)
    return transaction
  }
}
