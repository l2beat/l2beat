import { ApiMain } from '@l2beat/common'
import { Project } from '@l2beat/config'
import React from 'react'

import { getProps } from './props'
import { HomePage } from './view/HomePage'

export function getHomePage(projects: Project[], apiMain: ApiMain) {
  return {
    slug: '/',
    page: <HomePage {...getProps(projects, apiMain)} />,
  }
}
