import React from 'react'
import { BridgesMvpWarning } from '../../../../components/BridgesMvpWarning'
import { SimplePageHeader } from '../../../../components/header/SimplePageHeader'
import { DashboardLayout } from '../../../../layouts/DashboardLayout'
import { BridgesRiskView, BridgesRiskViewProps } from './BridgesRiskView'

export interface BridgesRiskPageProps {
  riskView: BridgesRiskViewProps
}

export function BridgesRiskPage(props: BridgesRiskPageProps) {
  return (
    <DashboardLayout>
      <SimplePageHeader>Risk Analysis</SimplePageHeader>
      <BridgesMvpWarning />
      <BridgesRiskView {...props.riskView} />
    </DashboardLayout>
  )
}
