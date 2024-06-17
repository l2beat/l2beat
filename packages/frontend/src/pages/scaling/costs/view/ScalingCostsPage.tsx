import { Milestone } from '@l2beat/config'
import React from 'react'

import { Chart } from '../../../../components'
import { DashboardLayout } from '../../../../layouts/DashboardLayout'
import { ScalingCostsView, ScalingCostsViewProps } from './ScalingCostsView'

export interface ScalingCostsPageProps {
  costsView: ScalingCostsViewProps

  milestones: Milestone[] | undefined
}

export function ScalingCostsPage(props: ScalingCostsPageProps) {
  return (
    <DashboardLayout>
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
