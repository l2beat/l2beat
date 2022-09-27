import { ApiMain } from '@l2beat/types'
import React from 'react'

import { Config } from '../../build/config'
import { PageWrapper } from '../../components'
import { getIncludedProjects } from '../../utils/getIncludedProjects'
import { getProps } from './getProps'
import { MetaImage } from './MetaImage'

export function getMetaImagePages(config: Config, apiMain: ApiMain) {
  const included = getIncludedProjects(config.layer2s, apiMain)
  const main = getProps(apiMain)
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
      const { props, wrapper } = getProps(apiMain, project)
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
