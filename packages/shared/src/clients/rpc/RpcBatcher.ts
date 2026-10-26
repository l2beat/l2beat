import { Logger } from '@l2beat/backend-tools'
import { assert, toBatches } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

/**
 * Small enough for the paid providers we use (Alchemy advises staying under
 * 50, geth's own limit is 1000, publicnode takes 100), and large enough that a
 * block's blob txs go in one request. Smaller limits, like dRPC's free 3, are
 * set per RPC or learned from rejections.
 */
export const DEFAULT_MAX_BATCH_SIZE = 50

/**
 * A rejection may come from one node behind a load balancer or a bad minute,
 * so a learned size is not kept for good
 */
const LEARNED_SIZE_TTL_MS = 5 * 60_000

export const BATCH_REJECTED = Symbol('BATCH_REJECTED')

type SendBatch<P, R> = (chunk: P[]) => Promise<R[] | typeof BATCH_REJECTED>
type SendOne<P, R> = (params: P) => Promise<R>

export interface RpcBatcherOptions {
  /** The RPC's known limit; a batch it rejects then throws, nothing is learned */
  maxBatchSize?: number
  logger?: Logger
  now?: () => number
}

/**
 * Splits a batch into requests the RPC takes. Without a configured limit, a
 * batch the RPC rejects for its size is sent again in halves until it passes,
 * down to one call at a time, so an RPC with a small limit gets slower instead
 * of stuck: a retry would only send the rejected batch again.
 */
export class RpcBatcher {
  private readonly maxBatchSize: number
  private readonly isConfigured: boolean
  private readonly logger: Logger
  private readonly now: () => number
  private learned?: { size: number; until: number }
  /** Set while one rejected batch searches for the size the RPC takes */
  private sizeSearch?: Promise<void>

  constructor(options: RpcBatcherOptions = {}) {
    this.maxBatchSize = options.maxBatchSize ?? DEFAULT_MAX_BATCH_SIZE
    assert(this.maxBatchSize >= 1, 'maxBatchSize must be at least 1')
    this.isConfigured = options.maxBatchSize !== undefined
    this.logger = options.logger ?? Logger.SILENT
    this.now = options.now ?? Date.now
  }

  /** Results in the order of `paramsList` */
  async run<P, R>(
    method: string,
    paramsList: P[],
    sendBatch: SendBatch<P, R>,
    sendOne: SendOne<P, R>,
  ): Promise<R[]> {
    await this.sizeSearch
    const chunks = toBatches(paramsList, this.batchSize())
    const results = await Promise.all(
      chunks.map(async (chunk) => {
        if (chunk.length === 1) {
          return [await sendOne(chunk[0] as P)]
        }
        const result = await sendBatch(chunk)
        if (result !== BATCH_REJECTED) {
          return result
        }
        return await this.resend(method, chunk, sendBatch, sendOne)
      }),
    )
    return results.flat()
  }

  /**
   * Chunks sent together are rejected together. Only the first searches for
   * the size, the rest wait for it, so the RPC sees about log2(size)
   * rejections instead of each chunk halving on its own.
   */
  private async resend<P, R>(
    method: string,
    rejected: P[],
    sendBatch: SendBatch<P, R>,
    sendOne: SendOne<P, R>,
  ): Promise<R[]> {
    if (this.sizeSearch) {
      return await this.run(method, rejected, sendBatch, sendOne)
    }
    const search = this.searchSize(method, rejected, sendBatch, sendOne)
    this.sizeSearch = search.then(
      () => {},
      () => {},
    )
    let head: R[]
    try {
      head = await search
    } finally {
      this.sizeSearch = undefined
    }
    const rest = rejected.slice(head.length)
    return [...head, ...(await this.run(method, rest, sendBatch, sendOne))]
  }

  /** Sends ever smaller heads of the rejected batch until one passes */
  private async searchSize<P, R>(
    method: string,
    rejected: P[],
    sendBatch: SendBatch<P, R>,
    sendOne: SendOne<P, R>,
  ): Promise<R[]> {
    let rejectedSize = rejected.length
    while (true) {
      this.shrinkBelow(method, rejectedSize)
      const head = rejected.slice(0, this.batchSize())
      if (head.length === 1) {
        return [await sendOne(head[0] as P)]
      }
      const result = await sendBatch(head)
      if (result !== BATCH_REJECTED) {
        return result
      }
      rejectedSize = head.length
    }
  }

  private batchSize(): number {
    if (this.learned && this.now() < this.learned.until) {
      return this.learned.size
    }
    return this.maxBatchSize
  }

  /** The limit is below the rejected size, so halving finds it in a few rounds */
  private shrinkBelow(method: string, rejectedSize: number) {
    if (this.isConfigured) {
      throw new Error(
        'RPC rejected a batch within the configured maxBatchSize',
        {
          cause: { method, rejectedSize, maxBatchSize: this.maxBatchSize },
        },
      )
    }
    const size = Math.min(
      this.batchSize(),
      Math.max(1, Math.floor(rejectedSize / 2)),
    )
    this.learned = { size, until: this.now() + LEARNED_SIZE_TTL_MS }
    this.logger.warn('Batch rejected, sending smaller batches', {
      method,
      rejectedSize,
      batchSize: size,
    })
  }
}

/**
 * Whether the RPC rejected a batch for its size. Errors of single calls don't
 * count: a retry may fix them, or they belong to the caller.
 */
export function isBatchRejected(status: number, body: unknown): boolean {
  if (status === 413) {
    return true
  }
  // A 429 or 5xx mentioning the batch is about load, a retry handles it
  if (status !== 200 && status !== 400) {
    return false
  }
  const errors = errorsOfWholeBatch(body)
  return (
    errors.length > 0 &&
    errors.every((message) => message.toLowerCase().includes('batch'))
  )
}

/**
 * Cloudflare and Flashbots answer with one error in place of the array, dRPC
 * fails every call, publicnode answers with an array of one error
 */
function errorsOfWholeBatch(body: unknown): string[] {
  const messages: string[] = []
  for (const item of Array.isArray(body) ? body : [body]) {
    const parsed = ErrorEnvelope.safeValidate(item)
    if (!parsed.success) {
      return []
    }
    messages.push(parsed.data.error.message)
  }
  return messages
}

const ErrorEnvelope = v.object({ error: v.object({ message: v.string() }) })
