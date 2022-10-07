import React from 'react'

import { Footer, FooterProps, Header, NavbarProps } from '../../components'
import { About } from '../../components/About'
import { BridgesMvpWarning } from '../../components/BridgesMvpWarning'
import { IncludeLayer2sCheckbox } from '../../components/IncludeLayer2sCheckbox'
import { BridgesNavigationTabs } from '../../components/navigation-tabs/BridgesNavigationTabs'
import { OtherSites } from '../../components/OtherSites'
import { Page } from '../../components/Page'
import { BridgesRiskView, BridgesRiskViewProps } from './BridgesRiskView'

export interface BridgesRiskPageProps {
  riskView: BridgesRiskViewProps
  footer: FooterProps
  navbar: NavbarProps
}

export function BridgesRiskPage(props: BridgesRiskPageProps) {
  return (
    <Page navbar={props.navbar}>
      <BridgesNavigationTabs selected="risk" />
      <main>
        <BridgesMvpWarning />
        <Header title="Risk Analysis" />
        <IncludeLayer2sCheckbox />
        <BridgesRiskView {...props.riskView} />
        <OtherSites />
        <About />
      </main>
      <Footer {...props.footer} />
    </Page>
  )
}
