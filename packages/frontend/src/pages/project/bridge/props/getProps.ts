import { Bridge } from '@l2beat/config'
import compact from 'lodash/compact'

import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { getChartUrl } from '../../../../scripts/charts/data-controller/ChartDataController'
import { PagesData, Wrapped } from '../../../Page'
import { getCharts } from '../../common/getCharts'
import { getPageMetadata } from '../../common/getPageMetadata'
import { ProjectPageProps } from '../view/ProjectPage'
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

  const charts = getCharts(bridge, tvlApiResponse, config)

  return {
    props: {
      navbar: getNavbarProps(config, 'bridges'),
      projectHeader: getProjectHeader(
        bridge,
        tvlApiResponse,
        implementationChange,
      ),
      projectDetails: {
        items: getProjectDetails(
          bridge,
          verificationStatus,
          manuallyVerifiedContracts,
          implementationChange,
          charts,
        ),
      },
      footer: getFooterProps(config),
    },
    wrapper: {
      preloadApis: compact([
        charts.tvl && getChartUrl(charts.tvl.initialType),
        charts.activity && getChartUrl(charts.activity.initialType),
        charts.costs && getChartUrl(charts.costs.initialType),
      ]),
      metadata: getPageMetadata(bridge),
      banner: config.features.banner,
    },
  }
}
