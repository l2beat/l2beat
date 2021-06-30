import { Project } from '@l2beat/config'
import { BigNumber } from 'ethers'
import {
  getAggregateTVL,
  getHolders,
  getProjectStats,
  getProjectTVL,
} from './utils'
import { FetchedBalances, FetchedPrices, TVLAnalysis } from './model'

export class TVLAnalyzer {
  async getTVL(projects: Project[], blockNumber: number): Promise<TVLAnalysis> {
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
