export interface RpcClient {
  getBlockNumber(): Promise<number>
  getBlock(number: number): Promise<{
    number: number
    timestamp: number
    transactions: { length: number }
  }>
}
