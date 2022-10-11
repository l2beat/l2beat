import { TvlApiResponse } from '@l2beat/types'
import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { getIncludedProjects } from '../../utils/getIncludedProjects'
import { getProps } from './getProps'
import { MetaImage } from './MetaImage'

export function getMetaImagePages(
  config: Config,
  tvlApiResponse: TvlApiResponse,
) {
  const included = getIncludedProjects(
    [...config.layer2s, ...config.bridges],
    tvlApiResponse,
  )
  const scaling = getProps(tvlApiResponse, undefined, 'layers2s')
  const bridges = getProps(tvlApiResponse, undefined, 'bridges')
  return [
    {
      slug: '/meta-images/overview-scaling',
      page: (
        <PageWrapper {...scaling.wrapper}>
          <MetaImage {...scaling.props} />
        </PageWrapper>
      ),
    },
    {
      slug: '/meta-images/overview-bridges',
      page: (
        <PageWrapper {...bridges.wrapper}>
          <MetaImage {...bridges.props} />
        </PageWrapper>
      ),
    },
    ...included.map((project) => {
      const { props, wrapper } = getProps(tvlApiResponse, project, 'layers2s')
      return {
        slug: `/meta-images/${project.display.slug}`,
        page: (
          <PageWrapper {...wrapper}>
            <MetaImage {...props} />
          </PageWrapper>
        ),
      }
    }),
  ]
}
