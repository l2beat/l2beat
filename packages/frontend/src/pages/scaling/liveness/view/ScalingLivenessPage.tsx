import React from 'react'

import { FooterProps, NavbarProps } from '../../../../components'
import { SimplePageHeader } from '../../../../components/header/SimplePageHeader'
import { ScalingNavigationTabs } from '../../../../components/navigation-tabs/ScalingNavigationTabs'
import { DashboardLayout } from '../../../../layouts/DashboardLayout'
import { LivenessWarning } from './LivenessWarning'
import {
  ScalingLivenessView,
  ScalingLivenessViewProps,
} from './ScalingLivenessView'

export interface ScalingLivenessPageProps {
  livenessView: ScalingLivenessViewProps
  navbar: NavbarProps
  footer: FooterProps
}

export function ScalingLivenessPage(props: ScalingLivenessPageProps) {
  return (
    <DashboardLayout
      navbar={props.navbar}
      footer={props.footer}
      tabs={
        <ScalingNavigationTabs
          features={props.navbar.features}
          selected="liveness"
        />
      }
    >
      <SimplePageHeader>Liveness</SimplePageHeader>
      <LivenessWarning />
      <ScalingLivenessView {...props.livenessView} />
    </DashboardLayout>
  )
}
