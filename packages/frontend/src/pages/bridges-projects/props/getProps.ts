import { Bridge } from '@l2beat/config'
import { TvlApiResponse } from '@l2beat/types'

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
  tvlApiResponse: TvlApiResponse,
): Wrapped<ProjectPageProps> {
  const chart = getChart(bridge, tvlApiResponse)
  return {
    props: {
      navbar: getNavbarProps(config, 'bridges'),
      header: getHeader(bridge, tvlApiResponse),
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
