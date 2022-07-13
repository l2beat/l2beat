import { ApiMain } from '@l2beat/common'
import { getTokenByAssetId, Project } from '@l2beat/config'

import { ChartProps } from '../../../common'

export function getChart(project: Project, apiMain: ApiMain): ChartProps {
  return {
    endpoint: `/api/${project.slug}.json`,
    tokens: getTokens(project, apiMain),
  }
}

function getTokens(project: Project, apiMain: ApiMain) {
  return apiMain.projects[project.name]?.tokens
    .map(({ assetId, tvl }) => {
      const symbol = getTokenByAssetId(assetId).symbol
      return {
        symbol,
        endpoint: `/api/projects/${project.id.toString()}/tvl/assets/${assetId.toString()}`,
        tvl,
      }
    })
    .sort((a, b) => b.tvl - a.tvl)
}
