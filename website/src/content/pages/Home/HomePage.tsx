import { Chart, Footer, Header, Navbar, Page } from '../../common'
import { HomePageProps } from './getHomePageProps'
import { Projects } from './Projects'

export function HomePage(props: HomePageProps) {
  return (
    <Page title={props.title} preloadApi={props.apiEndpoint}>
      <Navbar />
      <Header
        title="Overview"
        tvl={props.tvl}
        sevenDayChange={props.sevenDayChange}
      />
      <Chart endpoint={props.apiEndpoint} />
      <Projects financialView={props.financialView} />
      <Footer />
    </Page>
  )
}
