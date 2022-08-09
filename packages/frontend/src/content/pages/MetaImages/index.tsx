import { ApiMain } from '@l2beat/common'
import { Project } from '@l2beat/config'
import React from 'react'

import { getProps } from './getProps'
import { MetaImage } from './MetaImage'
import { MetaJobsImage } from './MetaJobsImage'

export function getMetaImagePages(projects: Project[], apiMain: ApiMain) {
  return [
    {
      slug: '/meta-images/overview',
      page: <MetaImage {...getProps(apiMain)} />,
    },
    {
      slug: '/meta-images/jobs',
      page: <MetaJobsImage />,
    },
    ...projects.map((project) => ({
      slug: `/meta-images/${project.slug}`,
      page: <MetaImage {...getProps(apiMain, project)} />,
    })),
  ]
}
