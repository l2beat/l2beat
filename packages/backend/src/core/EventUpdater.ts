import {
  EthereumAddress,
  Logger,
  ProjectId,
  TaskQueue,
  UnixTime,
} from '@l2beat/common'
import { utils } from 'ethers'

import { ProjectInfo } from '../model/ProjectInfo'
import {
  EventRecord,
  EventRepository,
} from '../peripherals/database/EventRepository'
import { EtherscanClient } from '../peripherals/etherscan/EtherscanClient'
import { BlockNumberUpdater } from './BlockNumberUpdater'
import { Clock } from './Clock'

interface EventDetail {
  emitter: EthereumAddress
  abi: utils.Interface
  name: string
  projectId: ProjectId
}
//TODO
// add status to avoid additional work on the data
export class EventUpdater {
  private events: EventDetail[] = []
  private taskQueue = new TaskQueue(this.update.bind(this), this.logger)

  constructor(
    private etherscanClient: EtherscanClient,
    private blockNumberUpdater: BlockNumberUpdater,
    private eventRepository: EventRepository,
    private clock: Clock,
    private projects: ProjectInfo[],
    private logger: Logger,
    private minimumBlockNumber = 15265346,
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

  start() {
    return this.clock.onEveryHour((timestamp) => {
      this.taskQueue.addToFront(timestamp)
    })
  }

  async update(timestamp: UnixTime) {
    const latestBlockNumber =
      await this.blockNumberUpdater.getBlockNumberWhenReady(timestamp)

    const events = await this.fetchEvents(Number(latestBlockNumber))
    this.minimumBlockNumber = Number(latestBlockNumber) + 1
    await this.eventRepository.addMany(events)
  }

  private async fetchEvents(toBlock: number) {
    this.logger.info('fetching events', {from: this.minimumBlockNumber.toString(), to: toBlock.toString()})

    const result: EventRecord[] = []
    for (const { emitter, abi, name, projectId } of this.events) {
      const logs = await this.etherscanClient.getLogs(
        emitter.toString(),
        abi.getEventTopic(name),
        this.minimumBlockNumber.toString(),
        toBlock.toString(),
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
