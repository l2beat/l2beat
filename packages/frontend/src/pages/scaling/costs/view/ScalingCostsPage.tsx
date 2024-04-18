import { Milestone } from '@l2beat/config'
import React from 'react'

import { Chart, FooterProps, NavbarProps } from '../../../../components'
import { ScalingNavigationTabs } from '../../../../components/navigation-tabs/ScalingNavigationTabs'
import { DashboardLayout } from '../../../../layouts/DashboardLayout'
import { ScalingCostsView, ScalingCostsViewProps } from './ScalingCostsView'

export interface ScalingCostsPageProps {
  costsView: ScalingCostsViewProps
  navbar: NavbarProps
  footer: FooterProps
  milestones: Milestone[] | undefined
}

export function ScalingCostsPage(props: ScalingCostsPageProps) {
  return (
    <DashboardLayout
      navbar={props.navbar}
      footer={props.footer}
      tabs={
        <ScalingNavigationTabs
          features={props.navbar.features}
          selected="costs"
        />
      }
    >
      <Chart
        settingsId="scaling-costs"
        initialType={{ type: 'scaling-costs' }}
        milestones={props.milestones}
        header="costs"
      />
      <ScalingCostsView {...props.costsView} />
    </DashboardLayout>
  )
}
