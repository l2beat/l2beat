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
  ScalingActivityView,
  ScalingActivityViewProps,
} from './ScalingActivityView'

export interface ActivityPageProps {
  activityView: ScalingActivityViewProps
  footer: FooterProps
  navbar: NavbarProps
  milestones: Milestone[] | undefined
}

export function ActivityPage(props: ActivityPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        <ScalingNavigationTabs
          features={props.navbar.features}
          selected="activity"
        />
        <main className="mt-4 md:mt-12">
          <Chart
            settingsId="scaling-activity"
            initialType={{ type: 'scaling-activity' }}
            milestones={props.milestones}
            header="activity"
          />
          <ScalingActivityView {...props.activityView} />
          <OtherSites />
          <About />
        </main>
      </PageContent>
      <Footer {...props.footer} />
    </>
  )
}
