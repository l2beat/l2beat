import React from 'react'

import {
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
} from '../../../../components'
import { About } from '../../../../components/About'
import { SimplePageHeader } from '../../../../components/header/SimplePageHeader'
import { ScalingNavigationTabs } from '../../../../components/navigation-tabs/ScalingNavigationTabs'
import { OtherSites } from '../../../../components/other-sites/OtherSites'
import { PageContent } from '../../../../components/PageContent'
import { ScalingRiskView, ScalingRiskViewProps } from './ScalingRiskView'

export interface ScalingRiskPageProps {
  riskView: ScalingRiskViewProps
  navbar: NavbarProps
  footer: FooterProps
}

export function ScalingRiskPage(props: ScalingRiskPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        <ScalingNavigationTabs
          features={props.navbar.features}
          selected="risk"
        />
        <main>
          <SimplePageHeader>Risk Analysis</SimplePageHeader>
          <ScalingRiskView {...props.riskView} />
          <OtherSites />
          <About />
        </main>
      </PageContent>
      <Footer {...props.footer} />
    </>
  )
}
