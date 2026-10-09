import { assert, toBatches } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

/**
 * Small enough for the paid providers we use (Alchemy advises staying under
 * 50, geth's own limit is 1000, publicnode takes 100), and large enough that a
 * block's blob txs go in one request. Smaller limits, like dRPC's free 3, are
 * set per RPC or learned from rejections.
 */
export const DEFAULT_MAX_BATCH_SIZE = 50

export const BATCH_REJECTED = Symbol('BATCH_REJECTED')

/**
 * Splits a batch into requests the RPC takes. When the RPC rejects one as a
 * whole, its calls go one by one and later batches are half as big, so an RPC
 * with a small or unknown limit gets slower instead of stuck: a retry would
 * only send the rejected batch again.
 */
export class RpcBatcher {
  private batchSize: number

  constructor(maxBatchSize = DEFAULT_MAX_BATCH_SIZE) {
    assert(maxBatchSize >= 1, 'maxBatchSize must be at least 1')
    this.batchSize = maxBatchSize
  }

  /** Results in the order of `paramsList` */
  async run<P, R>(
    paramsList: P[],
    sendBatch: (chunk: P[]) => Promise<R[] | typeof BATCH_REJECTED>,
    sendOne: (params: P) => Promise<R>,
  ): Promise<R[]> {
    const chunks = toBatches(paramsList, this.batchSize)
    const results = await Promise.all(
      chunks.map(async (chunk) => {
        if (chunk.length === 1) {
          return [await sendOne(chunk[0] as P)]
        }
        const result = await sendBatch(chunk)
        if (result !== BATCH_REJECTED) {
          return result
        }
        this.batchSize = Math.min(
          this.batchSize,
          Math.max(1, Math.floor(chunk.length / 2)),
        )
        return await Promise.all(chunk.map(sendOne))
      }),
    )
    return results.flat()
  }
}

/** Whether the RPC rejected a batch as a whole, not some of its calls */
export function isBatchRejected(status: number, body: unknown): boolean {
  // These pass with a retry, and single calls would only add to the load
  if (status === 408 || status === 429) {
    return false
  }
  if (status >= 400 && status < 500) {
    return true
  }
  const errors = (Array.isArray(body) ? body : [body]).flatMap((item) => {
    const parsed = ErrorEnvelope.safeValidate(item)
    return parsed.success ? [parsed.data.error.message] : []
  })
  // A batch is answered with an array, one error in its place rejects it all
  if (!Array.isArray(body) && errors.length > 0 && status < 300) {
    return true
  }
  // dRPC fails every call with it, publicnode sends it once for the batch
  return errors.some((message) => /batch|too large/i.test(message))
}

const ErrorEnvelope = v.object({ error: v.object({ message: v.string() }) })
