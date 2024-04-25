import React from 'react'

import { FooterProps, NavbarProps } from '../../../../components'
import { SimplePageHeader } from '../../../../components/header/SimplePageHeader'
import { ScalingNavigationTabs } from '../../../../components/navigation-tabs/ScalingNavigationTabs'
import { DashboardLayout } from '../../../../layouts/DashboardLayout'
import { ScalingRiskView, ScalingRiskViewProps } from './ScalingRiskView'

export interface ScalingRiskPageProps {
  riskView: ScalingRiskViewProps
  navbar: NavbarProps
  footer: FooterProps
}

export function ScalingRiskPage(props: ScalingRiskPageProps) {
  return (
    <DashboardLayout
      navbar={props.navbar}
      footer={props.footer}
      tabs={
        <ScalingNavigationTabs
          features={props.navbar.features}
          selected="risk"
        />
      }
    >
      <SimplePageHeader>Risk Analysis</SimplePageHeader>
      <ScalingRiskView {...props.riskView} />
    </DashboardLayout>
  )
}
