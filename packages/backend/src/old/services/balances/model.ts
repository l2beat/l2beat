import { SimpleDate } from '@l2beat/common'
import { BigNumber } from 'ethers'

import { PriceSnapshot } from '../prices/model'

export interface TVLAnalysis {
  date: SimpleDate
  blockNumber: number
  prices: PriceSnapshot
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
