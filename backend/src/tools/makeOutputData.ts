import { SimpleDate } from '../model'
import { TVLAnalysis } from '../services/balances/model'
import { Stats } from '../services/StatCollector'

export interface OutputData {
  aggregate: Chart
  byProject: Record<string, ProjectData>
  experimental: Record<string, ExperimentalData>
}

export interface ProjectData {
  aggregate: Chart
  byToken: Record<string, Chart>
}

export interface Chart {
  types: ['date', string, string]
  data: [string, number, number][]
}

export interface ExperimentalData {
  usdIn7DayNoEth: number
  usdOut7DayNoEth: number
}

export function makeOutputData(stats: Stats): OutputData {
  const entries = stats.tvlEntries
  const lastEntry = entries[entries.length - 1]

  const aggregate = makeAggregateChart(entries)
  const byProject = Object.fromEntries(
    Object.keys(lastEntry.projects).map((name) => [
      name,
      makeProjectData(entries, name),
    ])
  )

  return { aggregate, byProject, experimental: stats.flows }
}

function makeAggregateChart(entries: TVLAnalysis[]): Chart {
  const data: Chart['data'] = entries.map((entry) => [
    entry.date.toString(),
    entry.TVL.usd,
    entry.TVL.eth,
  ])
  return skipBeginningZeroes({ types: ['date', 'usd', 'eth'], data })
}

function makeProjectData(entries: TVLAnalysis[], project: string): ProjectData {
  const aggregate = makeAggregateProjectChart(entries, project)
  const minDate = SimpleDate.fromString(aggregate.data[0][0])
  const lastEntry = entries[entries.length - 1]
  const tokens = Object.keys(lastEntry.projects[project].tokens)
  const byToken = Object.fromEntries(
    tokens.map((token) => [
      token,
      makeTokenChart(entries, project, token, minDate),
    ])
  )
  return { aggregate, byToken }
}

function makeAggregateProjectChart(
  entries: TVLAnalysis[],
  project: string
): Chart {
  const data: Chart['data'] = entries.map((entry) => [
    entry.date.toString(),
    entry.projects[project].TVL.usd,
    entry.projects[project].TVL.eth,
  ])
  return skipBeginningZeroes({ types: ['date', 'usd', 'eth'], data })
}

function makeTokenChart(
  entries: TVLAnalysis[],
  project: string,
  token: string,
  minDate: SimpleDate
): Chart {
  const data: Chart['data'] = entries
    .filter((x) => !x.date.isBefore(minDate))
    .map((entry) => [
      entry.date.toString(),
      entry.projects[project].tokens[token].balance,
      entry.projects[project].tokens[token].usd,
    ])
  return { types: ['date', token.toLowerCase(), 'usd'], data }
}

function skipBeginningZeroes(chart: Chart): Chart {
  const result = []
  let nonZeroFound = false
  for (const entry of chart.data) {
    if (entry[1] !== 0 || nonZeroFound) {
      nonZeroFound = true
      result.push(entry)
    }
  }
  return { ...chart, data: result }
}
