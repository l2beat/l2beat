import { BigNumber } from 'ethers'
import { ProjectInfo } from '../../model/ProjectInfo'
import { FetchedBalances, FetchedPrices, TVLAnalysis } from './model'
import {
  getAggregateTVL,
  getHolders,
  getProjectStats,
  getProjectTVL,
} from './utils'

export class TVLAnalyzer {
  async getTVL(
    projects: ProjectInfo[],
    blockNumber: number
  ): Promise<TVLAnalysis> {
    const { tokenHolders, ethHolders } = getHolders(projects, blockNumber)
    const { balances, prices } = await this.fetchBalancesAndPrices(
      tokenHolders,
      ethHolders,
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
    blockNumber: number
  ): Promise<{ balances: FetchedBalances; prices: FetchedPrices }> {
    const tokenBalances: Record<string, Record<string, BigNumber>> = {}
    const ethBalances: Record<string, BigNumber> = {}
    const tokenPrices: Record<string, BigNumber> = {}
    const ethPrice: BigNumber = BigNumber.from(0)
    return {
      balances: {
        token: tokenBalances,
        eth: ethBalances,
      },
      prices: {
        token: tokenPrices,
        eth: ethPrice,
      },
    }
  }
}
