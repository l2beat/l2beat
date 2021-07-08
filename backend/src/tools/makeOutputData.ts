import { SimpleDate } from '../model'
import { TVLAnalysis } from '../services/balances/model'

export interface OutputData {
  aggregate: Chart
  byProject: Record<string, ProjectData>
}

export interface ProjectData {
  aggregate: Chart
  byToken: Record<string, Chart>
}

export interface Chart {
  types: ['date', string, string]
  data: [string, number, number][]
}

interface InputEntry {
  date: SimpleDate
  balances: TVLAnalysis
}

export function makeOutputData(entries: InputEntry[]): OutputData {
  const lastEntry = entries[entries.length - 1].balances

  const aggregate = makeAggregateChart(entries)
  const byProject = Object.fromEntries(
    Object.keys(lastEntry.projects).map((name) => [
      name,
      makeProjectData(entries, name),
    ])
  )

  return { aggregate, byProject }
}

function makeAggregateChart(entries: InputEntry[]): Chart {
  const data: Chart['data'] = entries.map((entry) => [
    entry.date.toString(),
    entry.balances.TVL.usd,
    entry.balances.TVL.eth,
  ])
  return skipBeginningZeroes({ types: ['date', 'usd', 'eth'], data })
}

function makeProjectData(entries: InputEntry[], project: string): ProjectData {
  const aggregate = makeAggregateProjectChart(entries, project)
  const minDate = SimpleDate.fromString(aggregate.data[0][0])
  const lastEntry = entries[entries.length - 1]
  const tokens = Object.keys(lastEntry.balances.projects[project].tokens)
  const byToken = Object.fromEntries(
    tokens.map((token) => [
      token,
      makeTokenChart(entries, project, token, minDate),
    ])
  )
  return { aggregate, byToken }
}

function makeAggregateProjectChart(
  entries: InputEntry[],
  project: string
): Chart {
  const data: Chart['data'] = entries.map((entry) => [
    entry.date.toString(),
    entry.balances.projects[project].TVL.usd,
    entry.balances.projects[project].TVL.eth,
  ])
  return skipBeginningZeroes({ types: ['date', 'usd', 'eth'], data })
}

function makeTokenChart(
  entries: InputEntry[],
  project: string,
  token: string,
  minDate: SimpleDate
): Chart {
  const data: Chart['data'] = entries
    .filter((x) => !x.date.isBefore(minDate))
    .map((entry) => [
      entry.date.toString(),
      entry.balances.projects[project].tokens[token].balance,
      entry.balances.projects[project].tokens[token].usd,
    ])
  return { types: ['date', token, 'usd'], data }
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
