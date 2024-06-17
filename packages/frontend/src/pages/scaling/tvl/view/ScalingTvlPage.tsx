import React from 'react'

import { Chart } from '../../../../components'
import { DashboardLayout } from '../../../../layouts/DashboardLayout'
import { ScalingTvlView, ScalingTvlViewProps } from './ScalingTvlView'

export interface ScalingTvlPageProps {
  tvlView: ScalingTvlViewProps
}

export function ScalingTvlPage(props: ScalingTvlPageProps) {
  return (
    <DashboardLayout>
      <Chart
        settingsId="scaling-tvl"
        initialType={{ type: 'scaling-detailed-tvl' }}
        header="tvl"
      />
      <ScalingTvlView {...props.tvlView} />
    </DashboardLayout>
  )
}
