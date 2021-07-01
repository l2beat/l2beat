import { Project } from '@l2beat/config'
import { dateRange } from '../utils'
import { SimpleDate } from '../model/SimpleDate'
import { IBlockInfo } from './BlockInfo/IBlockInfo'

export class DailyBlocks {
  constructor(private blockInfo: IBlockInfo) {}

  async getDailyBlocks(projects: Project[], endDate: SimpleDate) {
    const earliestBlock = getEarliestBlock(projects)
    const earliestDate = await this.blockInfo.getBlockDate(earliestBlock)
    const dates = dateRange(earliestDate, endDate)
    return Promise.all(
      dates.map(async (date) => ({
        date,
        block: await this.blockInfo.getMaxBlock(date),
      }))
    )
  }
}

function getEarliestBlock(projects: Project[]) {
  let earliestBlock = Infinity
  for (const project of projects) {
    for (const bridge of project.bridges) {
      if (bridge.sinceBlock < earliestBlock) {
        earliestBlock = bridge.sinceBlock
      }
    }
  }
  if (earliestBlock === Infinity) {
    throw new Error('No earliest block!')
  }
  return earliestBlock
}
