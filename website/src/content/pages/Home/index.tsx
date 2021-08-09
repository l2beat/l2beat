import { HomePage } from './HomePage'
import { getHomePageProps } from './props'
import { Project } from '@l2beat/config'
import { L2Data } from '../../L2Data'

interface Props {
  projects: Project[]
  l2Data: L2Data
}

export function Home(props: Props) {
  return <HomePage {...getHomePageProps(props.projects, props.l2Data)} />
}
