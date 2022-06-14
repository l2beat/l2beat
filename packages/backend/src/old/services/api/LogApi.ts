import { Logger } from '@l2beat/common'

import { AlchemyApi, LogFilter } from './AlchemyApi'

export class LogApi {
  constructor(private alchemyApi: AlchemyApi, private logger: Logger) {}

  async getLogs(
    filter: LogFilter,
    loggerLabel = `${filter.fromBlock} - ${filter.toBlock}`,
  ) {
    const ranges = []
    let rangeEnd = filter.fromBlock - 1
    while (rangeEnd !== filter.toBlock) {
      const rangeStart = rangeEnd + 1
      rangeEnd = Math.min(rangeStart + 2_000, filter.toBlock)
      ranges.push({ fromBlock: rangeStart, toBlock: rangeEnd })
    }

    const total = ranges.length
    let i = 0
    const logRanges = await Promise.all(
      ranges.map(async (range) => {
        const result = await this.alchemyApi.getLogs({ ...filter, ...range })
        i++
        this.logger.info(`Got logs: ${loggerLabel} (${i}/${total})`)
        return result
      }),
    )
    return logRanges.flat()
  }
}
