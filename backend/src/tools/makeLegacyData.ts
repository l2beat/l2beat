import { BigNumber } from '@ethersproject/bignumber'
import { getTokenBySymbol, projects } from '@l2beat/config'
import { utils } from 'ethers'
import { SimpleDate } from '../model'
import { TVLAnalysis } from '../services/balances/model'
import { BridgeTVL } from '../services/ValueLockedChecker'
import { PriceFunction } from './getTokenPrices'

interface LegacyData {
  TVL: number
  data: DateEntry[]
  l2s: {
    [name: string]: L2Entry
  }
}

interface L2Entry {
  TVL: number
  data: DateEntry[]
}

interface DateEntry {
  date: string
  usd: number
}

interface InputEntry {
  date: SimpleDate
  balances: TVLAnalysis
}

export function makeLegacyData(entries: InputEntry[]): LegacyData {
  const TVL = entries[entries.length - 1].balances.TVL.usd
  const data = entries.map((entry) => ({
    date: entry.date.toString(),
    usd: entry.balances.TVL.usd,
  }))
  const l2s: Record<string, L2Entry> = {}
  for (const { name } of projects) {
    const data = entries.map((entry) => ({
      date: entry.date.toString(),
      usd: entry.balances.projects[name].TVL.usd,
    }))
    l2s[name] = {
      TVL: data[data.length - 1].usd,
      data: skipBeginningZeroes(data),
    }
  }
  return {
    TVL,
    data: skipBeginningZeroes(data),
    l2s,
  }
}

function skipBeginningZeroes (data: DateEntry[]) {
  const result = []
  let nonZeroFound = false
  for (const entry of data) {
    if (entry.usd !== 0 || nonZeroFound) {
      nonZeroFound = true
      result.push(entry)
    }
  }
  return result
}