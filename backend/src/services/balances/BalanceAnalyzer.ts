import { ProjectInfo, SimpleDate } from '../../model'
import { BlockInfo } from '../BlockInfo'
import { ExchangeInfo } from '../ExchangeAddresses'
import { MulticallApi } from '../multicall'
import { FetchedBalances, FetchedPrices, TVLAnalysis } from './model'
import {
  getAggregateTVL,
  getHolders,
  getProjectStats,
  getProjectTVL,
} from './utils'
import { getMulticallCalls } from './utils/getMulticallCalls'
import { parseMulticallResults } from './utils/parseMulticallResults'

export class BalanceAnalyzer {
  constructor(
    private multicallApi: MulticallApi,
    private blockInfo: BlockInfo
  ) {}

  async getTVLByDate(
    projects: ProjectInfo[],
    exchanges: Record<string, ExchangeInfo>,
    date: SimpleDate
  ) {
    const block = await this.blockInfo.getMaxBlock(date)
    return this.getTVL(projects, exchanges, block)
  }

  async getTVL(
    projects: ProjectInfo[],
    exchanges: Record<string, ExchangeInfo>,
    blockNumber: number
  ): Promise<TVLAnalysis> {
    const { tokenHolders, ethHolders } = getHolders(projects, blockNumber)
    const { balances, prices } = await this.fetchBalancesAndPrices(
      tokenHolders,
      ethHolders,
      exchanges,
      blockNumber
    )
    const projectStats = getProjectStats(projects, balances, prices)
    const projectTVL = getProjectTVL(projectStats)
    return {
      TVL: getAggregateTVL(projectStats, prices),
      projects: projectTVL,
    }
  }

  private async fetchBalancesAndPrices(
    tokenHolders: Record<string, string[]>,
    ethHolders: string[],
    exchanges: Record<string, ExchangeInfo>,
    blockNumber: number
  ): Promise<{ balances: FetchedBalances; prices: FetchedPrices }> {
    const calls = getMulticallCalls(
      tokenHolders,
      ethHolders,
      exchanges,
      blockNumber
    )
    const results = await this.multicallApi.multicall(calls, blockNumber)
    return parseMulticallResults(results)
  }
}
