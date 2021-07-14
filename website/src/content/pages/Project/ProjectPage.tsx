import { Header, Navbar, Page } from '../../common'
import { Chart } from '../../common/Chart'
import { ProjectPageProps } from './getProjectPageProps'

export function ProjectPage(props: ProjectPageProps) {
  return (
    <Page title={props.title} preloadApi={props.apiEndpoint}>
      <Navbar />
      <Header
        title={props.name}
        titleLength={props.titleLength}
        icon={props.icon}
        tvl={props.tvl}
        sevenDayChange={props.sevenDayChange}
      />
      <Chart endpoint={props.apiEndpoint} tokens={props.tokens} />
    </Page>
  )
}
