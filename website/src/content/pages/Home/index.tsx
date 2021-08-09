import { HomePage } from './view/HomePage'
import { getHomePage } from './props'
import { Project } from '@l2beat/config'
import { L2Data } from '../../L2Data'

interface Props {
  projects: Project[]
  l2Data: L2Data
}

export function Home(props: Props) {
  return <HomePage {...getHomePage(props.projects, props.l2Data)} />
}
