import { Logger, MainnetEtherscanClient, TaskQueue } from '@l2beat/common'
import { providers } from 'ethers'

import { DiscordClient } from '../peripherals/discord/DiscordClient'
import { Clock } from './Clock'
import { ConfigReader } from './discovery/ConfigReader'
import { discover } from './discovery/discover'
import { DiscoveryProvider } from './discovery/provider/DiscoveryProvider'

export class WatchModeUpdater {
  private readonly taskQueue: TaskQueue<void>

  constructor(
    private readonly provider: providers.AlchemyProvider,
    private readonly etherscanClient: MainnetEtherscanClient,
    private readonly discordClient: DiscordClient | undefined,
    private readonly clock: Clock,
    private readonly logger: Logger,
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
    const blockNumber = await this.provider.getBlockNumber()
    this.logger.info('Update started', { blockNumber })

    const discoveryProvider = new DiscoveryProvider(
      this.provider,
      this.etherscanClient,
      blockNumber,
    )

    const configReader = new ConfigReader()

    const projectConfigs = configReader.readAllConfigs()

    for (const projectConfig of projectConfigs) {
      await discover(discoveryProvider, projectConfig)
      this.logger.info('Discovery performed', { project: projectConfig.name })
    }

    if (this.discordClient) {
      await this.discordClient.sendMessage(
        `Run discovery for all projects | block_number = ${blockNumber}`,
      )
      this.logger.info('Notification to Discord has been sent')
    } else {
      this.logger.info(
        'DiscordClient not setup, notification has not been sent. Did you provide correct .env variables?',
      )
    }

    this.logger.info('Update finished', { blockNumber })
  }
}
