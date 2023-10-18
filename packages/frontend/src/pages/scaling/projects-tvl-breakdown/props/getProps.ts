import { Layer2 } from '@l2beat/config'
import {
  DetailedTvlApiResponse,
  ProjectAssetsBreakdownApiResponse,
  TvlApiResponse,
} from '@l2beat/shared-pure'

import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { Wrapped } from '../../../Page'
import { TvlBreakdownPageProps } from '../view/ProjectTvlBreakdownPage'
import { getPageMetadata } from './getPageMetadata'
import { getTvlBreakdownHeader } from './getTvlBreakdownHeader'
import { getTvlBreakdownView } from './getTvlBreakdownView'

export function getProps(
  project: Layer2,
  config: Config,
  pagesData: {
    tvlApiResponse: TvlApiResponse | DetailedTvlApiResponse
    tvlBreakdownApiResponse: ProjectAssetsBreakdownApiResponse
  },
): Wrapped<TvlBreakdownPageProps> {
  const { tvlApiResponse, tvlBreakdownApiResponse } = pagesData

  return {
    props: {
      navbar: getNavbarProps(config, 'scaling'),
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
      // TODO: (maciekzygmunt) consider preload for tvl breakdown endpoint
      metadata: getPageMetadata(project),
      banner: config.features.banner,
    },
  }
}
