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
  showActivity: boolean
  showDetailedTvl: boolean
  milestones?: Milestone[]
}

export function ActivityPage(props: ActivityPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        <ScalingNavigationTabs
          showActivity={props.showActivity}
          showDetailedTvl={props.showDetailedTvl}
          selected="activity"
        />
        <main className="mt-4 md:mt-12">
          <Chart
            settingsId="scaling-activity"
            initialType={{ type: 'layer2-activity' }}
            milestones={props.milestones}
            withHeader
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
