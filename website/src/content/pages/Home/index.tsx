import { Project } from '@l2beat/config'
import React from 'react'
import { L2Data } from '../../L2Data'
import { getHomePage } from './props'
import { HomePage } from './view/HomePage'

interface Props {
  projects: Project[]
  l2Data: L2Data
}

export function Home(props: Props) {
  return <HomePage {...getHomePage(props.projects, props.l2Data)} />
}
