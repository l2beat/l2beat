/**
 * The shape the page reads Ethereum's head in. The prototype fills it from a
 * simulation; the real one will come from the single Ethereum head stream, so
 * variants must read only through these types.
 */

export interface HeadBlock {
  slot: number
  /** Unix seconds at the start of the slot */
  timestamp: number
  status: 'proposed' | 'missed'
  /** Undefined for a missed slot */
  number: number | undefined
  hash: string | undefined
  proposerIndex: number
  gasUsed: number
  gasLimit: number
  baseFeeGwei: number
  /** Median priority fee of the block's transactions */
  priorityFeeGwei: number
  txCount: number
  uopsCount: number
  blobs: PosterBlobs[]
  blobCount: number
  blobBaseFeeWei: number
  /** Base fee and blob fee burned in this block */
  burnedEth: number
  /** Consensus-layer issuance credited to this slot */
  issuedEth: number
  ethPriceUsd: number
}

export interface PosterBlobs {
  posterId: string
  blobs: number
}

export interface Reorg {
  slot: number
  depth: number
  replaced: HeadBlock
  by: HeadBlock
  /** Unix ms when the page learned of it */
  seenAt: number
}

/** Running totals since 00:00 UTC, the partial day the history charts end on */
export interface TodaySoFar {
  startedAt: number
  slots: number
  blocks: number
  missed: number
  blobs: number
  txs: number
  uops: number
  gasUsed: number
  burnedEth: number
  issuedEth: number
  priorityFeesEth: number
}

export interface BlockLimits {
  targetBlobs: number
  maxBlobs: number
  gasLimit: number
  gasTarget: number
}

export type HeadStatus = 'connecting' | 'live' | 'reconnecting'

export interface EthereumHead {
  status: HeadStatus
  /** Undefined until the first block arrives */
  head: HeadBlock | undefined
  /** Oldest first, the last `HEAD_WINDOW` slots */
  blocks: HeadBlock[]
  finalizedSlot: number | undefined
  /** Execution block number of the finalized slot */
  finalizedBlock: number | undefined
  justifiedSlot: number | undefined
  lastReorg: Reorg | undefined
  today: TodaySoFar | undefined
  supplyEth: number | undefined
  /** Changes per epoch, not per block */
  stakedEth: number | undefined
  activeValidators: number | undefined
  /** Unix ms when the next slot starts */
  nextSlotAt: number | undefined
  limits: BlockLimits
}
