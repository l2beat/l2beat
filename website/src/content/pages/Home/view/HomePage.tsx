import { Chart, Footer, Header, Navbar, Page } from '../../../common'
import { PageMetadata } from '../../../PageMetadata'
import { FinancialViewProps } from './FinancialView/FinancialView'
import { Projects } from './Projects'
import { RiskViewProps } from './RiskView/RiskView'

export interface HomePageProps {
  tvl: string
  sevenDayChange: string
  apiEndpoint: string
  financialViewProps: FinancialViewProps
  riskViewProps: RiskViewProps
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
      <Chart endpoint={props.apiEndpoint} />
      <Projects
        financialViewProps={props.financialViewProps}
        riskViewProps={props.riskViewProps}
      />
      <Footer />
    </Page>
  )
}
