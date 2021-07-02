import { SimpleDate } from '../model'
import { TVLAnalysis } from '../services/balances/model'

export interface LegacyData {
  TVL: number
  data: DateEntry[]
  l2s: {
    [name: string]: L2Entry
  }
}

export interface L2Entry {
  TVL: number
  data: DateEntry[]
}

export interface DateEntry {
  date: string
  usd: number
}

interface InputEntry {
  date: SimpleDate
  balances: TVLAnalysis
}

export function makeLegacyData(entries: InputEntry[]): LegacyData {
  const lastEntry = entries[entries.length - 1].balances
  const TVL = lastEntry.TVL.usd
  const data = entries.map((entry) => ({
    date: entry.date.toString(),
    usd: entry.balances.TVL.usd,
  }))
  const l2s: Record<string, L2Entry> = {}
  for (const project of Object.keys(lastEntry.projects)) {
    const data = entries.map((entry) => ({
      date: entry.date.toString(),
      usd: entry.balances.projects[project].TVL.usd,
    }))
    l2s[project] = {
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

function skipBeginningZeroes(data: DateEntry[]) {
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
