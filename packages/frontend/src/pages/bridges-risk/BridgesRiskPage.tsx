import React from 'react'

import { Footer, Header, Navbar } from '../../components'
import { About } from '../../components/About'
import { OtherSites } from '../../components/OtherSites'
import { Page } from '../../components/Page'
import { PageSelection } from '../../components/PageSelection'
import { BridgesRiskViewProps, RiskView } from './BridgesRiskView'

export type BridgesRiskPageProps = BridgesRiskViewProps

export function BridgesRiskPage(props: BridgesRiskPageProps) {
  return (
    <Page>
      <Navbar />
      <PageSelection
        pages={[
          { name: 'Risk analysis', link: '/bridges/risk', selected: true },
        ]}
      />
      <main>
        <Header title="Risk Analysis" />
        <RiskView {...props} />
        <OtherSites />
        <About />
      </main>
      <Footer />
    </Page>
  )
}
