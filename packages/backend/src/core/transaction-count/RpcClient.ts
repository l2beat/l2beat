import { UnixTime } from '@l2beat/types'

export interface RpcClient {
  getBlockNumber(): Promise<number>
  getBlockAtOrBefore(
    timestamp: UnixTime,
    start?: number,
  ): Promise<{ number: number; timestamp: UnixTime }>
  getBlock(number: number): Promise<{
    number: number
    timestamp: number
    transactions: { length: number }
  }>
}
