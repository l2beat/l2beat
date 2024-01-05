import { ActivityApiResponse, TvlApiResponse } from '@l2beat/shared-pure'
import compact from 'lodash/compact'
import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { ActivityMetaImage } from './ActivityMetaImage'
import { DetailedTvlMetaImage } from './DetailedTvlMetaImage'
import { getProps, getPropsActivity, getPropsDetailed } from './getProps'
import { TvlMetaImage } from './TvlMetaImage'

export function getMetaImagePages(
  config: Config,
  tvlApiResponse: TvlApiResponse,
  activityApiResponse?: ActivityApiResponse,
) {
  const included = [...config.layer2s, ...config.bridges]
  const scaling = getProps(tvlApiResponse, undefined, 'layers2s')
  const bridges = getProps(tvlApiResponse, undefined, 'bridges')
  const activity = activityApiResponse
    ? getPropsActivity(activityApiResponse)
    : undefined
  const detailedScaling = getPropsDetailed(
    tvlApiResponse,
    undefined,
    'layers2s',
  )

  return compact(
    [
      {
        slug: '/meta-images/overview-scaling',
        page: (
          <PageWrapper {...scaling.wrapper}>
            <TvlMetaImage {...scaling.props} />
          </PageWrapper>
        ),
      },
      {
        slug: '/meta-images/overview-detailed-scaling',
        page: (
          <PageWrapper {...detailedScaling.wrapper}>
            <DetailedTvlMetaImage {...detailedScaling.props} />
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
    ].concat(
      included.map((project) => {
        const { props, wrapper } = getPropsDetailed(
          tvlApiResponse,
          project,
          'layers2s',
        )
        return {
          slug: `/meta-images/${project.display.slug}-detailed`,
          page: (
            <PageWrapper {...wrapper}>
              <DetailedTvlMetaImage {...props} />
            </PageWrapper>
          ),
        }
      }),
    ),
  )
}
