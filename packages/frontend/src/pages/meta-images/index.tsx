import { Layer2 } from '@l2beat/config'
import { ApiMain } from '@l2beat/types'
import React from 'react'

import { PageWrapper } from '../../components'
import { getProps } from './getProps'
import { MetaImage } from './MetaImage'

export function getMetaImagePages(projects: Layer2[], apiMain: ApiMain) {
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
    ...projects.map((project) => {
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
