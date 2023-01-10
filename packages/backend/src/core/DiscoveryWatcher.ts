import { Logger, MainnetEtherscanClient, TaskQueue } from '@l2beat/common'
import { providers } from 'ethers'

import { DiscordClient } from '../peripherals/discord/DiscordClient'
import { Clock } from './Clock'
import { ConfigReader } from './discovery/ConfigReader'
import { discover } from './discovery/discover'
import { DiscoveryLogger } from './discovery/DiscoveryLogger'
import { DiscoveryProvider } from './discovery/provider/DiscoveryProvider'

export class DiscoveryWatcher {
  private readonly taskQueue: TaskQueue<void>

  constructor(
    private readonly provider: providers.AlchemyProvider,
    private readonly etherscanClient: MainnetEtherscanClient,
    private readonly discordClient: DiscordClient | undefined,
    private readonly configReader: ConfigReader,
    private readonly clock: Clock,
    private readonly logger: Logger,
    private readonly discoveryLogger: DiscoveryLogger,
  ) {
    this.logger = this.logger.for(this)
    this.taskQueue = new TaskQueue(
      () => this.update(),
      this.logger.for('taskQueue'),
    )
  }

  start() {
    this.taskQueue.addToFront()
    this.logger.info('Started')
    return this.clock.onNewHour(() => {
      this.taskQueue.addToFront()
    })
  }

  async update() {
    // TODO: get block number based on clock time
    const blockNumber = await this.provider.getBlockNumber()
    this.logger.info('Update started', { blockNumber })

    const discoveryProvider = new DiscoveryProvider(
      this.provider,
      this.etherscanClient,
      blockNumber,
    )

    const projectConfigs = await this.configReader.readAllConfigs()

    for (const projectConfig of projectConfigs) {
      this.logger.info('Discovery started', { project: projectConfig.name })

      try {
        await discover(discoveryProvider, projectConfig, this.discoveryLogger)
        this.logger.info('Discovery finished', { project: projectConfig.name })
      } catch (error) {
        this.logger.error(error)
      }
    }

    await this.notify(
      `Run discovery for all projects | block_number = ${blockNumber}`,
    )

    this.logger.info('Update finished', { blockNumber })
  }

  async notify(message: string) {
    if (!this.discordClient) {
      // TODO: maybe only once? rethink
      this.logger.info(
        'DiscordClient not setup, notification has not been sent. Did you provide correct .env variables?',
      )
      return
    }

    await this.discordClient.sendMessage(message).then(
      () => this.logger.info('Notification to Discord has been sent'),
      (e) => this.logger.error(e),
    )
  }
}
