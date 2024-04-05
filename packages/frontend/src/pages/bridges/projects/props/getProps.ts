import { Bridge } from '@l2beat/config'

import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { getChartUrl } from '../../../../scripts/charts/data-controller/ChartDataController'
import { getChart } from '../../../../utils/project/getChart'
import { PagesData, Wrapped } from '../../../Page'
import { ProjectPageProps } from '../view/ProjectPage'
import { getPageMetadata } from './getPageMetadata'
import { getProjectDetails } from './getProjectDetails'
import { getProjectHeader } from './getProjectHeader'

export function getProps(
  bridge: Bridge,
  config: Config,
  pagesData: PagesData,
): Wrapped<ProjectPageProps> {
  const {
    tvlApiResponse,
    verificationStatus,
    manuallyVerifiedContracts,
    implementationChange,
  } = pagesData

  const chart = getChart(bridge, tvlApiResponse, config)
  return {
    props: {
      navbar: getNavbarProps(config, 'bridges'),
      projectHeader: getProjectHeader(
        bridge,
        tvlApiResponse,
        implementationChange,
      ),
      projectDetails: getProjectDetails(
        bridge,
        verificationStatus,
        manuallyVerifiedContracts,
        implementationChange,
        chart,
      ),
      footer: getFooterProps(config),
    },
    wrapper: {
      preloadApi: getChartUrl(chart.initialType),
      metadata: getPageMetadata(bridge),
      banner: config.features.banner,
    },
  }
}
