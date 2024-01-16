import React from 'react'

import {
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
} from '../../../../components'
import { About } from '../../../../components/About'
import { LivenessHeader } from '../../../../components/header/LivenessHeader'
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
  showActivity: boolean
  showLiveness: boolean
  showFinality: boolean
}

export function ScalingLivenessPage(props: ScalingLivenessPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        <ScalingNavigationTabs
          showActivity={props.showActivity}
          showFinality={props.showFinality}
          showLiveness={props.showLiveness}
          selected="liveness"
        />
        <main>
          <LivenessHeader />
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
