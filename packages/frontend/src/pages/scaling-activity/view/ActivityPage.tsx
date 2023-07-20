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
import { FloatingBanner } from '../../../components/floating-banner/FloatingBanner'
import { ActivityHeader } from '../../../components/header/ActivityHeader'
import { ScalingNavigationTabs } from '../../../components/navigation-tabs/ScalingNavigationTabs'
import { PageContent } from '../../../components/PageContent'
import { ReportBar } from '../../../components/report/ReportBar'
import { ActivityView, ActivityViewProps } from './ActivityView'

export interface ActivityPageProps {
  scalingFactor: string
  apiEndpoint: string
  activityView: ActivityViewProps
  footer: FooterProps
  navbar: NavbarProps
  showActivity: boolean
  milestones?: Milestone[]
  showMultisigReport: boolean
}

export function ActivityPage(props: ActivityPageProps) {
  return (
    <>
      {props.showMultisigReport && (
        <>
          <ReportBar />
          <FloatingBanner />
        </>
      )}
      <Navbar {...props.navbar} />
      <PageContent>
        <ScalingNavigationTabs
          showActivity={props.showActivity}
          selected="activity"
        />
        <main>
          <ActivityHeader scalingFactor={props.scalingFactor} />
          <Chart
            type={'activity'}
            activityEndpoint={props.apiEndpoint}
            hasTvl={false}
            hasActivity
            milestones={props.milestones}
          />
          <ActivityView {...props.activityView} />
          <About />
        </main>
      </PageContent>
      <Footer {...props.footer} />
    </>
  )
}
