import { getTokenBySymbol, Project, TokenInfo } from '@l2beat/config'
import { BigNumber, utils } from 'ethers'
import { FetchedBalances, FetchedPrices, TokenTVL } from './model'

const TEN_TO_18 = BigNumber.from('1' + '0'.repeat(18))

export function getHolders(projects: Project[], blockNumber: number) {
  const tokenHolders: Record<string, string[]> = {}
  const ethHolders: string[] = []
  for (const project of projects) {
    for (const bridge of project.bridges) {
      if (bridge.sinceBlock < blockNumber) {
        continue
      }
      for (const symbol of bridge.tokens) {
        const token = getTokenBySymbol(symbol)
        if (token.sinceBlock < blockNumber) {
          continue
        }
        if (token.address) {
          const array = tokenHolders[token.address] ?? []
          tokenHolders[token.address] = array
          array.push(bridge.address)
        } else {
          ethHolders.push(bridge.address)
        }
      }
    }
  }
  return { tokenHolders, ethHolders }
}

export interface ProjectStats {
  project: Project
  tokenTVL: Record<string, TokenTVL>
  usdBalance: BigNumber
  ethBalance: BigNumber
}

export function getProjectStats(
  projects: Project[],
  balances: FetchedBalances,
  prices: FetchedPrices
): ProjectStats[] {
  return projects.map((project) => {
    const tokenStats = getTokenStats(project, balances, prices)
    const tokenTVL = getTokenTVL(tokenStats)
    const projectUsdBalance = tokenStats
      .map((x) => x.value)
      .reduce((a, b) => a.add(b), BigNumber.from(0))
    const projectEthBalance = projectUsdBalance.mul(TEN_TO_18).div(prices.eth)
    return {
      project,
      tokenTVL,
      usdBalance: projectUsdBalance,
      ethBalance: projectEthBalance,
    }
  })
}

export interface TokenStats {
  token: TokenInfo
  balance: BigNumber
  value: BigNumber
}

function getTokenStats(
  project: Project,
  balances: FetchedBalances,
  prices: FetchedPrices
): TokenStats[] {
  const holders = getHolderAddresses(project)
  const tokens = getTrackedTokens(project)

  const stats = tokens.map((token) => {
    const balance = getTokenBalance(holders, token, balances)
    const price = getTokenPrice(token, prices)
    const value = balance.mul(price).div(TEN_TO_18)
    return { token, balance, value }
  })
  return stats
}

function getHolderAddresses(project: Project) {
  return project.bridges.map((bridge) => bridge.address)
}

function getTrackedTokens(project: Project) {
  return project.bridges
    .flatMap((bridge) => bridge.tokens)
    .filter((x, i, a) => a.indexOf(x) === i)
    .map((symbol) => getTokenBySymbol(symbol))
}

function getTokenBalance(
  holders: string[],
  token: TokenInfo,
  balances: FetchedBalances
) {
  let balance = BigNumber.from(0)
  for (const holder of holders) {
    const holderBalance = token.address
      ? balances.token[token.address]?.[holder]
      : balances.eth[holder]
    if (holderBalance) {
      balance = balance.add(holderBalance)
    }
  }
  return balance
}

function getTokenPrice(token: TokenInfo, prices: FetchedPrices) {
  return token.address
    ? prices.token[token.address] ?? BigNumber.from(0)
    : prices.eth
}

function getTokenTVL(stats: TokenStats[]) {
  return Object.fromEntries(
    stats.map(({ token, balance, value }) => [
      token.symbol,
      {
        balance: asNumber(balance, token.decimals, 6),
        usd: asNumber(value, 18, 2),
      },
    ])
  )
}

export function getProjectTVL(projectStats: ProjectStats[]) {
  return Object.fromEntries(
    projectStats.map(({ project, usdBalance, ethBalance, tokenTVL }) => [
      project.name,
      {
        TVL: {
          usd: asNumber(usdBalance, 18, 2),
          eth: asNumber(ethBalance, 18, 6),
        },
        tokens: tokenTVL,
      },
    ])
  )
}

export function getAggregateTVL(
  projectStats: ProjectStats[],
  prices: FetchedPrices
) {
  const totalUsdBalance = projectStats
    .map((x) => x.usdBalance)
    .reduce((a, b) => a.add(b), BigNumber.from(0))
  const totalEthBalance = totalUsdBalance.mul(TEN_TO_18).div(prices.eth)
  const TVL = {
    usd: asNumber(totalUsdBalance, 18, 2),
    eth: asNumber(totalEthBalance, 18, 6),
  }
  return TVL
}

function asNumber(value: BigNumber, decimals: number, precision: number) {
  const formatted = utils.formatUnits(value, decimals)
  return parseFloat(parseFloat(formatted).toFixed(precision))
}
