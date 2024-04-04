import { Milestone } from '@l2beat/config'
import React from 'react'

import {
  Chart,
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
  ScalingSummaryView,
  ScalingSummaryViewProps,
} from './ScalingSummaryView'

export interface SummaryPageProps {
  tvlView: ScalingSummaryViewProps
  navbar: NavbarProps
  footer: FooterProps
  milestones: Milestone[] | undefined
}

export function ScalingSummaryPage(props: SummaryPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        <ScalingNavigationTabs
          features={props.navbar.features}
          selected="summary"
        />
        <main className="mt-4 md:mt-12">
          <Chart
            settingsId="scaling-summary"
            initialType={{ type: 'scaling-tvl' }}
            milestones={props.milestones}
            header="tvl"
          />
          <ScalingSummaryView {...props.tvlView} />
          <OtherSites />
          <About />
        </main>
      </PageContent>
      <Footer {...props.footer} />
    </>
  )
}
