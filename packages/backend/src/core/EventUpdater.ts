import { EthereumAddress, Logger, ProjectId } from '@l2beat/common'
import { utils } from 'ethers'

import { ProjectInfo } from '../model/ProjectInfo'
import { EtherscanClient } from '../peripherals/etherscan/EtherscanClient'

interface EventDetail {
  emitter: EthereumAddress
  abi: utils.Interface
  name: string
  projectId: ProjectId
}

export class EventUpdater {
  private events: EventDetail[] = []

  constructor(
    private etherscanClient: EtherscanClient,
    private projects: ProjectInfo[],
    private logger: Logger,
    private fromBlock = 15265346,
    private toBlock = 15275346,
  ) {
    this.logger = this.logger.for(this)

    this.events = this.projects
      .map((project) =>
        project.events.map((event) => ({
          emitter: event.emitter,
          abi: event.abi,
          name: event.name,
          projectId: project.projectId,
        })),
      )
      .flat()
  }

  async update() {
    const events = await this.fetchEvents()
    //save to DB
  }

  private async fetchEvents() {
    const result = []
    for (const { emitter, abi, name, projectId } of this.events) {
      const logs = await this.etherscanClient.getLogs(
        emitter.toString(),
        abi.getEventTopic(name),
        this.fromBlock.toString(),
        this.toBlock.toString(),
      )

      logs.forEach((log) => {
        result.push({
          projectId,
          name,
          blockNumber: log.blockNumber,
          timestamp: log.timeStamp,
        })
      })
    }

    return result
  }
}
