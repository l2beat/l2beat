import React from 'react'

import { Chart, Footer, Header, Navbar, Page } from '../../../components'
import { PageMetadata } from '../../PageMetadata'
import { About } from './About'
import { FinancialViewProps } from './FinancialView/FinancialView'
import { OtherSites } from './OtherSites'
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
        <OtherSites />
        <About />
      </main>
      <Footer />
    </Page>
  )
}
