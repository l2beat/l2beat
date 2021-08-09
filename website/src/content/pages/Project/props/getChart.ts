import { Project } from '@l2beat/config'
import { ChartProps } from '../../../common'
import { L2Data } from '../../../L2Data'

export function getChart(project: Project, l2Data: L2Data): ChartProps {
  return {
    endpoint: `/api/${project.slug}.json`,
    tokens: getTokens(project, l2Data),
  }
}

function getTokens(project: Project, l2Data: L2Data) {
  return project.bridges
    .flatMap((x) => x.tokens)
    .filter((x, i, a) => a.indexOf(x) === i)
    .map((token) => ({
      symbol: token,
      endpoint: `/api/${project.slug}/${token.toLowerCase()}.json`,
      tvl: getTVL(project, l2Data, token),
    }))
    .sort((a, b) => b.tvl - a.tvl)
}

function getTVL(project: Project, l2Data: L2Data, token: string) {
  const data = l2Data.byProject[project.name].byToken[token].data
  return data[data.length - 1][2]
}
