import { ActivityApiResponse, TvlApiResponse } from '@l2beat/shared-pure'
import { compact } from 'lodash'
import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { getIncludedProjects } from '../../utils/getIncludedProjects'
import { ActivityMetaImage } from './ActivityMetaImage'
import { getProps, getPropsActivity } from './getProps'
import { TvlMetaImage } from './TvlMetaImage'

export function getMetaImagePages(
  config: Config,
  tvlApiResponse: TvlApiResponse,
  activityApiResponse?: ActivityApiResponse,
) {
  const included = getIncludedProjects(
    [...config.layer2s, ...config.bridges],
    tvlApiResponse,
  )
  const scaling = getProps(tvlApiResponse, undefined, 'layers2s')
  const bridges = getProps(tvlApiResponse, undefined, 'bridges')
  const activity = activityApiResponse
    ? getPropsActivity(activityApiResponse)
    : undefined

  return compact([
    {
      slug: '/meta-images/overview-scaling',
      page: (
        <PageWrapper {...scaling.wrapper}>
          <TvlMetaImage {...scaling.props} />
        </PageWrapper>
      ),
    },
    activity && {
      slug: '/meta-images/overview-scaling-activity',
      page: (
        <PageWrapper {...activity.wrapper}>
          <ActivityMetaImage {...activity.props} />
        </PageWrapper>
      ),
    },
    {
      slug: '/meta-images/overview-bridges',
      page: (
        <PageWrapper {...bridges.wrapper}>
          <TvlMetaImage {...bridges.props} />
        </PageWrapper>
      ),
    },
    ...included.map((project) => {
      const { props, wrapper } = getProps(tvlApiResponse, project, 'layers2s')
      return {
        slug: `/meta-images/${project.display.slug}`,
        page: (
          <PageWrapper {...wrapper}>
            <TvlMetaImage {...props} />
          </PageWrapper>
        ),
      }
    }),
  ])
}
