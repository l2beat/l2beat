import { assertUnreachable } from '@l2beat/shared-pure'
import React from 'react'

import { ContractsSection } from './sections/contracts/contracts-section'
import { MarkdownSection } from './sections/markdown-section'
import { PermissionsSection } from './sections/permissions/permissions-section'
import { RiskAnalysisSection } from './sections/risk-analysis-section'
import { type ProjectDetailsSection } from './sections/types'
import { MilestonesSection } from './sections/milestones-section'
import { RiskSummarySection } from './sections/risk-summary/risk-summary-section'
import { DetailedDescriptionSection } from './sections/detailed-description-section'
import { StateValidationSection } from './sections/state-validation-section'
import { StateDerivationSection } from './sections/state-derivation-section'
import { KnowledgeNuggetsSection } from './sections/knowledge-nuggets/knowledge-nuggets-section'
import { TechnologySection } from './sections/technology/technology-section'
import { StageSection } from './sections/stage-section'
import { UpcomingDisclaimer } from './sections/upcoming-disclaimer'
import { ChartSection } from './sections/chart-section'

export interface ProjectDetailsProps {
  items: ProjectDetailsSection[]
  isUpcoming?: boolean
}

export function ProjectDetails(props: ProjectDetailsProps) {
  return (
    <div className="px-4 md:px-0">
      {props.items.map((item, index) => {
        const sectionOrder = index + 1

        switch (item.type) {
          case 'ChartSection':
            return (
              <ChartSection
                key={item.props.id}
                sectionOrder={sectionOrder}
                {...item.props}
              />
            )
          case 'DetailedDescriptionSection':
            return (
              <DetailedDescriptionSection
                key={item.props.id}
                sectionOrder={sectionOrder}
                {...item.props}
              />
            )
          case 'MilestonesSection':
            return (
              <MilestonesSection
                key={item.props.id}
                sectionOrder={sectionOrder}
                {...item.props}
              />
            )
          case 'RiskSummarySection':
            return (
              <RiskSummarySection
                key={item.props.id}
                sectionOrder={sectionOrder}
                {...item.props}
              />
            )
          case 'RiskAnalysisSection':
            return (
              <RiskAnalysisSection
                key={item.props.id}
                sectionOrder={sectionOrder}
                {...item.props}
              />
            )
          case 'StageSection':
            return (
              <StageSection
                key={item.props.id}
                sectionOrder={sectionOrder}
                {...item.props}
              />
            )
          case 'TechnologySection':
            return (
              <TechnologySection
                key={item.props.id}
                sectionOrder={sectionOrder}
                {...item.props}
              />
            )
          case 'StateDerivationSection':
            return (
              <StateDerivationSection
                key={item.props.id}
                sectionOrder={sectionOrder}
                {...item.props}
              />
            )
          case 'StateValidationSection':
            return (
              <StateValidationSection
                key={item.props.id}
                sectionOrder={sectionOrder}
                {...item.props}
              />
            )

          case 'MarkdownSection':
            return (
              <MarkdownSection
                key={item.props.id}
                sectionOrder={sectionOrder}
                {...item.props}
              />
            )
          case 'PermissionsSection':
            return (
              <PermissionsSection
                key={item.props.id}
                sectionOrder={sectionOrder}
                {...item.props}
              />
            )
          case 'ContractsSection':
            return (
              <ContractsSection
                key={item.props.id}
                sectionOrder={sectionOrder}
                {...item.props}
              />
            )
          case 'KnowledgeNuggetsSection':
            return (
              <KnowledgeNuggetsSection
                key={item.props.id}
                sectionOrder={sectionOrder}
                {...item.props}
              />
            )
          case 'UpcomingDisclaimer':
            return <UpcomingDisclaimer />
          default:
            assertUnreachable(item)
        }
      })}
    </div>
  )
}
