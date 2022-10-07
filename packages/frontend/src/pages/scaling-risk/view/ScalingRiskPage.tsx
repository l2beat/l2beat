import React from 'react'

import { Footer, FooterProps, NavbarProps } from '../../../components'
import { About } from '../../../components/About'
import { RiskHeader } from '../../../components/header/RiskHeader'
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
        <RiskHeader />
        <ScalingRiskView {...props.riskView} />
        <OtherSites />
        <About />
      </main>
      <Footer {...props.footer} />
    </Page>
  )
}
