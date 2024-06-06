import path from 'path'
import {
  ActivityApiCharts,
  ActivityApiResponse,
  L2CostsApiResponse,
  L2CostsCombinedApiCharts,
  L2CostsProjectApiCharts,
  TvlApiCharts,
  TvlApiResponse,
} from '@l2beat/shared-pure'
import fsx from 'fs-extra'

import { Config } from '../config'

type Charts =
  | TvlApiCharts
  | ActivityApiCharts
  | L2CostsCombinedApiCharts
  | L2CostsProjectApiCharts

export function createApi(
  config: Config,
  tvlApiResponse: TvlApiResponse,
  excludedTokensTvlApiResponse: TvlApiResponse,
  activityApiResponse: ActivityApiResponse | undefined,
  l2CostsApiResponse: L2CostsApiResponse | undefined,
) {
  const urlCharts = new Map<string, Charts>()
  const { layer2s, layer3s, bridges } = config

  urlCharts.set('tvl/scaling', tvlApiResponse.layers2s)
  urlCharts.set('tvl/bridges', tvlApiResponse.bridges)
  urlCharts.set('tvl/combined', tvlApiResponse.combined)

  for (const project of [...layer2s, ...bridges, ...layer3s]) {
    const projectTvlData = tvlApiResponse.projects[project.id.toString()]
    if (projectTvlData) {
      urlCharts.set(`tvl/${project.display.slug}`, projectTvlData.charts)
    }
  }

  urlCharts.set(
    'tvl/scaling-excluded-associated-tokens',
    excludedTokensTvlApiResponse.layers2s,
  )

  if (activityApiResponse) {
    urlCharts.set('activity/combined', activityApiResponse.combined)

    for (const [projectId, chart] of Object.entries(
      activityApiResponse.projects,
    )) {
      const slug = [...layer2s, ...layer3s].find(
        (x) => x.id.toString() === projectId,
      )?.display.slug
      if (chart && slug) {
        urlCharts.set(`activity/${slug}`, chart)
      }
    }
  }

  if (l2CostsApiResponse) {
    urlCharts.set('costs/combined', l2CostsApiResponse.combined)
    for (const [projectId, chart] of Object.entries(
      l2CostsApiResponse.projects,
    )) {
      const slug = [...layer2s].find((x) => x.id.toString() === projectId)
        ?.display.slug
      if (chart && slug) {
        urlCharts.set(`costs/${slug}`, chart)
      }
    }
  }

  outputCharts(urlCharts)
}

export function outputCharts(urlCharts: Map<string, Charts>) {
  for (const [url, charts] of urlCharts) {
    const json = JSON.stringify(charts)
    fsx.mkdirpSync(path.join('build/api', path.dirname(url)))
    fsx.writeFileSync(path.join('build/api', `${url}.json`), json)
  }
}
