import { AssetId, ProjectId, UnixTime } from '@l2beat/common'

import { ProjectInfo } from '../../../model/ProjectInfo'
import { ReportRecord } from '../../../peripherals/database/ReportRepository'

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
  reports: ReportRecord[],
  projects: ProjectInfo[],
): OutputEntry[] {
  if (reports.length === 0) {
    return []
  }

  const { min, max } = getBounds(reports)
  const dates = getDailyTimestamps(min, max)

  const entries: OutputEntry[] = dates.map((timestamp) => ({
    timestamp,
    value: { usd: 0n, eth: 0n },
    projects: new Map(),
  }))

  const timestampToIndex = new Map(
    entries.map((x, i) => [x.timestamp.toNumber(), i]),
  )

  const projectNames = getProjectNames(projects)
  const tokenDetails = getTokenDetails(projects)

  for (const report of reports) {
    const index = timestampToIndex.get(report.timestamp.toNumber())
    if (index === undefined) {
      throw new Error('Programmer error: Invalid timestamp')
    }

    const entry = entries[index]

    const projectName = projectNames.get(report.projectId)
    if (projectName === undefined) {
      throw new Error('Programmer error: Invalid bridge')
    }

    const details = tokenDetails.get(report.asset)
    if (details === undefined) {
      throw new Error('Programmer error: Invalid asset')
    }

    saveBalancesToEntry(
      entry,
      projectName,
      report.balanceUsd,
      report.balanceEth,
      report.balance,
      details.symbol,
      details.decimals,
    )
  }

  return entries
}

function getProjectNames(projects: ProjectInfo[]) {
  const projectNames = new Map<ProjectId, string>()
  for (const project of projects) {
    projectNames.set(project.projectId, project.name)
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

function getBounds(reports: ReportRecord[]) {
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

export function saveBalancesToEntry(
  entry: OutputEntry,
  projectName: string,
  balanceUsd: bigint,
  balanceEth: bigint,
  balance: bigint,
  symbol: string,
  decimals: number,
) {
  entry.value.usd += balanceUsd
  entry.value.eth += balanceEth

  let project = entry.projects.get(projectName)
  if (!project) {
    project = {
      value: { usd: 0n, eth: 0n },
      tokens: new Map(),
    }
    entry.projects.set(projectName, project)
  }

  project.value.usd += balanceUsd
  project.value.eth += balanceEth

  let token = project.tokens.get(symbol)
  if (token === undefined) {
    token = {
      usd: 0n,
      eth: 0n,
      balance: 0n,
      decimals: 0,
    }
    project.tokens.set(symbol, token)
  }

  token.usd += balanceUsd
  token.eth += balanceEth
  token.balance += balance
  token.decimals = decimals
}
