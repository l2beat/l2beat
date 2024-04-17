import { Milestone } from '@l2beat/config'
import React from 'react'

import {
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
} from '../../../../components'
import { About } from '../../../../components/About'
import { FeesHeader } from '../../../../components/header/FeesHeader'
import { ScalingNavigationTabs } from '../../../../components/navigation-tabs/ScalingNavigationTabs'
import { OtherSites } from '../../../../components/other-sites/OtherSites'
import { PageContent } from '../../../../components/PageContent'
import { ScalingFeesView, ScalingFeesViewProps } from './ScalingFeesView'

export interface ScalingFeesPageProps {
  feesView: ScalingFeesViewProps
  navbar: NavbarProps
  footer: FooterProps
  milestones: Milestone[] | undefined
}

export function ScalingFeesPage(props: ScalingFeesPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        <ScalingNavigationTabs
          features={props.navbar.features}
          selected="costs"
        />
        <main className="mt-4 md:mt-12">
          <FeesHeader />
          <ScalingFeesView {...props.feesView} />
          <OtherSites />
          <About />
        </main>
      </PageContent>
      <Footer {...props.footer} />
    </>
  )
}
