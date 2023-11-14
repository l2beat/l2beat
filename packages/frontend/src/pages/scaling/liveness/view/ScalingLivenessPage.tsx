import React from 'react'

import {
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
} from '../../../../components'
import { About } from '../../../../components/About'
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
}

export function ScalingLivenessPage(props: ScalingLivenessPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        <ScalingNavigationTabs
          showActivity={props.showActivity}
          showLiveness
          selected="liveness"
        />
        <main className="mt-4 md:mt-12">
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
