import { Project } from '@l2beat/config'
import { ApiMain } from '@l2beat/types'

import { Wrapped } from '../../Page'
import { RiskPageProps } from '../view/RiskPage'
import { getPageMetadata } from './getPageMetadata'
import { getRiskView } from './getRiskView'

export function getProps(
  projects: Project[],
  apiMain: ApiMain,
): Wrapped<RiskPageProps> {
  const getTvl = (project: Project) =>
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
