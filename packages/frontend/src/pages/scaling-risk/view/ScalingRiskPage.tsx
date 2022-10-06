import React from 'react'

import { Footer, FooterProps, Header, NavbarProps } from '../../../components'
import { About } from '../../../components/About'
import { ScalingNavigationTabs } from '../../../components/navigation-tabs/ScalingNavigationTabs'
import { OtherSites } from '../../../components/OtherSites'
import { Page } from '../../../components/Page'
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
      <ScalingNavigationTabs
        showActivity={props.showActivity}
        selected="risk"
      />
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
