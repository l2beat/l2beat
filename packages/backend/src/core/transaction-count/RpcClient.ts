export interface RpcClient {
  getBlockNumber(): Promise<bigint>
  getBlock(number: number): Promise<{
    number: number
    timestamp: number
    transactions: { length: number }
  }>
}
