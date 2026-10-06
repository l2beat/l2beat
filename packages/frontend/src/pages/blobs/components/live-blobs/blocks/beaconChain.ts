import type { LiveBlock } from '~/server/features/data-availability/live-blobs/LiveBlobsFeed'

/** One blob transaction: a project's batch in a block */
export interface BlobBatch {
  posterIndex: number
  blobs: number
  /** Blobs of the block's earlier batches, which this one sits on */
  blobsBelow: number
  /** Where it was sent, lowercase. Says the most about a batch from an unknown sender */
  to: string
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
      }
      blobsBelow += batch.blobs
      return placed
    }),
  }
}
