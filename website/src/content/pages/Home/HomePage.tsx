import { Chart, Footer, Header, Navbar, Page } from '../../common'
import { HomePageProps } from './props/getHomePageProps'
import { Projects } from './Projects'

export function HomePage(props: HomePageProps) {
  return (
    <Page metadata={props.metadata} preloadApi={props.apiEndpoint}>
      <Navbar />
      <Header
        title="Overview"
        tvl={props.tvl}
        sevenDayChange={props.sevenDayChange}
      />
      <Chart endpoint={props.apiEndpoint} />
      <Projects financialViewProps={props.financialViewProps} riskView={props.riskView} />
      <Footer />
    </Page>
  )
}
