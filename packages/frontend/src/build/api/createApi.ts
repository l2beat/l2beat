import {
  ActivityApiCharts,
  ActivityApiResponse,
  DetailedTvlApiCharts,
  DetailedTvlApiResponse,
  TvlApiCharts,
  TvlApiResponse,
  UnixTime,
} from '@l2beat/shared-pure'
import fsx from 'fs-extra'
import { at } from 'lodash'
import path from 'path'

import { Config } from '../config'

export function createApi(
  config: Config,
  tvlApiResponse: TvlApiResponse | DetailedTvlApiResponse,
  activityApiResponse: ActivityApiResponse | undefined,
) {
  const urlCharts = new Map<
    string,
    TvlApiCharts | DetailedTvlApiCharts | ActivityApiCharts
  >()

  urlCharts.set('scaling-tvl', tvlApiResponse.layers2s)
  urlCharts.set('bridges-tvl', tvlApiResponse.bridges)
  urlCharts.set('combined-tvl', tvlApiResponse.combined)

  if (config.features.detailedTvl) {
    urlCharts.set('scaling-detailed-tvl', tvlApiResponse.layers2s)
  }

  for (const project of [...config.layer2s, ...config.bridges]) {
    const projectTvlData = tvlApiResponse.projects[project.id.toString()]
    if (projectTvlData) {
      urlCharts.set(`${project.display.slug}-tvl`, projectTvlData.charts)
      if (config.features.detailedTvl) {
        urlCharts.set(
          `${project.display.slug}-detailed-tvl`,
          projectTvlData.charts,
        )
      }
    }
  }
  urlCharts.set(`placeholder-tvl`, PLACEHOLDER_API_DATA)

  if (activityApiResponse?.combined) {
    urlCharts.set('activity/combined', activityApiResponse.combined)

    for (const [projectId, chart] of Object.entries(
      activityApiResponse.projects,
    )) {
      const slug = config.layer2s.find((x) => x.id.toString() === projectId)
        ?.display.slug
      if (chart && slug) {
        urlCharts.set(`activity/${slug}`, chart)
      }
    }
  }

  outputCharts(urlCharts)
}

export function outputCharts(
  urlCharts: Map<
    string,
    TvlApiCharts | DetailedTvlApiCharts | ActivityApiCharts
  >,
) {
  for (const [url, charts] of urlCharts) {
    // TODO(radomski): This check is be removed when we retire the /api/tvl
    // endpoint and use only the /api/detailed-tvl
    const json =
      'hourly' in charts &&
      charts.hourly.types.length === 9 &&
      !url.includes('-detailed-tvl')
        ? JSON.stringify({
            hourly: {
              types: ['timestamp', 'usd', 'eth'],
              data: charts.hourly.data.map((e) => at(e, [0, 1, 5])),
            },
            sixHourly: {
              types: ['timestamp', 'usd', 'eth'],
              data: charts.sixHourly.data.map((e) => at(e, [0, 1, 5])),
            },
            daily: {
              types: ['timestamp', 'usd', 'eth'],
              data: charts.daily.data.map((e) => at(e, [0, 1, 5])),
            },
          })
        : JSON.stringify(charts)

    fsx.mkdirpSync(path.join('build/api', path.dirname(url)))
    fsx.writeFileSync(path.join('build/api', `${url}.json`), json)
  }
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
