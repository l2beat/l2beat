/** One UTC day. Amounts are in ETH. */
export interface EthSupplyDay {
  timestamp: number
  /** At the end of the day */
  totalSupply: number
  /** Net consensus-layer issuance: validator rewards less penalties */
  issuance: number
  /** EIP-1559 base fees and EIP-4844 blob fees */
  burn: number
  /** At the start of the day */
  ethPriceUsd: number | null
}

export interface EthSupplyOverview {
  /** Consecutive days, oldest first */
  days: EthSupplyDay[]
  staking?: {
    timestamp: number
    ethStaked: number
    /** Annualised over the previous 30 days */
    networkYield: number | null
  }
}

export type SlotStatus = 'finalized' | 'justified' | 'proposed' | 'missed'

export interface LiveChain {
  headSlot: number
  /** Epochs from the last finalized checkpoint to the head */
  finalityLagEpochs: number
  /** False when the stored head is more than a few slots old */
  live: boolean
  /** The latest slots up to the head, oldest first */
  slots: { slot: number; status: SlotStatus }[]
}
