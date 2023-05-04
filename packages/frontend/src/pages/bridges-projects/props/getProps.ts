import { Bridge } from '@l2beat/config'

import { Config } from '../../../build/config'
import { PagesData } from '../../../build/types'
import { getFooterProps, getNavbarProps } from '../../../components'
import { getChart } from '../../../utils/project/getChart'
import { getHeader } from '../../../utils/project/getHeader'
import { Wrapped } from '../../Page'
import { ProjectPageProps } from '../view/ProjectPage'
import { getPageMetadata } from './getPageMetadata'
import { getProjectDetails } from './getProjectDetails'
import { getProjectHeader } from './getProjectHeader'

export function getProps(
  bridge: Bridge,
  config: Config,
  pagesData: PagesData,
): Wrapped<ProjectPageProps> {
  const { tvlApiResponse, verificationStatus } = pagesData

  const chart = getChart(bridge, tvlApiResponse, config)
  return {
    props: {
      navbar: getNavbarProps(config, 'bridges'),
      header: getHeader(bridge, tvlApiResponse),
      projectHeader: getProjectHeader(bridge, tvlApiResponse),
      projectDetails: getProjectDetails(bridge, verificationStatus, chart),
      footer: getFooterProps(config),
    },
    wrapper: {
      preloadApi: chart.tvlEndpoint,
      metadata: getPageMetadata(bridge),
    },
  }
}
