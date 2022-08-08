import { Logger } from '@l2beat/common'

import { ProjectInfo } from '../../model'
import { EthereumClient } from '../../peripherals/ethereum/EthereumClient'
import { EtherscanClient } from '../../peripherals/etherscan/EtherscanClient'

export class EventUpdater {
  constructor(
    private etherscanClient: EtherscanClient,
    private ethereumClient: EthereumClient,
    private projects: ProjectInfo[],
    private logger: Logger,
  ) {
    this.logger = this.logger.for(this)
  }

  async fetchStateUpdates() {
    for (const project of this.projects) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (project.events?.state) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const event = project.events.state

        // const logs = await this.ethereumClient.getLogs(
        //   // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        //   event.emitter,
        //   // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        //   [event.abi.getEventTopic(event.name)],
        //   15265346,
        //   15275446,
        // )

        // const output = Promise.allSettled(
        //   logs.map(async (log) => {
        //     const block = await this.ethereumClient.getBlock(log.blockNumber)
        //     return {
        //       blockNumber: log.blockNumber,
        //       timestamp: block.timestamp,
        //       project: project.projectId,
        //       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        //       event: event.name,
        //     }
        //   }),
        // )

        const logsEtherscan = await this.etherscanClient.call(
          'logs',
          'getLogs',
          {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            address: event.emitter.toString(),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
            topic0: event.abi.getEventTopic(event.name),
            fromBlock: '15265346',
            toBlock: '15275446',
          },
        )

        console.log(logsEtherscan.length)

        return logsEtherscan
      }
    }
  }
}
