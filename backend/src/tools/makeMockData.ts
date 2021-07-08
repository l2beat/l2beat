import { ProjectInfo, SimpleDate } from '../model'
import { dateRange } from '../utils'
import { ProjectData, OutputData, Chart } from './makeOutputData'

export function makeMockData(
  projects: ProjectInfo[],
  endDate: SimpleDate
): OutputData {
  const byProject: Record<string, ProjectData> = {}
  for (const project of projects) {
    const dates = getProjectDateRange(project, endDate)
    const tokens = getProjectTokens(project)
    byProject[project.name] = fakeProjectData(dates, tokens)
  }

  const dates = getAggregateDateRange(projects, endDate)
  const aggregate = fakeChart(dates, ['usd', 'eth'], projects.length * 200)
  return { aggregate, byProject }
}

function getProjectDateRange(project: ProjectInfo, endDate: SimpleDate) {
  const block = Math.min(...project.bridges.map((x) => x.sinceBlock))
  const earliestDate = getBlockDate(block)
  const dates = dateRange(earliestDate, endDate)
  return dates
}

function getProjectTokens(project: ProjectInfo) {
  return project.bridges
    .flatMap((x) => x.tokens)
    .map((x) => x.symbol)
    .filter((x, i, a) => a.indexOf(x) === i)
}

function getAggregateDateRange(projects: ProjectInfo[], endDate: SimpleDate) {
  const blocks = projects.flatMap((x) => x.bridges).map((x) => x.sinceBlock)
  const earliestDate = getBlockDate(Math.min(...blocks))
  return dateRange(earliestDate, endDate)
}

function fakeProjectData(dates: SimpleDate[], tokens: string[]): ProjectData {
  const aggregate = fakeChart(dates, ['usd', 'eth'], tokens.length * 10)
  const byToken: Record<string, Chart> = {}
  for (const token of tokens) {
    byToken[token] = fakeChart(dates, [token.toLowerCase(), 'usd'])
  }
  return { aggregate, byToken }
}

function fakeChart(
  dates: SimpleDate[],
  types: [string, string],
  boost = 0
): Chart {
  let current = randRange(10, 200) + boost
  let price = randRange(10, 2000)
  const data: Chart['data'] = dates.map((date) => {
    current *= randRange(0.95, 1.1)
    price *= randRange(0.97, 1.03)
    if (types[0] === 'usd') {
      return [date.toString(), toUsd(current), toToken(current / price)]
    } else {
      return [date.toString(), toToken(current), toUsd(current * price)]
    }
  })
  return { types: ['date', ...types], data }
}

function toToken(n: number) {
  return parseFloat(n.toFixed(6))
}

function toUsd(n: number) {
  return parseFloat(n.toFixed(2))
}

function randRange(min: number, max: number) {
  return Math.random() * (max - min) + min
}

const REFERENCE_TIMESTAMP = 1625241107
const REFERENCE_BLOCK = 12749116
const SECONDS_PER_BLOCK = 15

function getBlockDate(block: number) {
  const blockDiff = block - REFERENCE_BLOCK
  const timestampDiff = blockDiff * SECONDS_PER_BLOCK
  return SimpleDate.fromUnixTimestamp(REFERENCE_TIMESTAMP + timestampDiff)
}
