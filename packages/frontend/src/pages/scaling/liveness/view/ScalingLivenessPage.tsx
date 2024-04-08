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
import { LivenessWarning } from './LivenessWarning'
import {
  ScalingLivenessView,
  ScalingLivenessViewProps,
} from './ScalingLivenessView'

export interface ScalingLivenessPageProps {
  livenessView: ScalingLivenessViewProps
  navbar: NavbarProps
  footer: FooterProps
}

export function ScalingLivenessPage(props: ScalingLivenessPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        <ScalingNavigationTabs
          features={props.navbar.features}
          selected="liveness"
        />
        <main>
          <SimplePageHeader>Liveness</SimplePageHeader>
          <LivenessWarning />
          <ScalingLivenessView {...props.livenessView} />
          <OtherSites />
          <About />
        </main>
      </PageContent>
      <Footer {...props.footer} />
    </>
  )
}
