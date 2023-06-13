import {
  ActivityApiChart,
  ActivityApiResponse,
  TvlApiCharts,
  TvlApiResponse,
  UnixTime,
} from '@l2beat/shared-pure'
import fsx from 'fs-extra'
import path from 'path'

import { Config } from '../config'

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
  urlCharts.set(`placeholder-tvl`, PLACEHOLDER_API_DATA)

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
  return {
    daily: {
      types: ['timestamp', 'transactions', 'ethereumTransactions'],
      data: alignActivityData(apiChart.data, ethereumChart.data),
    },
  }
}

export function alignActivityData(
  apiChartData: ActivityApiChart['data'],
  ethereumChartData: ActivityApiChart['data'],
): FrontendActivityChart['daily']['data'] {
  const lastProjectTimestamp = apiChartData.at(-1)?.[0]
  if (!lastProjectTimestamp) {
    throw new Error('No data in activity chart')
  }
  const ethChartTimestampIndex = ethereumChartData.findIndex(
    (x) => x[0].toNumber() === lastProjectTimestamp.toNumber(),
  )
  if (ethChartTimestampIndex === -1) {
    throw new Error('No matching timestamp in ethereum chart')
  }
  const alignedEthChartData = ethereumChartData.slice(
    0,
    ethChartTimestampIndex + 1,
  )
  const length = Math.min(apiChartData.length, alignedEthChartData.length)

  const data: FrontendActivityChart['daily']['data'] = new Array(length)
    .fill(0)
    .map((_, i) => {
      const apiPoint = apiChartData.at(-length + i)
      const ethPoint = alignedEthChartData.at(-length + i)
      return [
        apiPoint?.[0].toNumber() ?? 0,
        apiPoint?.[1] ?? 0,
        ethPoint?.[1] ?? 0,
      ]
    })
  return data
}

const PLACEHOLDER_API_DATA: TvlApiCharts = {
  hourly: {
    types: ['timestamp', 'usd', 'eth'],
    data: [],
  },
  sixHourly: {
    types: ['timestamp', 'usd', 'eth'],
    data: [
      [new UnixTime(1573689600), 0, 0],
      [new UnixTime(1573776000), 10, 0],
      [new UnixTime(1573862400), 20, 0],
      [new UnixTime(1573948800), 22, 0],
      [new UnixTime(1574035200), 23, 0],
      [new UnixTime(1574121600), 25, 0],
      [new UnixTime(1574208000), 30, 0],
      [new UnixTime(1574294400), 32, 0],
      [new UnixTime(1574380800), 34, 0],
      [new UnixTime(1574467200), 36, 0],
      [new UnixTime(1574553600), 38, 0],
      [new UnixTime(1574640000), 40, 0],
      [new UnixTime(1574726400), 42, 0],
      [new UnixTime(1574812800), 44, 0],
      [new UnixTime(1574899200), 45, 0],
      [new UnixTime(1574985600), 48, 0],
      [new UnixTime(1575072000), 50, 0],
      [new UnixTime(1575158400), 48, 0],
      [new UnixTime(1575244800), 46, 0],
      [new UnixTime(1575331200), 42, 0],
      [new UnixTime(1575417600), 40, 0],
      [new UnixTime(1575504000), 41, 0],
      [new UnixTime(1575590400), 43, 0],
      [new UnixTime(1575676800), 45, 0],
      [new UnixTime(1575763200), 46, 0],
      [new UnixTime(1575849600), 50, 0],
      [new UnixTime(1575936000), 51, 0],
      [new UnixTime(1576022400), 52, 0],
      [new UnixTime(1576108800), 53, 0],
      [new UnixTime(1576195200), 56, 0],
      [new UnixTime(1576281600), 60, 0],
      [new UnixTime(1576368000), 61, 0],
      [new UnixTime(1576454400), 64, 0],
      [new UnixTime(1576540800), 66, 0],
      [new UnixTime(1576627200), 63, 0],
      [new UnixTime(1576713600), 62, 0],
      [new UnixTime(1576800000), 61, 0],
      [new UnixTime(1576886400), 58, 0],
      [new UnixTime(1576972800), 60, 0],
    ],
  },
  daily: {
    types: ['timestamp', 'usd', 'eth'],
    data: [],
  },
}
