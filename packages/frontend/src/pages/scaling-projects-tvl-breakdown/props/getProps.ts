import { Layer2 } from '@l2beat/config'
import {
  ActivityApiResponse,
  DetailedTvlApiResponse,
  ProjectAssetsBreakdownApiResponse,
  TvlApiResponse,
} from '@l2beat/shared-pure'

import { Config } from '../../../build/config'
import { getNavbarProps } from '../../../components'
import { getHeader } from '../../../utils/project/getHeader'
import { Wrapped } from '../../Page'
import { TvlBreakdownPageProps } from '../view/ProjectTvlBreakdownPage'
import { getPageMetadata } from './getPageMetadata'
import { getTvlBreakdownHeader } from './getTvlBreakdownHeader'
import { getTvlBreakdownView } from './getTvlBreakdownView'

export function getProps(
  project: Layer2,
  config: Config,
  pagesData: {
    tvlApiResponse: TvlApiResponse | DetailedTvlApiResponse
    activityApiResponse: ActivityApiResponse
    tvlBreakdownApiResponse: ProjectAssetsBreakdownApiResponse
  },
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
    },
    wrapper: {
      // TODO: (maciekzygmunt) consider preload for tvl breakdown endpoint
      metadata: getPageMetadata(project),
    },
  }
}
