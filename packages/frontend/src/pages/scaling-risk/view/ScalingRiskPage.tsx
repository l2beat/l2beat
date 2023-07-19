import React from 'react'

import { Footer, FooterProps, Navbar, NavbarProps } from '../../../components'
import { About } from '../../../components/About'
import { MultisigReportAnnouncementBar } from '../../../components/announcement/AnnouncementBar'
import { FloatingBanner } from '../../../components/floating-banner/FloatingBanner'
import { RiskHeader } from '../../../components/header/RiskHeader'
import { ScalingNavigationTabs } from '../../../components/navigation-tabs/ScalingNavigationTabs'
import { PageContent } from '../../../components/PageContent'
import { ScalingRiskView, ScalingRiskViewProps } from './ScalingRiskView'

export interface ScalingRiskPageProps {
  riskView: ScalingRiskViewProps
  navbar: NavbarProps
  footer: FooterProps
  showActivity: boolean
  showMultisigReport: boolean
}

export function ScalingRiskPage(props: ScalingRiskPageProps) {
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
