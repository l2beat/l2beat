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
  const included = getIncludedProjects(config.layer2s, tvlApiResponse)
  const main = getProps(tvlApiResponse)
  return [
    {
      slug: '/meta-images/overview',
      page: (
        <PageWrapper {...main.wrapper}>
          <MetaImage {...main.props} />
        </PageWrapper>
      ),
    },
    ...included.map((project) => {
      const { props, wrapper } = getProps(tvlApiResponse, project)
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
