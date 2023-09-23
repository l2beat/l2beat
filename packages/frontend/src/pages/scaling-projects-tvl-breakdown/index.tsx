import {
  DetailedTvlApiResponse,
  ProjectAssetsBreakdownApiResponse,
  TvlApiResponse,
} from '@l2beat/shared-pure'
import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { getIncludedProjectsTvlBreakdown } from '../../utils/getIncludedProjectsTvlBreakdown'
import { getProps } from './props'
import { ProjectTvlBreakdownPage } from './view/ProjectTvlBreakdownPage'

export function getProjectTvlBreakdownPages(
  config: Config,
  pagesData: {
    tvlApiResponse: TvlApiResponse | DetailedTvlApiResponse
    tvlBreakdownApiResponse: ProjectAssetsBreakdownApiResponse
  },
) {
  const included = getIncludedProjectsTvlBreakdown(
    config.layer2s,
    pagesData.tvlApiResponse,
    pagesData.tvlBreakdownApiResponse,
    config.features.buildAllProjectPages,
  )

  return included.map((project) => {
    const { wrapper, props } = getProps(project, config, pagesData)
    return {
      slug: `/scaling/projects/${project.display.slug}/tvl-breakdown`,
      page: (
        <PageWrapper {...wrapper}>
          <ProjectTvlBreakdownPage {...props} />
        </PageWrapper>
      ),
    }
  })
}
