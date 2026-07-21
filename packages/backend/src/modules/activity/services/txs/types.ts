export interface ActivityBlock {
  number: number
  timestamp: number
  txsCount: number
  uopsCount: number | null
}

export interface ActivityBlockProvider {
  chain: string
  getBlocks(from: number, to: number): Promise<ActivityBlock[]>
}
