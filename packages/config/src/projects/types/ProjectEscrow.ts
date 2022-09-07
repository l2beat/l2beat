import { UnixTime } from '@l2beat/types'

export interface ProjectEscrow {
  /** Address of the escrow. Use etherscan to verify its correctness. */
  address: string
  /** Timestamp of the deployment transaction of the escrow contract. */
  sinceTimestamp: UnixTime
  /** List of token tickers (e.g. ETH, DAI) to track. Use '*' for all tokens */
  tokens: string[] | '*'
}
