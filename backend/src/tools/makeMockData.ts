import { ProjectInfo, SimpleDate } from '../model'
import { dateRange } from '../utils'
import { L2Entry, LegacyData } from './makeLegacyData'

export function makeMockData(
  projects: ProjectInfo[],
  endDate: SimpleDate
): LegacyData {
  const l2s: Record<string, L2Entry> = {}
  for (const project of projects) {
    const block = Math.min(...project.bridges.map((x) => x.sinceBlock))
    const earliestDate = getBlockDate(block)
    const dates = dateRange(earliestDate, endDate)
    l2s[project.name] = fakeData(dates)
  }

  const blocks = projects.flatMap((x) => x.bridges).map((x) => x.sinceBlock)
  const earliestDate = getBlockDate(Math.min(...blocks))
  const dates = dateRange(earliestDate, endDate)
  const data = fakeData(dates, projects.length * 200)
  return { ...data, l2s }
}

function fakeData(dates: SimpleDate[], startBoost = 0): L2Entry {
  let current = randRange(10, 200) + startBoost
  const data = dates.map((date) => {
    current *= randRange(0.95, 1.1)
    return {
      date: date.toString(),
      usd: toUsd(current),
    }
  })
  return {
    TVL: data[data.length - 1].usd,
    data,
  }
}

function toUsd(n: number) {
  return parseFloat(n.toFixed(2))
}

function randRange(min: number, max: number) {
  return Math.random() * (max - min) + min
}

const REFERENCE_TIMESTAMP = 1623153999
const REFERENCE_BLOCK = 12594332
const SECONDS_PER_BLOCK = 15

function getBlockDate(block: number) {
  const blockDiff = block - REFERENCE_BLOCK
  const timestampDiff = blockDiff * SECONDS_PER_BLOCK
  return SimpleDate.fromUnixTimestamp(REFERENCE_TIMESTAMP + timestampDiff)
}
