import React from 'react'

import { Footer, FooterProps, Navbar, NavbarProps } from '../../../components'
import { About } from '../../../components/About'
import { RiskHeader } from '../../../components/header/RiskHeader'
import { ScalingNavigationTabs } from '../../../components/navigation-tabs/ScalingNavigationTabs'
import { PageContent } from '../../../components/PageContent'
import { ScalingRiskView, ScalingRiskViewProps } from './ScalingRiskView'

export interface ScalingRiskPageProps {
  riskView: ScalingRiskViewProps
  navbar: NavbarProps
  footer: FooterProps
  showActivity: boolean
}

export function ScalingRiskPage(props: ScalingRiskPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        <ScalingNavigationTabs
          showActivity={props.showActivity}
          selected="risk"
        />
        <main>
          <RiskHeader />
          <ScalingRiskView {...props.riskView} />
          <About />
        </main>
      </PageContent>
      <Footer {...props.footer} />
    </>
  )
}
