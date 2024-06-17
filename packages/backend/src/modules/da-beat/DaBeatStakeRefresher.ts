import {
  BlockchainDaLayer,
  DaEconomicSecurityType,
  DaLayer,
  daLayers,
} from '@l2beat/config'
import { compact } from 'lodash'
import { EthereumStakeAnalyzer } from './stake-analyzers/EthereumStakeAnalyzer'
import { CelestiaStakeAnalyzer } from './stake-analyzers/CelestiaStakeAnalyzer'
import { Peripherals } from '../../peripherals/Peripherals'
import { TendermintClient } from '../../peripherals/tendermint/TendermintClient'
import { QuickNodeClient } from '../../peripherals/quicknode/QuickNodeClient'
import { Clock } from '../../tools/Clock'
import { Logger } from '@l2beat/backend-tools'
import { DABeatConfig } from '../../config/Config'
import { assertUnreachable } from '@l2beat/shared-pure'
import { AbstractStakeAnalyzer } from './stake-analyzers/AbstractStakeAnalyzer'
import { TaskQueue } from '../../tools/queue/TaskQueue'

export class DaBeatStakeRefresher {
  private readonly refreshQueue: TaskQueue<void>
  private readonly analyzers: Record<
    DaEconomicSecurityType,
    AbstractStakeAnalyzer
  >
  constructor(
    private readonly peripherals: Peripherals,
    private readonly config: DABeatConfig,
    private readonly clock: Clock,
    private readonly logger: Logger,
  ) {
    this.logger = logger.for('DaBeatStakeRefresher')
    this.refresh = this.refresh.bind(this)
    this.analyzers = Object.fromEntries(
      [
        ...new Set(
          compact(
            daLayers
              .filter(this.isBlockchainDaLayer)
              .map((layer) => layer.economicSecurity?.type),
          ),
        ),
      ].map((type) => {
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
          default:
            assertUnreachable(type)
        }
      }),
    )
    this.refreshQueue = new TaskQueue<void>(
      async () => {
        this.logger.info('Refresh started')
        await this.refresh()
        this.logger.info('Refresh finished')
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
          this.logger.info(`Stake data for ${type} refreshed`)
          await database.stake.upsert({
            id: type,
            totalStake,
            thresholdStake,
          })
        } catch (e) {
          this.logger.error(`Failed to refresh stake data for ${type}: ${e}`)
        }
      }),
    )

    this.logger.info('All stake data refreshed')
  }

  start() {
    this.clock.onNewDay(() => this.refreshQueue.addIfEmpty())
    this.refreshQueue.addIfEmpty()
  }

  private isBlockchainDaLayer(layer: DaLayer): layer is BlockchainDaLayer {
    return layer.kind === 'PublicBlockchain'
  }
}
