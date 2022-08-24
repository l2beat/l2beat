import React from 'react'

import { Chart, Footer, Header, Navbar } from '../../../components'
import { Page } from '../../../components/Page'
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
}

export function HomePage(props: HomePageProps) {
  return (
    <Page>
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
