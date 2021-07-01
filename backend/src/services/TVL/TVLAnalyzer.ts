import { ProjectInfo } from '../../model/ProjectInfo'
import { MulticallApi } from '../api/MulticallApi'
import { ExchangeInfo } from '../ExchangeAddresses'
import { FetchedBalances, FetchedPrices, TVLAnalysis } from './model'
import {
  getAggregateTVL,
  getHolders,
  getProjectStats,
  getProjectTVL,
} from './utils'
import { getMulticallCalls } from './utils/getMulticallCalls'
import { parseMulticallResults } from './utils/parseMulticallResults'

export class TVLAnalyzer {
  constructor(private multicallApi: MulticallApi) {}

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

  async fetchBalancesAndPrices(
    tokenHolders: Record<string, string[]>,
    ethHolders: string[],
    exchanges: Record<string, ExchangeInfo>,
    blockNumber: number
  ): Promise<{ balances: FetchedBalances; prices: FetchedPrices }> {
    const calls = getMulticallCalls(tokenHolders, ethHolders, exchanges)
    const results = await this.multicallApi.multicall(calls, blockNumber)
    return parseMulticallResults(results)
  }
}
