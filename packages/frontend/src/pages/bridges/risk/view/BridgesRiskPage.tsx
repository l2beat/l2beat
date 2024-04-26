import React from 'react'

import { FooterProps, NavbarProps } from '../../../../components'
import { BridgesMvpWarning } from '../../../../components/BridgesMvpWarning'
import { SimplePageHeader } from '../../../../components/header/SimplePageHeader'
import { BridgesNavigationTabs } from '../../../../components/navigation-tabs/BridgesNavigationTabs'
import { DashboardLayout } from '../../../../layouts/DashboardLayout'
import { BridgesRiskView, BridgesRiskViewProps } from './BridgesRiskView'

export interface BridgesRiskPageProps {
  riskView: BridgesRiskViewProps
  footer: FooterProps
  navbar: NavbarProps
}

export function BridgesRiskPage(props: BridgesRiskPageProps) {
  return (
    <DashboardLayout
      navbar={props.navbar}
      footer={props.footer}
      hideOtherSites
      tabs={<BridgesNavigationTabs selected="risk" />}
    >
      <SimplePageHeader>Risk Analysis</SimplePageHeader>
      <BridgesMvpWarning />
      <BridgesRiskView {...props.riskView} />
    </DashboardLayout>
  )
}
