import React from 'react'

import { Chart, Footer, Header, Navbar } from '../../../components'
import { About } from '../../../components/About'
import { OtherSites } from '../../../components/OtherSites'
import { Page } from '../../../components/Page'
import { FinancialViewProps } from './FinancialView'
import { Projects } from './Projects'

export interface TvlPageProps {
  tvl: string
  sevenDayChange: string
  apiEndpoint: string
  financialView: FinancialViewProps
}

export function TvlPage(props: TvlPageProps) {
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
        <Projects financialView={props.financialView} />
        <OtherSites />
        <About />
      </main>
      <Footer />
    </Page>
  )
}
