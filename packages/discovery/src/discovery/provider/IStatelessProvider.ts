import type { UnixTime } from '@l2beat/shared-pure'
import type { providers } from 'ethers'

export interface IStatelessProvider {
  switchChain(chain: string): Promise<IStatelessProvider>

  getBlockNumberAtOrBefore(timestamp: UnixTime): Promise<number>
  getBlock(blockNumber: number): Promise<providers.Block | undefined>
}
