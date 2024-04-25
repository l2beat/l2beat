import React from 'react'

import { FooterProps, NavbarProps } from '../../../../components'
import { SimplePageHeader } from '../../../../components/header/SimplePageHeader'
import { ScalingNavigationTabs } from '../../../../components/navigation-tabs/ScalingNavigationTabs'
import { DashboardLayout } from '../../../../layouts/DashboardLayout'
import {
  ScalingDataAvailabilityView,
  ScalingDataAvailabilityViewProps,
} from './ScalingDataAvailabilityView'

export interface ScalingDataAvailabilityPageProps {
  dataAvailabilityView: ScalingDataAvailabilityViewProps
  navbar: NavbarProps
  footer: FooterProps
}

export function ScalingDataAvailabilityPage(
  props: ScalingDataAvailabilityPageProps,
) {
  return (
    <DashboardLayout
      navbar={props.navbar}
      footer={props.footer}
      tabs={
        <ScalingNavigationTabs
          features={props.navbar.features}
          selected="data-availability"
        />
      }
    >
      <SimplePageHeader>Data Availability</SimplePageHeader>
      <ScalingDataAvailabilityView {...props.dataAvailabilityView} />
    </DashboardLayout>
  )
}
