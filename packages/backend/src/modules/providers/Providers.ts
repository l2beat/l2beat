import { TxsCountProvider } from '../activity/indexers/types'
import { BlockTimestampProvider } from '../tvl/services/BlockTimestampProvider'
import { ActivityProviders } from './ActivityProviders'

export class Providers {
  constructor(private readonly activity: ActivityProviders) {}

  getTxsCountProvider(chain: string): TxsCountProvider {
    return this.activity.getTxsCountProvider(chain)
  }

  getBlockTimestampProvider(chain: string): BlockTimestampProvider {
    return this.activity.getBlockTimestampProvider(chain)
  }
}
