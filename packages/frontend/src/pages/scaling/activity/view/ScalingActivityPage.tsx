import { Milestone } from '@l2beat/config'
import React from 'react'

import { Chart, FooterProps, NavbarProps } from '../../../../components'
import { ScalingNavigationTabs } from '../../../../components/navigation-tabs/ScalingNavigationTabs'
import { DashboardLayout } from '../../../../layouts/DashboardLayout'
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
    <DashboardLayout
      navbar={props.navbar}
      footer={props.footer}
      tabs={
        <ScalingNavigationTabs
          features={props.navbar.features}
          selected="activity"
        />
      }
    >
      <Chart
        settingsId="scaling-activity"
        initialType={{ type: 'scaling-activity' }}
        milestones={props.milestones}
        header="activity"
      />
      <ScalingActivityView {...props.activityView} />
    </DashboardLayout>
  )
}
