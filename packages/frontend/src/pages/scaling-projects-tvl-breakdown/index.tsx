import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { PagesData } from '../Page'
import { getProps } from './props'
import { ProjectPage } from './view/ProjectPage'
import { getIncludedProjectsTvlBreakdown } from '../../utils/getIncludedProjectsTvlBreakdown'

export function getProjectTvlBreakdownPages(
  config: Config,
  pagesData: PagesData,
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
          <ProjectPage {...props} />
        </PageWrapper>
      ),
    }
  })
}
