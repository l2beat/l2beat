import { Chart, Footer, Header, Navbar, Page } from '../../../common'
import { PageMetadata } from '../../../PageMetadata'
import { About } from './About'
import { FinancialViewProps } from './FinancialView/FinancialView'
import { Projects } from './Projects'
import { RiskViewProps } from './RiskView/RiskView'

export interface HomePageProps {
  tvl: string
  sevenDayChange: string
  apiEndpoint: string
  financialView: FinancialViewProps
  riskView: RiskViewProps
  metadata: PageMetadata
}

export function HomePage(props: HomePageProps) {
  return (
    <Page metadata={props.metadata} preloadApi={props.apiEndpoint}>
      <Navbar />
      <Header
        title="Overview"
        tvl={props.tvl}
        sevenDayChange={props.sevenDayChange}
      />
      <main>
        <Chart endpoint={props.apiEndpoint} />
        <Projects
          financialView={props.financialView}
          riskView={props.riskView}
        />
        <About />
      </main>
      <Footer />
    </Page>
  )
}
