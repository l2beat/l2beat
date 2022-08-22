import { UnixTime } from '@l2beat/types'

export interface ProjectBridge {
  /** Address of the bridge. Use etherscan to verify its correctness. */
  address: string
  /** Timestamp of the deployment transaction of the bridge contract. */
  sinceTimestamp: UnixTime
  /** List of token tickers (e.g. ETH, DAI) to track. Use '*' for all tokens */
  tokens: string[] | '*'
}
