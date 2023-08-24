import { Layer2 } from '@l2beat/config'

import { Config } from '../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../components'
import { getChart } from '../../../utils/project/getChart'
import { getHeader } from '../../../utils/project/getHeader'
import { PagesData, Wrapped } from '../../Page'
import { TvlBreakdownPageProps } from '../view/ProjectPage'
import { getPageMetadata } from './getPageMetadata'
import { getTvlBreakdownHeader } from './getTvlBreakdownHeader'
import { getTvlBreakdownView } from './getTvlBreakdownView'

export function getProps(
  project: Layer2,
  config: Config,
  pagesData: PagesData,
): Wrapped<TvlBreakdownPageProps> {
  const { tvlApiResponse, activityApiResponse, tvlBreakdownApiResponse } =
    pagesData

  return {
    props: {
      navbar: getNavbarProps(config, 'scaling'),
      header: getHeader(project, tvlApiResponse, activityApiResponse),
      tvlBreakdownHeader: getTvlBreakdownHeader(
        project,
        tvlBreakdownApiResponse,
      ),
      tvlBreakdownView: getTvlBreakdownView(
        project,
        tvlApiResponse,
        tvlBreakdownApiResponse,
      ),
      footer: getFooterProps(config),
    },
    wrapper: {
      metadata: getPageMetadata(project),
    },
  }
}
