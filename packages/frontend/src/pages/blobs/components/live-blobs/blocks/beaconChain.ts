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

/**
 * Whether the block held for a slot is still the one the server has there.
 * The chain can drop a block shortly after it came, and its slot then holds
 * none, or another one
 */
export function isSameBlock(
  held: ChainBlock | undefined,
  block: LiveBlock,
): boolean {
  if (!held || held.status !== block.status) return false
  return (
    held.status === 'missed' ||
    (block.status === 'proposed' && held.blockNumber === block.blockNumber)
  )
}

/**
 * Whether a block the page has not had is arriving now, for the belt to drop
 * and the numbers to count up with, rather than one from the past to put in
 * place quietly: the newest the server has, come with a head the page had
 * not seen (not fetched late under one it had), and of this slot or the one
 * before, as a block reaches the page a second or two into its slot and the
 * clock may run a little ahead
 */
export function arrivesNow(
  slot: number,
  head: number,
  headMoved: boolean,
  currentSlot: number,
): boolean {
  return headMoved && slot === head && head >= currentSlot - 1
}

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
