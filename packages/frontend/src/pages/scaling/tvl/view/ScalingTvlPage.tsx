import React from 'react'

import { Chart, FooterProps, NavbarProps } from '../../../../components'
import { ScalingNavigationTabs } from '../../../../components/navigation-tabs/ScalingNavigationTabs'
import { DashboardLayout } from '../../../../layouts/DashboardLayout'
import { ScalingTvlView, ScalingTvlViewProps } from './ScalingTvlView'

export interface ScalingTvlPageProps {
  navbar: NavbarProps
  footer: FooterProps
  tvlView: ScalingTvlViewProps
}

export function ScalingTvlPage(props: ScalingTvlPageProps) {
  return (
    <DashboardLayout
      navbar={props.navbar}
      footer={props.footer}
      tabs={
        <ScalingNavigationTabs
          features={props.navbar.features}
          selected="detailed"
        />
      }
    >
      <Chart
        settingsId="scaling-tvl"
        initialType={{ type: 'scaling-detailed-tvl' }}
        header="tvl"
      />
      <ScalingTvlView {...props.tvlView} />
    </DashboardLayout>
  )
}
