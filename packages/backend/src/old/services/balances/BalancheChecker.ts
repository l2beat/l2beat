import { SimpleDate } from '@l2beat/common'

import { ProjectInfo } from '../../../model'
import { BlockInfo } from '../BlockInfo'
import { MulticallApi } from '../multicall'
import { PriceSnapshot } from '../prices/model'
import { FetchedBalances, TVLAnalysis } from './model'
import {
  getAggregateTVL,
  getHolders,
  getProjectStats,
  getProjectTVL,
} from './utils'
import { getMulticallCalls } from './utils/getMulticallCalls'
import { parseMulticallResults } from './utils/parseMulticallResults'

export class BalanceChecker {
  constructor(
    private multicallApi: MulticallApi,
    private blockInfo: BlockInfo
  ) {}

  async getStatsForDate(
    projects: ProjectInfo[],
    prices: PriceSnapshot,
    date: SimpleDate
  ): Promise<TVLAnalysis> {
    const blockNumber = await this.blockInfo.getMaxBlock(date)
    const stats = await this.getTVL(projects, prices, blockNumber)
    return { date, blockNumber, ...stats }
  }

  async getTVL(
    projects: ProjectInfo[],
    prices: PriceSnapshot,
    blockNumber: number
  ) {
    const { tokenHolders, ethHolders } = getHolders(projects, blockNumber)
    const balances = await this.fetchBalances(
      tokenHolders,
      ethHolders,
      blockNumber
    )
    const projectStats = getProjectStats(projects, balances, prices)
    const projectTVL = getProjectTVL(projectStats)
    return {
      TVL: getAggregateTVL(projectStats, prices),
      projects: projectTVL,
      prices,
    }
  }

  private async fetchBalances(
    tokenHolders: Record<string, string[]>,
    ethHolders: string[],
    blockNumber: number
  ): Promise<FetchedBalances> {
    const calls = getMulticallCalls(tokenHolders, ethHolders)
    const results = await this.multicallApi.multicall(calls, blockNumber)
    return parseMulticallResults(results)
  }
}
