import React from 'react'

import { Chart, Footer, Header, Navbar } from '../../../components'
import { About } from '../../../components/About'
import { OtherSites } from '../../../components/OtherSites'
import { Page } from '../../../components/Page'
import { Projects } from './Projects'
import { RiskViewProps } from './RiskView'

export interface RiskPageProps {
  tvl: string
  sevenDayChange: string
  apiEndpoint: string
  riskView: RiskViewProps
}

export function RiskPage(props: RiskPageProps) {
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
        <Projects riskView={props.riskView} />
        <OtherSites />
        <About />
      </main>
      <Footer />
    </Page>
  )
}
