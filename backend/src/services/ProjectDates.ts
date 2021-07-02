import { ProjectInfo, SimpleDate } from '../model'
import { dateRange } from '../utils'
import { BlockInfo } from './BlockInfo'

export class ProjectDates {
  constructor(private blockInfo: BlockInfo) {}

  async getDateRanges(projects: ProjectInfo[], endDate: SimpleDate) {
    const earliestBlock = getEarliestBlock(projects)
    const earliestDate = await this.blockInfo.getBlockDate(earliestBlock)
    return dateRange(earliestDate, endDate)
  }
}

function getEarliestBlock(projects: ProjectInfo[]) {
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
