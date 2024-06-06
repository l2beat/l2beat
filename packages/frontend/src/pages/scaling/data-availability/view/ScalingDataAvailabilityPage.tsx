import React from 'react'

import { SimplePageHeader } from '../../../../components/header/SimplePageHeader'
import { DashboardLayout } from '../../../../layouts/DashboardLayout'
import {
  ScalingDataAvailabilityView,
  ScalingDataAvailabilityViewProps,
} from './ScalingDataAvailabilityView'

export interface ScalingDataAvailabilityPageProps {
  dataAvailabilityView: ScalingDataAvailabilityViewProps
}

export function ScalingDataAvailabilityPage(
  props: ScalingDataAvailabilityPageProps,
) {
  return (
    <DashboardLayout>
      <SimplePageHeader>Data Availability</SimplePageHeader>
      <ScalingDataAvailabilityView {...props.dataAvailabilityView} />
    </DashboardLayout>
  )
}
