import type { EVMTransaction, IRpcClient, ReceiptLog } from '@l2beat/shared'

/**
 * Batched portal operations share a receipt and transaction, so fetch each at most once.
 * Create one per indexer update: a cache that outlives it could serve logs of
 * a reorged-out transaction.
 */
export class ReceiptLogCache {
  private readonly logs = new Map<string, Promise<ReceiptLog[]>>()
  private readonly transactions = new Map<string, Promise<EVMTransaction>>()

  constructor(
    private readonly rpc: IRpcClient,
    /**
     * Whether a receipt's block is one the logs were read from. Needed for
     * blocks fresh enough to be replaced: a node on another fork serves the
     * receipt the transaction has there
     */
    private readonly isReadBlock?: (blockHash: string | undefined) => boolean,
  ) {}

  get(transactionHash: string): Promise<ReceiptLog[]> {
    const key = transactionHash.toLowerCase()
    const cached = this.logs.get(key)
    if (cached) return cached

    const logs = this.rpc
      .getTransactionReceipt(transactionHash)
      .then((receipt) => {
        if (this.isReadBlock && !this.isReadBlock(receipt.blockHash)) {
          throw new Error(
            'Receipt is from a block the logs were not read from',
            {
              cause: { transactionHash, blockHash: receipt.blockHash },
            },
          )
        }
        return receipt.logs
      })
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
