import React from 'react'

import { SimplePageHeader } from '../../../../components/header/SimplePageHeader'
import { DashboardLayout } from '../../../../layouts/DashboardLayout'
import { LivenessWarning } from './LivenessWarning'
import {
  ScalingLivenessView,
  ScalingLivenessViewProps,
} from './ScalingLivenessView'

export interface ScalingLivenessPageProps {
  livenessView: ScalingLivenessViewProps
}

export function ScalingLivenessPage(props: ScalingLivenessPageProps) {
  return (
    <DashboardLayout>
      <SimplePageHeader>Liveness</SimplePageHeader>
      <LivenessWarning />
      <ScalingLivenessView {...props.livenessView} />
    </DashboardLayout>
  )
}
