import { Bridge } from '@l2beat/config'
import { ApiMain } from '@l2beat/types'

import { Config } from '../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../components'
import { getChart } from '../../../utils/project/getChart'
import { getHeader } from '../../../utils/project/getHeader'
import { Wrapped } from '../../Page'
import { ProjectPageProps } from '../view/ProjectPage'
import { getPageMetadata } from './getPageMetadata'
import { getProjectDetails } from './getProjectDetails'

export function getProps(
  bridge: Bridge,
  config: Config,
  apiMain: ApiMain,
): Wrapped<ProjectPageProps> {
  const chart = getChart(bridge, apiMain)
  return {
    props: {
      navbar: getNavbarProps(config),
      header: getHeader(bridge, apiMain),
      chart,
      projectDetails: getProjectDetails(bridge),
      footer: getFooterProps(config),
    },
    wrapper: {
      preloadApi: chart.endpoint,
      metadata: getPageMetadata(bridge),
    },
  }
}
