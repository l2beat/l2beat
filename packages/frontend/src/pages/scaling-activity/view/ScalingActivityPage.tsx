import { Milestone } from '@l2beat/config'
import React from 'react'

import {
  Chart,
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
} from '../../../components'
import { About } from '../../../components/About'
import { ActivityHeader } from '../../../components/header/ActivityHeader'
import { ScalingNavigationTabs } from '../../../components/navigation-tabs/ScalingNavigationTabs'
import { OtherSites } from '../../../components/other-sites/OtherSites'
import { PageContent } from '../../../components/PageContent'
import {
  ScalingActivityView,
  ScalingActivityViewProps,
} from './ScalingActivityView'

export interface ActivityPageProps {
  scalingFactor: string
  apiEndpoint: string
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
        <main>
          <ActivityHeader scalingFactor={props.scalingFactor} />
          <Chart
            type="activity"
            activityEndpoint={props.apiEndpoint}
            hasTvl={false}
            hasActivity
            milestones={props.milestones}
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
