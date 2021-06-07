import { BigNumber } from '@ethersproject/bignumber'
import { utils } from 'ethers'
import { SimpleDate } from '../services/SimpleDate'
import { BridgeTVL } from '../services/ValueLockedChecker'
import { getTokenBySymbol } from '../tokens'
import { ProjectTVL } from './getProjectTVLs'
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
  bridges: {
    [address: string]: BridgeEntry
  }
}

interface BridgeEntry {
  TVL: number
  data: DateEntry[]
  tokens: {
    [symbol: string]: TokenEntry
  }
}

interface TokenEntry {
  TVL: number
  data: TokenDateEntry[]
}

interface DateEntry {
  date: string
  usd: number
}

interface TokenDateEntry extends DateEntry {
  token: number
}

export function makeLegacyData(
  projects: ProjectTVL[],
  getPrice: PriceFunction
): LegacyData {
  const l2s: Record<string, L2Entry> = {}
  for (const project of reorderProjects(projects)) {
    l2s[project.name] = getL2Entry(project.bridges, getPrice)
  }
  const data = sumData(Object.values(l2s).map((x) => x.data))
  return {
    TVL: data[data.length - 1].usd,
    data,
    l2s,
  }
}

function reorderProjects(input: ProjectTVL[]): ProjectTVL[] {
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  return [
    input.find((x) => x.name === 'Aztec')!,
    input.find((x) => x.name === 'Fuel')!,
    input.find((x) => x.name === 'Hermez')!,
    input.find((x) => x.name === 'ImmutableX')!,
    input.find((x) => x.name === 'Layer2.Finance')!,
    input.find((x) => x.name === 'Loopring')!,
    input.find((x) => x.name === 'Optimism')!,
    input.find((x) => x.name === 'ZKSwap')!,
    { ...input.find((x) => x.name === 'dYdX')!, name: 'dydx' },
    input.find((x) => x.name === 'zkSync')!,
  ]
  /* eslint-enable @typescript-eslint/no-non-null-assertion */
}

function getL2Entry(bridgeData: BridgeTVL[], getPrice: PriceFunction): L2Entry {
  const bridges: Record<string, BridgeEntry> = {}
  for (const bridge of bridgeData) {
    const tokens: Record<string, TokenEntry> = {}
    for (const [symbol, entries] of Object.entries(bridge.balances)) {
      const data = entries.map((x) => toTokenDateEntry(symbol, x, getPrice))
      tokens[symbol] = {
        TVL: data[data.length - 1].usd,
        data: data,
      }
    }
    const data = sumData(Object.values(tokens).map((x) => x.data))
    bridges[bridge.address] = {
      TVL: data[data.length - 1].usd,
      data,
      tokens,
    }
  }
  const data = sumData(Object.values(bridges).map((x) => x.data))
  return {
    TVL: data[data.length - 1].usd,
    bridges,
    data,
  }
}

function toTokenDateEntry(
  symbol: string,
  { date, balance }: { date: SimpleDate; balance: BigNumber },
  getPrice: PriceFunction
): TokenDateEntry {
  const { decimals } = getTokenBySymbol(symbol)
  const numberBalance = parseFloat(utils.formatUnits(balance, decimals))
  const price = getPrice(symbol, date)
  return {
    date: date.toString(),
    token: numberBalance,
    usd: numberBalance * price,
  }
}

function sumData(entries: DateEntry[][]): DateEntry[] {
  const result = []
  const maxLen = Math.max(...entries.map((x) => x.length))
  for (let i = 0; i < maxLen; i++) {
    let usd = 0
    let date = ''
    for (const e of entries) {
      const item = e[e.length - i - 1]
      if (item) {
        usd += item.usd
        date = item.date
      }
    }
    result.push({ date, usd })
  }
  return result.reverse()
}
