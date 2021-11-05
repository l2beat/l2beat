import { Project } from '@l2beat/config'
import React from 'react'

import { L2Data } from '../../L2Data'
import { getProps } from './getProps'
import { MetaImage } from './MetaImage'
import { MetaJobsImage } from './MetaJobsImage'

export function getMetaImagePages(projects: Project[], l2Data: L2Data) {
  return [
    {
      slug: '/meta-images/overview',
      page: <MetaImage {...getProps(l2Data)} />,
    },
    {
      slug: '/meta-images/jobs',
      page: <MetaJobsImage />,
    },
    ...projects.map((project) => ({
      slug: `/meta-images/${project.slug}`,
      page: <MetaImage {...getProps(l2Data, project)} />,
    })),
  ]
}
