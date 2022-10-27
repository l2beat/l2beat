import {
  ActivityApiChart,
  ActivityApiResponse,
  TvlApiCharts,
  TvlApiResponse,
} from '@l2beat/types'
import fsx from 'fs-extra'
import path from 'path'

import { Config } from './config'

export interface FrontendActivityChart {
  daily: {
    types: ['timestamp', 'transactions', 'ethereumTransactions']
    data: [number, number, number][]
  }
}

export function createApi(
  config: Config,
  tvlApiResponse: TvlApiResponse,
  activityApiResponse: ActivityApiResponse | undefined,
) {
  const urlCharts = new Map<string, TvlApiCharts | FrontendActivityChart>()

  urlCharts.set('scaling-tvl', tvlApiResponse.layers2s)
  urlCharts.set('bridges-tvl', tvlApiResponse.bridges)
  urlCharts.set('combined-tvl', tvlApiResponse.combined)
  for (const project of [...config.layer2s, ...config.bridges]) {
    const projectTvlData = tvlApiResponse.projects[project.id.toString()]
    if (projectTvlData) {
      urlCharts.set(`${project.display.slug}-tvl`, projectTvlData.charts)
    }
  }

  if (activityApiResponse) {
    urlCharts.set(
      'activity/combined',
      getActivityChart(
        activityApiResponse.combined,
        activityApiResponse.ethereum,
      ),
    )

    for (const [projectId, chart] of Object.entries(
      activityApiResponse.projects,
    )) {
      const slug = config.layer2s.find((x) => x.id.toString() === projectId)
        ?.display.slug
      if (chart && slug) {
        urlCharts.set(
          `activity/${slug}`,
          getActivityChart(chart, activityApiResponse.ethereum),
        )
      }
    }
  }

  outputCharts(urlCharts)
}

export function outputCharts(
  urlCharts: Map<string, TvlApiCharts | FrontendActivityChart>,
) {
  for (const [url, charts] of urlCharts) {
    fsx.mkdirpSync(path.join('build/api', path.dirname(url)))
    fsx.writeFileSync(
      path.join('build/api', `${url}.json`),
      JSON.stringify(charts),
    )
  }
}

function getActivityChart(
  apiChart: ActivityApiChart,
  ethereumChart: ActivityApiChart,
): FrontendActivityChart {
  const length = Math.min(apiChart.data.length, ethereumChart.data.length)
  return {
    daily: {
      types: ['timestamp', 'transactions', 'ethereumTransactions'],
      data: new Array(length).fill(0).map((x, i) => {
        const apiPoint = apiChart.data.at(-length + i)
        const ethPoint = ethereumChart.data.at(-length + i)
        return [
          apiPoint?.[0].toNumber() ?? 0,
          apiPoint?.[1] ?? 0,
          ethPoint?.[1] ?? 0,
        ]
      }),
    },
  }
}
