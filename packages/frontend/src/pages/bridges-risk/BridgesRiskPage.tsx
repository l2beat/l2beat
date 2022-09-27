import React from 'react'

import { Footer, FooterProps, Header, NavbarProps } from '../../components'
import { About } from '../../components/About'
import { BridgesPageSelection } from '../../components/BridgesPageSelection'
import { OtherSites } from '../../components/OtherSites'
import { Page } from '../../components/Page'
import { BridgesRiskViewProps, RiskView } from './BridgesRiskView'

export interface BridgesRiskPageProps {
  riskView: BridgesRiskViewProps
  footer: FooterProps
  navbar: NavbarProps
}

export function BridgesRiskPage(props: BridgesRiskPageProps) {
  return (
    <Page navbar={props.navbar}>
      <BridgesPageSelection selected="risk" />
      <main>
        <Header title="Risk Analysis" />
        <RiskView {...props.riskView} />
        <OtherSites />
        <About />
      </main>
      <Footer {...props.footer} />
    </Page>
  )
}
