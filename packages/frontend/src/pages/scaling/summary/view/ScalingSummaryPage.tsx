import { Milestone } from '@l2beat/config'
import React from 'react'

import { Chart } from '../../../../components'
import { DashboardLayout } from '../../../../layouts/DashboardLayout'
import {
  ScalingSummaryView,
  ScalingSummaryViewProps,
} from './ScalingSummaryView'
import { OtherSites } from '../../../../components/other-sites/OtherSites'

export interface SummaryPageProps {
  tvlView: ScalingSummaryViewProps

  milestones: Milestone[] | undefined
}

export function ScalingSummaryPage(props: SummaryPageProps) {
  return (
    <DashboardLayout>
      <Chart
        settingsId="scaling-summary"
        initialType={{ type: 'scaling-tvl' }}
        milestones={props.milestones}
        header="tvl"
      />
      <ScalingSummaryView {...props.tvlView} />
      <OtherSites />
    </DashboardLayout>
  )
}
