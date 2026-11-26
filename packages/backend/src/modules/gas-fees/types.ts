import type { UnixTime } from '@l2beat/shared-pure'

export interface GasFeesConfig {
  /** Daily fees per chain, from Dune */
  fees: {
    /** The first day stored. Every day after it costs 0.3 to 0.5 Dune credits */
    firstDay: UnixTime
    /** Contiguous days read per Dune query, as its cost is mostly per query */
    daysPerQuery: number
  }
  /**
   * The first day of the daily statistics graded against our hourly tips. The
   * tips start a day earlier, as some transactions landing on a day were sent the day before
   */
  historyFirstDay: UnixTime
  /** Whether to poll MetaMask's and Rabby's fee services. Ambire's rule runs on our node either way */
  walletServices: boolean
}

/** Finds the last Ethereum block at or before a timestamp */
export interface BlockFinder {
  getBlockNumberAtOrBefore(timestamp: UnixTime): Promise<number>
}
