import { Chart, Footer, Header, Navbar, Page } from '../../common'
import { ProjectDescription } from './description/ProjectDescription'
import { ProjectPageProps } from './getProjectPageProps'

export function ProjectPage(props: ProjectPageProps) {
  return (
    <Page metadata={props.metadata} preloadApi={props.apiEndpoint}>
      <Navbar />
      <Header
        title={props.name}
        titleLength={props.titleLength}
        icon={props.icon}
        tvl={props.tvl}
        sevenDayChange={props.sevenDayChange}
      />
      <Chart endpoint={props.apiEndpoint} tokens={props.tokens} />
      <ProjectDescription details={props.details} bridges={props.bridges} />
      <Footer />
    </Page>
  )
}
