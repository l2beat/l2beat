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
import {
  ScalingFinalityView,
  ScalingFinalityViewProps,
} from './ScalingFinalityView'

export interface FinalityPageProps {
  finalityView: ScalingFinalityViewProps
  navbar: NavbarProps
  footer: FooterProps
  showActivity: boolean
  showLiveness: boolean
  showFinality: boolean
}

export function ScalingFinalityPage(props: FinalityPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        <ScalingNavigationTabs
          showActivity={props.showActivity}
          showFinality={props.showFinality}
          showLiveness={props.showLiveness}
          selected="finality"
        />
        <main className="mt-4 md:mt-12">
          <ScalingFinalityView {...props.finalityView} />
          <OtherSites />
          <About />
        </main>
      </PageContent>
      <Footer {...props.footer} />
    </>
  )
}
