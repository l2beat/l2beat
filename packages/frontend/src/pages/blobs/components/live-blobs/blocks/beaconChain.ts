import type { LiveBlock } from '~/server/features/data-availability/live-blobs/LiveBlobsFeed'
import type { PendingBatch } from '~/server/features/data-availability/live-blobs/pendingBlobs'

/** One blob transaction: a project's batch in a block */
export interface BlobBatch {
  posterIndex: number
  blobs: number
  /** Blobs of the block's earlier batches, which this one sits on */
  blobsBelow: number
  /** Where it was sent, lowercase. Says the most about a batch from an unknown sender */
  to: string
  /** Sender and nonce: the same for the batch while it waited and once in its block */
  key: string
  /** Unix seconds it was first seen pending, if it was */
  pendingSince: number | undefined
}

/** A batch broadcast and waiting for a block */
export interface PendingBlobBatch {
  key: string
  posterIndex: number
  blobs: number
  to: string
  firstSeenAt: number
}

export type ChainBlock =
  | {
      slot: number
      status: 'proposed'
      blockNumber: number
      /** In the block's order, so bottom up */
      batches: BlobBatch[]
    }
  | { slot: number; status: 'missed' }

/** The poster index of a project, or of the stand-in for unknown senders */
export type PosterIndexOf = (projectId: string | undefined) => number

export function toChainBlock(
  block: LiveBlock,
  posterIndexOf: PosterIndexOf,
): ChainBlock {
  if (block.status === 'missed') return block
  let blobsBelow = 0
  return {
    ...block,
    batches: block.batches.map((batch) => {
      const placed = {
        posterIndex: posterIndexOf(batch.projectId),
        blobs: batch.blobs,
        blobsBelow,
        to: batch.to,
        key: batchIdentity(batch.from, batch.nonce),
        pendingSince: batch.pendingSince,
      }
      blobsBelow += batch.blobs
      return placed
    }),
  }
}

export function toPendingBlobBatch(
  batch: PendingBatch,
  posterIndexOf: PosterIndexOf,
): PendingBlobBatch {
  return {
    key: batchIdentity(batch.from, batch.nonce),
    posterIndex: posterIndexOf(batch.projectId),
    blobs: batch.blobs,
    to: batch.to,
    firstSeenAt: batch.firstSeenAt,
  }
}

function batchIdentity(from: string, nonce: number) {
  return `${from}:${nonce}`
}
