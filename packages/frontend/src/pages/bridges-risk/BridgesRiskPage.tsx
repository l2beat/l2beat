import React from 'react'

import { Footer, FooterProps, Navbar, NavbarProps } from '../../components'
import { About } from '../../components/About'
import { MultisigReportAnnouncementBar } from '../../components/announcement/AnnouncementBar'
import { BridgesMvpWarning } from '../../components/BridgesMvpWarning'
import { FloatingBanner } from '../../components/floating-banner/FloatingBanner'
import { RiskHeader } from '../../components/header/RiskHeader'
import { BridgesNavigationTabs } from '../../components/navigation-tabs/BridgesNavigationTabs'
import { PageContent } from '../../components/PageContent'
import { BridgesRiskView, BridgesRiskViewProps } from './BridgesRiskView'

export interface BridgesRiskPageProps {
  riskView: BridgesRiskViewProps
  footer: FooterProps
  navbar: NavbarProps
  showMultisigReport: boolean
}

export function BridgesRiskPage(props: BridgesRiskPageProps) {
  return (
    <>
      {props.showMultisigReport && (
        <>
          <MultisigReportAnnouncementBar />
          <FloatingBanner />
        </>
      )}
      <Navbar {...props.navbar} />
      <PageContent>
        <BridgesNavigationTabs selected="risk" />
        <main>
          <RiskHeader />
          <BridgesMvpWarning />
          <BridgesRiskView {...props.riskView} />
          <About />
        </main>
      </PageContent>
      <Footer {...props.footer} />
    </>
  )
}
