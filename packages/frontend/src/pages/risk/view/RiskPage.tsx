import React from 'react'

import { Footer, Header, Navbar } from '../../../components'
import { About } from '../../../components/About'
import { OtherSites } from '../../../components/OtherSites'
import { Page } from '../../../components/Page'
import { PageSelection } from '../../../components/PageSelection'
import { RiskView, RiskViewProps } from './RiskView'

export interface RiskPageProps {
  riskView: RiskViewProps
}

export function RiskPage(props: RiskPageProps) {
  return (
    <Page>
      <Navbar />
      <PageSelection
        pages={[
          { name: 'Total Value Locked', link: '/scaling/tvl', selected: false },
          { name: 'Risk analysis', link: '/scaling/risk', selected: true },
        ]}
      />
      <main>
        <Header title="Risk Analysis" />
        <RiskView {...props.riskView} />
        <OtherSites />
        <About />
      </main>
      <Footer />
    </Page>
  )
}
