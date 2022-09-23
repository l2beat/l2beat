import { Bridge } from '@l2beat/config'
import { ApiMain } from '@l2beat/types'

import { getChart } from '../../../utils/project/getChart'
import { getHeader } from '../../../utils/project/getHeader'
import { Wrapped } from '../../Page'
import { ProjectPageProps } from '../view/ProjectPage'
import { getPageMetadata } from './getPageMetadata'
import { getProjectDetails } from './getProjectDetails'

export function getProps(
  bridge: Bridge,
  apiMain: ApiMain,
): Wrapped<ProjectPageProps> {
  const chart = getChart(bridge, apiMain)
  return {
    props: {
      header: getHeader(bridge, apiMain),
      chart,
      projectDetails: getProjectDetails(bridge),
    },
    wrapper: {
      preloadApi: chart.endpoint,
      metadata: getPageMetadata(bridge),
    },
  }
}
