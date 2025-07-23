import type { UnixTime } from '@l2beat/shared-pure'

export interface IStatelessProvider {
  switchChain(chain: string): Promise<IStatelessProvider>

  getBlockNumberAtOrBefore(timestamp: UnixTime): Promise<number>
}
