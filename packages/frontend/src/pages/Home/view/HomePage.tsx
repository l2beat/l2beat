import React from 'react'

import { Chart, Footer, Header, Navbar } from '../../../components'
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
    <div className="Page leading-[1.15]">
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
    </div>
  )
}
