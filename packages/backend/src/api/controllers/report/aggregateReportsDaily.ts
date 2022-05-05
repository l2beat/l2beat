import { AssetId, EthereumAddress, UnixTime } from '@l2beat/common'

import { ProjectInfo } from '../../../model/ProjectInfo'
import { ReportWithBalance } from '../../../peripherals/database/ReportRepository'

export interface OutputEntry {
  timestamp: UnixTime
  value: AggregateValue
  projects: Map<string, ProjectEntry>
}

export interface ProjectEntry {
  value: AggregateValue
  tokens: Map<string, TokenEntry>
}

export interface AggregateValue {
  usd: bigint
  eth: bigint
}

export interface TokenEntry {
  usd: bigint
  eth: bigint
  balance: bigint
  decimals: number
}

export function aggregateReportsDaily(
  reports: ReportWithBalance[],
  projects: ProjectInfo[]
): OutputEntry[] {
  const { min, max } = getBounds(reports)
  const dates = getDailyTimestamps(min, max)

  const entries: OutputEntry[] = dates.map((timestamp) => ({
    timestamp,
    value: { usd: 0n, eth: 0n },
    projects: new Map(),
  }))

  const timestampToIndex = new Map(
    entries.map((x, i) => [x.timestamp.toNumber(), i])
  )

  const projectNames = getProjectNames(projects)
  const tokenDetails = getTokenDetails(projects)

  for (const report of reports) {
    const index = timestampToIndex.get(report.timestamp.toNumber())
    if (index === undefined) {
      throw new Error('Programmer error: Invalid timestamp')
    }

    const entry = entries[index]
    entry.value.usd += report.usdTVL
    entry.value.eth += report.ethTVL

    const projectName = projectNames.get(report.bridge)
    if (projectName === undefined) {
      throw new Error('Programmer error: Invalid bridge')
    }

    let project = entry.projects.get(projectName)
    if (!project) {
      project = {
        value: { usd: 0n, eth: 0n },
        tokens: new Map(),
      }
      entry.projects.set(projectName, project)
    }

    project.value.usd += report.usdTVL
    project.value.eth += report.ethTVL

    const details = tokenDetails.get(report.asset)
    if (details === undefined) {
      throw new Error('Programmer error: Invalid asset')
    }

    let token = project.tokens.get(details.symbol)
    if (token === undefined) {
      token = {
        usd: 0n,
        eth: 0n,
        balance: 0n,
        decimals: 0,
      }
      project.tokens.set(details.symbol, token)
    }

    token.usd += report.usdTVL
    token.eth += report.ethTVL
    token.balance += report.balance
    token.decimals = details.decimals
  }

  return entries
}

function getProjectNames(projects: ProjectInfo[]) {
  const projectNames = new Map<EthereumAddress, string>()
  for (const project of projects) {
    for (const bridge of project.bridges) {
      projectNames.set(EthereumAddress(bridge.address), project.name)
    }
  }
  return projectNames
}

function getTokenDetails(projects: ProjectInfo[]) {
  const tokenDetails = new Map<AssetId, { symbol: string; decimals: number }>()
  for (const project of projects) {
    for (const bridge of project.bridges) {
      for (const token of bridge.tokens) {
        tokenDetails.set(token.id, {
          symbol: token.symbol,
          decimals: token.decimals,
        })
      }
    }
  }
  return tokenDetails
}

function getBounds(reports: ReportWithBalance[]) {
  let min = Infinity
  let max = -Infinity
  for (const { timestamp } of reports) {
    const n = timestamp.toNumber()
    if (n < min) {
      min = n
    }
    if (n > max) {
      max = n
    }
  }
  return { min: new UnixTime(min), max: new UnixTime(max) }
}

function getDailyTimestamps(min: UnixTime, max: UnixTime) {
  const timestamps: UnixTime[] = []
  for (let t = min; !t.gt(max); t = t.add(1, 'days')) {
    timestamps.push(t)
  }
  return timestamps
}
