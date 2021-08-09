import {
  Chart,
  ChartProps,
  Footer,
  Header,
  HeaderProps,
  Navbar,
  Page,
} from '../../../common'
import { PageMetadata } from '../../../PageMetadata'
import { ProjectDetails, ProjectDetailsProps } from './ProjectDetails'

export interface ProjectPageProps {
  metadata: PageMetadata
  headerProps: HeaderProps
  chartProps: ChartProps
  projectDetailsProps: ProjectDetailsProps
}

export function ProjectPage(props: ProjectPageProps) {
  return (
    <Page metadata={props.metadata} preloadApi={props.chartProps.endpoint}>
      <Navbar />
      <Header {...props.headerProps} />
      <Chart {...props.chartProps} />
      <ProjectDetails {...props.projectDetailsProps} />
      <Footer />
    </Page>
  )
}
