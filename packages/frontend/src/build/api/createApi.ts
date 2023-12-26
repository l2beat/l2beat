import {
  ActivityApiCharts,
  ActivityApiResponse,
  TvlApiCharts,
  TvlApiResponse,
} from '@l2beat/shared-pure'
import fsx from 'fs-extra'
import path from 'path'

import { Config } from '../config'

export function createApi(
  config: Config,
  tvlApiResponse: TvlApiResponse,
  activityApiResponse: ActivityApiResponse | undefined,
) {
  const urlCharts = new Map<string, TvlApiCharts | ActivityApiCharts>()

  urlCharts.set('tvl/scaling', tvlApiResponse.layers2s)
  urlCharts.set('tvl/bridges', tvlApiResponse.bridges)
  urlCharts.set('tvl/combined', tvlApiResponse.combined)

  for (const project of [...config.layer2s, ...config.bridges]) {
    const projectTvlData = tvlApiResponse.projects[project.id.toString()]
    if (projectTvlData) {
      urlCharts.set(`tvl/${project.display.slug}`, projectTvlData.charts)
    }
  }

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
  urlCharts: Map<string, TvlApiCharts | ActivityApiCharts>,
) {
  for (const [url, charts] of urlCharts) {
    const json = JSON.stringify(charts)
    fsx.mkdirpSync(path.join('build/api', path.dirname(url)))
    fsx.writeFileSync(path.join('build/api', `${url}.json`), json)
  }
}
