import React from 'react'

import { Chart } from '../../../../components'
import { BridgesMvpWarning } from '../../../../components/BridgesMvpWarning'
import { DashboardLayout } from '../../../../layouts/DashboardLayout'
import {
  BridgesSummaryView,
  BridgesSummaryViewProps,
} from './BridgesSummaryView'
import { OtherSites } from '../../../../components/other-sites/OtherSites'

export interface BridgesSummaryPageProps {
  tvlView: BridgesSummaryViewProps
}

export function BridgesSummaryPage(props: BridgesSummaryPageProps) {
  return (
    <DashboardLayout>
      <BridgesMvpWarning />
      <Chart
        settingsId="bridges-tvl"
        initialType={{ type: 'bridges-tvl', includeCanonical: false }}
        header="tvl"
      />
      <BridgesSummaryView {...props.tvlView} />
      <OtherSites />
    </DashboardLayout>
  )
}
