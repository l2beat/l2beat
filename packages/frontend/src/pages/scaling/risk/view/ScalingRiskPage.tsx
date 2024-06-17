import React from 'react'

import { SimplePageHeader } from '../../../../components/header/SimplePageHeader'
import { DashboardLayout } from '../../../../layouts/DashboardLayout'
import { ScalingRiskView, ScalingRiskViewProps } from './ScalingRiskView'

export interface ScalingRiskPageProps {
  riskView: ScalingRiskViewProps
}

export function ScalingRiskPage(props: ScalingRiskPageProps) {
  return (
    <DashboardLayout>
      <SimplePageHeader>Risk Analysis</SimplePageHeader>
      <ScalingRiskView {...props.riskView} />
    </DashboardLayout>
  )
}
