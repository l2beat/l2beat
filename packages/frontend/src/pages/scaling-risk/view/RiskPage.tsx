import React from 'react'

import { Footer, FooterProps, Header, NavbarProps } from '../../../components'
import { About } from '../../../components/About'
import { OtherSites } from '../../../components/OtherSites'
import { Page } from '../../../components/Page'
import { ScalingPageSelection } from '../../../components/ScalingPageSelection'
import { RiskView, RiskViewProps } from './RiskView'

export interface RiskPageProps {
  riskView: RiskViewProps
  navbar: NavbarProps
  footer: FooterProps
  showActivity: boolean
}

export function RiskPage(props: RiskPageProps) {
  return (
    <Page navbar={props.navbar}>
      <ScalingPageSelection showActivity={props.showActivity} selected="risk" />
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
