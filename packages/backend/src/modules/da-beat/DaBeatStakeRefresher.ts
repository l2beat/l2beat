import type { Logger } from '@l2beat/backend-tools'
import { HttpClient } from '@l2beat/shared'
import type { DaBeatConfig } from '../../config/Config'
import type { Peripherals } from '../../peripherals/Peripherals'
import { QuickNodeClient } from '../../peripherals/quicknode/QuickNodeClient'
import { TendermintClient } from '../../peripherals/tendermint/TendermintClient'
import type { Clock } from '../../tools/Clock'
import { TaskQueue } from '../../tools/queue/TaskQueue'
import type { AbstractStakeAnalyzer } from './stake-analyzers/AbstractStakeAnalyzer'
import { AvailClient } from './stake-analyzers/avail/AvailClient'
import { AvailStakeAnalyzer } from './stake-analyzers/avail/AvailStakeAnalyzer'
import { CelestiaStakeAnalyzer } from './stake-analyzers/CelestiaStakeAnalyzer'
import { EthereumStakeAnalyzer } from './stake-analyzers/EthereumStakeAnalyzer'
import { NearStakeAnalyzer } from './stake-analyzers/NearStakeAnalyzer'

export class DaBeatStakeRefresher {
  private readonly refreshQueue: TaskQueue<void>
  private readonly analyzers: Record<string, AbstractStakeAnalyzer>
  constructor(
    private readonly peripherals: Peripherals,
    private readonly config: DaBeatConfig,
    private readonly clock: Clock,
    private readonly logger: Logger,
  ) {
    const httpClient = new HttpClient()
    this.logger = logger.for('DaBeatStakeRefresher')
    this.refresh = this.refresh.bind(this)
    this.analyzers = Object.fromEntries(
      config.types.map((type) => {
        switch (type) {
          case 'Ethereum':
            return [
              type,
              new EthereumStakeAnalyzer(
                this.peripherals.getClient(QuickNodeClient, {
                  url: this.config.quicknodeApiUrl,
                  callsPerMinute: this.config.quicknodeCallsPerMinute,
                }),
              ),
            ]
          case 'Celestia':
            return [
              type,
              new CelestiaStakeAnalyzer(
                this.peripherals.getClient(TendermintClient, {
                  url: this.config.celestiaApiUrl,
                  callsPerMinute: this.config.celestiaCallsPerMinute,
                }),
              ),
            ]
          case 'Near':
            return [
              type,
              new NearStakeAnalyzer(this.config.nearRpcUrl, httpClient),
            ]
          case 'Avail':
            return [
              type,
              new AvailStakeAnalyzer(
                this.peripherals.getClient(AvailClient, {
                  url: this.config.availWsUrl,
                }),
              ),
            ]
          default:
            throw new Error(`Unsupported economic security: ${type}`)
        }
      }),
    )
    this.refreshQueue = new TaskQueue<void>(
      async () => {
        this.logger.info('Refresh started', {
          types: Object.keys(this.analyzers),
        })
        await this.refresh()
        this.logger.info('Refresh finished', {
          types: Object.keys(this.analyzers),
        })
      },
      this.logger.for('refreshQueue'),
      { metricsId: 'DaBeatStakeRefresher' },
    )
  }

  async refresh() {
    const { database } = this.peripherals

    this.logger.info('Refreshing all stake data')

    await Promise.allSettled(
      Object.entries(this.analyzers).map(async ([type, analyzer]) => {
        try {
          const { totalStake, thresholdStake } = await analyzer.analyze()
          this.logger.info('Stake data refreshed', {
            type,
            totalStake,
            thresholdStake,
          })
          await database.stake.upsert({
            id: type,
            totalStake,
            thresholdStake,
          })
        } catch (e) {
          this.logger.error(`Failed to refresh stake data: ${e}`, {
            type,
          })
        }
      }),
    )

    this.logger.info('All stake data refreshed')
  }

  start() {
    this.clock.onNewDay(() => this.refreshQueue.addIfEmpty())
    this.refreshQueue.addIfEmpty()
  }
}
