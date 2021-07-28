import { Chart, Footer, Header, Navbar, Page } from '../../common'
import { ProjectDetails } from './ProjectDetails/ProjectDetails'
import { ProjectPageProps } from './props/getProjectPageProps'

export function ProjectPage(props: ProjectPageProps) {
  return (
    <Page metadata={props.metadata} preloadApi={props.chart.endpoint}>
      <Navbar />
      <Header {...props.header} />
      <Chart {...props.chart} />
      <ProjectDetails
        details={props.details}
        bridges={props.bridges}
        technology={props.technology}
        risks={props.risks}
        news={props.news}
      />
      <Footer />
    </Page>
  )
}
