import { Milestone } from '@l2beat/config'
import React from 'react'

import { Chart, FooterProps, NavbarProps } from '../../../../components'
import { ScalingNavigationTabs } from '../../../../components/navigation-tabs/ScalingNavigationTabs'
import { DashboardLayout } from '../../../../layouts/DashboardLayout'
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
    <DashboardLayout
      navbar={props.navbar}
      footer={props.footer}
      tabs={
        <ScalingNavigationTabs
          features={props.navbar.features}
          selected="summary"
        />
      }
    >
      <Chart
        settingsId="scaling-summary"
        initialType={{ type: 'scaling-tvl' }}
        milestones={props.milestones}
        header="tvl"
      />
      <ScalingSummaryView {...props.tvlView} />
    </DashboardLayout>
  )
}
