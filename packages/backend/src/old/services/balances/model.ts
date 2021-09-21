import { BigNumber } from 'ethers'

import { SimpleDate } from '../../model'

export interface TVLAnalysis {
  date: SimpleDate
  blockNumber: number
  prices: FetchedPrices
  TVL: AggregateTVL
  projects: Record<string, ProjectTVL>
}

export interface ProjectTVL {
  TVL: AggregateTVL
  tokens: Record<string, TokenTVL>
}

export interface AggregateTVL {
  usd: number
  eth: number
}

export interface TokenTVL {
  balance: number
  usd: number
}

export interface FetchedBalances {
  // address -> holder -> balance
  token: Record<string, Record<string, BigNumber | undefined> | undefined>
  // holder -> balance
  eth: Record<string, BigNumber | undefined>
}

export interface FetchedPrices {
  // address -> price
  token: Record<string, BigNumber | undefined>
  eth: BigNumber
}
