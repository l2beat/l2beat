import { TvlApiResponse } from '@l2beat/types'
import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { getIncludedProjects } from '../../utils/getIncludedProjects'
import { getProps } from './getProps'
import { MetaImage } from './MetaImage'

export function getMetaImagePages(config: Config, tvlResponse: TvlApiResponse) {
  const included = getIncludedProjects(config.layer2s, tvlResponse)
  const main = getProps(tvlResponse)
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
      const { props, wrapper } = getProps(tvlResponse, project)
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
