import { Layer2, safeGetTokenByAssetId } from '@l2beat/config'
import { ApiMain } from '@l2beat/types'

import { ChartProps } from '../../../components'

export function getChart(project: Layer2, apiMain: ApiMain): ChartProps {
  return {
    endpoint: `/api/${project.display.slug}.json`,
    tokens: getTokens(project, apiMain),
  }
}

function getTokens(project: Layer2, apiMain: ApiMain) {
  return apiMain.projects[project.id.toString()]?.tokens
    .map(({ assetId, tvl }) => {
      const symbol = safeGetTokenByAssetId(assetId)?.symbol
      if (symbol) {
        return {
          symbol,
          endpoint: `/api/projects/${project.id.toString()}/tvl/assets/${assetId.toString()}`,
          tvl,
        }
      }
    })
    .filter(notUndefined)
    .sort((a, b) => b.tvl - a.tvl)
}

function notUndefined<T>(x: T | undefined): x is T {
  return x !== undefined
}
