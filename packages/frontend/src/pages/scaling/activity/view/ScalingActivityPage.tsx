import { Milestone } from '@l2beat/config'
import React from 'react'

import { Chart } from '../../../../components'
import { DashboardLayout } from '../../../../layouts/DashboardLayout'
import {
  ScalingActivityView,
  ScalingActivityViewProps,
} from './ScalingActivityView'

export interface ActivityPageProps {
  activityView: ScalingActivityViewProps
  milestones: Milestone[] | undefined
}

export function ActivityPage(props: ActivityPageProps) {
  return (
    <DashboardLayout>
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
