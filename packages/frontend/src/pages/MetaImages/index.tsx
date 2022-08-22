import { Project } from '@l2beat/config'
import { ApiMain } from '@l2beat/types'
import React from 'react'

import { getProps } from './getProps'
import { MetaImagePage } from './MetaImagePage'

export function getMetaImagePages(projects: Project[], apiMain: ApiMain) {
  return [
    {
      slug: '/meta-images/overview',
      page: <MetaImagePage {...getProps(apiMain)} />,
    },
    ...projects.map((project) => ({
      slug: `/meta-images/${project.slug}`,
      page: <MetaImagePage {...getProps(apiMain, project)} />,
    })),
  ]
}
