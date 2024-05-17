import React from 'react'

import { FooterProps, NavbarProps } from '../../../../components'
import { BridgesMvpWarning } from '../../../../components/BridgesMvpWarning'
import { SimplePageHeader } from '../../../../components/header/SimplePageHeader'
import { BridgesNavigationTabs } from '../../../../components/navigation-tabs/BridgesNavigationTabs'
import { DashboardLayout } from '../../../../layouts/DashboardLayout'
import { BridgesRiskView, BridgesRiskViewProps } from './BridgesRiskView'

export interface BridgesRiskPageProps {
  riskView: BridgesRiskViewProps
}

export function BridgesRiskPage(props: BridgesRiskPageProps) {
  return (
    <DashboardLayout hideOtherSites>
      <SimplePageHeader>Risk Analysis</SimplePageHeader>
      <BridgesMvpWarning />
      <BridgesRiskView {...props.riskView} />
    </DashboardLayout>
  )
}
