import { Layer2, Layer3 } from '@l2beat/config'
import {
  ProjectAssetsBreakdownApiResponse,
  TvlApiResponse,
} from '@l2beat/shared-pure'

import { Config } from '../../../../build/config'
import { Wrapped } from '../../../Page'
import { TvlBreakdownPageProps } from '../view/ProjectTvlBreakdownPage'
import { getPageMetadata } from './getPageMetadata'
import { getTvlBreakdownHeader } from './getTvlBreakdownHeader'
import { getTvlBreakdownView } from './getTvlBreakdownView'

export function getProps(
  project: Layer2 | Layer3,
  config: Config,
  pagesData: {
    tvlApiResponse: TvlApiResponse
    tvlBreakdownApiResponse: ProjectAssetsBreakdownApiResponse
  },
): Wrapped<TvlBreakdownPageProps> {
  const { tvlApiResponse, tvlBreakdownApiResponse } = pagesData

  return {
    props: {
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
      banner: config.features.banner,
    },
  }
}
