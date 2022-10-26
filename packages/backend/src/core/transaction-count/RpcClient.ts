import { UnixTime } from '@l2beat/types'

export interface RpcClient {
  getBlockNumber(): Promise<number>
  getBlockNumberAtOrBefore(timestamp: UnixTime, start?: number): Promise<number>
  getBlock(number: number): Promise<{
    number: number
    timestamp: number
    transactions: { length: number }
  }>
}
