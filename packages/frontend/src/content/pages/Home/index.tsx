import { Project } from '@l2beat/config'
import React from 'react'

import { L2Data } from '../../L2Data'
import { getProps } from './props'
import { HomePage } from './view/HomePage'

export function getHomePage(projects: Project[], l2Data: L2Data) {
  return {
    slug: '/',
    page: <HomePage {...getProps(projects, l2Data)} />,
  }
}
