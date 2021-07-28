import { Project } from '@l2beat/config'

export interface ChartProps {
  endpoint: string
  tokens: { symbol: string; endpoint: string }[]
}

export function getChartProps(project: Project): ChartProps {
  return {
    endpoint: `/api/${project.slug}.json`,
    tokens: getTokens(project),
  }
}

function getTokens(project: Project) {
  return project.bridges
    .flatMap((x) => x.tokens)
    .filter((x, i, a) => a.indexOf(x) === i)
    .sort()
    .map((x) => ({
      symbol: x,
      endpoint: `/api/${project.slug}/${x.toLowerCase()}.json`,
    }))
}
