import type { AdjustCount } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import { assert, assertUnreachable } from '@l2beat/shared-pure'
import type { ActivityConfig } from '../../config/Config'
import type { Providers } from '../../providers/Providers'
import type { BlockTimestampProvider } from '../tvl/services/BlockTimestampProvider'
import type { TxsCountService } from './indexers/types'
import { BlockTxsCountService } from './services/txs/BlockTxsCountService'
import { DayTxsCountService } from './services/txs/DayTxsCountService'

export class ActivityDependencies {
  constructor(
    private readonly config: ActivityConfig,
    readonly database: Database,
    private readonly providers: Providers,
  ) {}

  getTxsCountService(chain: string): TxsCountService {
    const project = this.config.projects.find((p) => p.chainName === chain)
    assert(project, `Project ${chain} not found`)

    switch (project.activityConfig.type) {
      case 'block': {
        const provider = this.providers.block.getBlockProvider(chain)
        const analyzer = this.providers.uops.getUopsAnalyzer(chain)
        return new BlockTxsCountService({
          provider,
          projectId: project.id,
          assessCount: assesCount(project.activityConfig.adjustCount),
          uopsAnalyzer: analyzer,
        })
      }
      case 'day': {
        const provider = this.providers.day.getDayProvider(chain)
        return new DayTxsCountService(provider, project.id)
      }
      default:
        assertUnreachable(project.activityConfig)
    }
  }

  getBlockTimestampProvider(chain: string): BlockTimestampProvider {
    return this.providers.block.getBlockTimestampProvider(chain)
  }
}

function assesCount(
  adjustCount: AdjustCount | undefined,
): (count: number, block: number) => number {
  if (!adjustCount) {
    return (count) => count
  }
  if (adjustCount.type === 'SubtractOne') {
    return (count) => count - 1
  }
  if (adjustCount.type === 'SubtractOneSinceBlock') {
    return (count: number, block: number) =>
      block >= adjustCount.blockNumber ? count - 1 : count
  }
  throw new Error('Unknown config for adjustCount')
}
