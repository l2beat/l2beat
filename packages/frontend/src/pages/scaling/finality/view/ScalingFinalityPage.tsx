import React from 'react'

import { SimplePageHeader } from '../../../../components/header/SimplePageHeader'
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
}

export function ScalingFinalityPage(props: ScalingFinalityPageProps) {
  return (
    <DashboardLayout>
      <SimplePageHeader>Finality</SimplePageHeader>
      <FinalityWarning />
      <ScalingFinalityView {...props.finalityView} />
      <FinalityDiagramsSection className="mt-20" diagrams={props.diagrams} />
    </DashboardLayout>
  )
}
