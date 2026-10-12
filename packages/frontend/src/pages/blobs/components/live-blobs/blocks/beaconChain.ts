import type {
  LiveBlock,
  PendingBatch,
  Waited,
} from '~/server/features/data-availability/live-blobs/LiveBlobsFeed'

/** One blob transaction */
export interface BlobBatch {
  posterIndex: number
  blobs: number
  /** Blobs of the block's earlier batches, which this one sits on */
  blobsBelow: number
  /** Lowercase */
  to: string
  txHash: string
  /** Set if it waited in the mempool before its block */
  waited?: Waited
}

/** A batch waiting in the mempool for a block */
export interface PendingBlobBatch {
  /** The same as its `BlobBatch.waited.key` once in its block */
  key: string
  posterIndex: number
  blobs: number
  /** Unix seconds */
  firstSeenAt: number
}

export type ChainBlock =
  | {
      slot: number
      status: 'proposed'
      blockNumber: number
      hash: string
      /** Bottom up */
      batches: BlobBatch[]
    }
  | { slot: number; status: 'missed' }

export type PosterIndexOf = (projectId: string | undefined) => number

/**
 * A reorg can leave a slot empty or holding another block; one built on the
 * same parent has the same number, so only the hash tells them apart
 */
export function isSameBlock(
  held: ChainBlock | undefined,
  block: LiveBlock,
): boolean {
  if (!held || held.status !== block.status) return false
  return (
    held.status === 'missed' ||
    (block.status === 'proposed' && held.hash === block.hash)
  )
}

/**
 * Arriving now (to drop and count up with) rather than past (to place quietly):
 * the newest, under a head the page had not seen, and of this slot or the one
 * before, as a block reaches the page a second or two into its slot
 */
export function arrivesNow(
  slot: number,
  head: number,
  headMoved: boolean,
  currentSlot: number,
): boolean {
  return headMoved && slot === head && head >= currentSlot - 1
}

/**
 * Whether a batch the page has not had was heard of just now, for the belt
 * to show joining the lane, rather than one heard of while the belt was not
 * followed (a hidden tab, or scrolled away) to put in place quietly
 */
export function heardNow(firstSeenAt: number, now: number): boolean {
  return now - firstSeenAt < HEARD_NOW_FOR
}
/** Seconds after it was heard of that a batch still counts as heard of now; the server takes a fraction of one to pass it on */
const HEARD_NOW_FOR = 3

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
        txHash: batch.txHash,
        waited: batch.waited,
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
    key: batch.key,
    posterIndex: posterIndexOf(batch.projectId),
    blobs: batch.blobs,
    firstSeenAt: batch.firstSeenAt,
  }
}
