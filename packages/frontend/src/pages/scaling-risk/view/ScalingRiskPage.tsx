import React from 'react'

import { Footer, FooterProps, Header, NavbarProps } from '../../../components'
import { About } from '../../../components/About'
import { OtherSites } from '../../../components/OtherSites'
import { Page } from '../../../components/Page'
import { ScalingPageSelection } from '../../../components/ScalingPageSelection'
import { ScalingRiskView, ScalingRiskViewProps } from './ScalingRiskView'

export interface ScalingRiskPageProps {
  riskView: ScalingRiskViewProps
  navbar: NavbarProps
  footer: FooterProps
  showActivity: boolean
}

export function ScalingRiskPage(props: ScalingRiskPageProps) {
  return (
    <Page navbar={props.navbar}>
      <ScalingPageSelection showActivity={props.showActivity} selected="risk" />
      <main>
        <Header title="Risk Analysis" />
        <ScalingRiskView {...props.riskView} />
        <OtherSites />
        <About />
      </main>
      <Footer {...props.footer} />
    </Page>
  )
}
