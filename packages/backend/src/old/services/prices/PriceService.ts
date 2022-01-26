import { SimpleDate } from '@l2beat/common'

import { ProjectInfo } from '../../../model'
import { BlockInfo } from '../BlockInfo'
import { ExchangeInfo } from '../ExchangeAddresses'
import { MulticallApi } from '../multicall'
import { FetchedPrices } from './model'
import { getMulticallCalls, getTokens, parseMulticallResults } from './utils'

export class PriceService {
  constructor(
    private multicallApi: MulticallApi,
    private blockInfo: BlockInfo
  ) {}

  async getPricesForDate(
    projects: ProjectInfo[],
    exchanges: Record<string, ExchangeInfo>,
    date: SimpleDate
  ) {
    const blockNumber = await this.blockInfo.getMaxBlock(date)
    return this.getPrices(projects, exchanges, blockNumber)
  }

  async getPrices(
    projects: ProjectInfo[],
    exchanges: Record<string, ExchangeInfo>,
    blockNumber: number
  ): Promise<FetchedPrices> {
    const tokens = getTokens(projects, blockNumber)
    const calls = getMulticallCalls(tokens, exchanges, blockNumber)
    const results = await this.multicallApi.multicall(calls, blockNumber)
    return parseMulticallResults(results)
  }
}
