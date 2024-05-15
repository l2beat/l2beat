import React from 'react'

import { Chart, FooterProps, NavbarProps } from '../../../../components'
import { BridgesMvpWarning } from '../../../../components/BridgesMvpWarning'
import { BridgesNavigationTabs } from '../../../../components/navigation-tabs/BridgesNavigationTabs'
import { DashboardLayout } from '../../../../layouts/DashboardLayout'
import {
  BridgesSummaryView,
  BridgesSummaryViewProps,
} from './BridgesSummaryView'

export interface BridgesSummaryPageProps {
  tvlView: BridgesSummaryViewProps
  footer: FooterProps
  navbar: NavbarProps
}

export function BridgesSummaryPage(props: BridgesSummaryPageProps) {
  return (
    <DashboardLayout
      navbar={props.navbar}
      footer={props.footer}
      hideOtherSites
      tabs={<BridgesNavigationTabs selected="summary" />}
    >
      <BridgesMvpWarning />
      <Chart
        settingsId="bridges-tvl"
        initialType={{ type: 'bridges-tvl', includeCanonical: false }}
        header="tvl"
      />
      <BridgesSummaryView {...props.tvlView} />
    </DashboardLayout>
  )
}
