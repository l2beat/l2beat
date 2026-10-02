import type { IRpcClient } from '@l2beat/shared'
import { assert, unique } from '@l2beat/shared-pure'
import chunk from 'lodash/chunk'
import type { PrivacyRpcLog } from '../types'

const RECEIPT_LOOKUP_BATCH_SIZE = 25

/** For extractors that need the other logs of an event's transaction. */
export async function fetchPrivacyReceiptLogs(
  rpcClient: IRpcClient,
  transactionHashes: string[],
): Promise<Map<string, PrivacyRpcLog[]>> {
  const result = new Map<string, PrivacyRpcLog[]>()

  for (const batch of chunk(
    unique(transactionHashes),
    RECEIPT_LOOKUP_BATCH_SIZE,
  )) {
    const receipts = await Promise.all(
      batch.map((hash) => rpcClient.getTransactionReceipt(hash)),
    )
    for (const [index, hash] of batch.entries()) {
      const logs = receipts[index]?.logs
      assert(logs, `Missing receipt for ${hash}`)
      result.set(
        hash,
        logs.map((log) => {
          assert(
            log.address !== undefined,
            'Receipt log is missing its emitter',
          )
          return { ...log, address: log.address }
        }),
      )
    }
  }

  return result
}
