import { Layer2 } from '@l2beat/config'
import { ApiMain } from '@l2beat/types'

import { Wrapped } from '../../Page'
import { RiskPageProps } from '../view/RiskPage'
import { getPageMetadata } from './getPageMetadata'
import { getRiskView } from './getRiskView'

export function getProps(
  projects: Layer2[],
  apiMain: ApiMain,
): Wrapped<RiskPageProps> {
  const getTvl = (project: Layer2) =>
    apiMain.projects[project.id.toString()]?.charts.hourly.data.at(-1)?.[1] ?? 0
  const ordering = [...projects].sort((a, b) => getTvl(b) - getTvl(a))

  return {
    props: {
      riskView: getRiskView(ordering),
    },
    wrapper: {
      preloadApi: '/api/tvl.json',
      metadata: getPageMetadata(),
    },
  }
}
