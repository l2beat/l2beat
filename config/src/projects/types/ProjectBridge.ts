export interface ProjectBridge {
  /** Address of the bridge. Use etherscan to verify its correctness. */
  address: string
  /** Block number of the deployment transaction of the bridge contract. */
  sinceBlock: number
  /** List of token tickers (e.g. ETH, DAI) to track. */
  tokens: string[]
}
