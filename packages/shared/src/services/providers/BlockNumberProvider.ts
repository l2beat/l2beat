import { ChainId, UnixTime } from '@l2beat/shared-pure'

export interface BlockNumberProvider {
  getChainId(): ChainId
  getBlockNumberAtOrBefore(timestamp: UnixTime): Promise<number>
}
