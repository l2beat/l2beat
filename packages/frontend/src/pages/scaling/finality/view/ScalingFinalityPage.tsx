import React from 'react'

import { FooterProps, NavbarProps } from '../../../../components'
import { SimplePageHeader } from '../../../../components/header/SimplePageHeader'
import { ScalingNavigationTabs } from '../../../../components/navigation-tabs/ScalingNavigationTabs'
import { DashboardLayout } from '../../../../layouts/DashboardLayout'
import {
  FinalityDiagram,
  FinalityDiagramsSection,
} from './FinalityDiagramsSection'
import { FinalityWarning } from './FinalityWarning'
import {
  ScalingFinalityView,
  ScalingFinalityViewProps,
} from './ScalingFinalityView'

export interface ScalingFinalityPageProps {
  finalityView: ScalingFinalityViewProps
  diagrams: FinalityDiagram[]
  navbar: NavbarProps
  footer: FooterProps
}

export function ScalingFinalityPage(props: ScalingFinalityPageProps) {
  return (
    <DashboardLayout
      navbar={props.navbar}
      footer={props.footer}
      tabs={
        <ScalingNavigationTabs
          features={props.navbar.features}
          selected="finality"
        />
      }
    >
      <SimplePageHeader>Finality</SimplePageHeader>
      <FinalityWarning />
      <ScalingFinalityView {...props.finalityView} />
      <FinalityDiagramsSection className="mt-20" diagrams={props.diagrams} />
    </DashboardLayout>
  )
}
