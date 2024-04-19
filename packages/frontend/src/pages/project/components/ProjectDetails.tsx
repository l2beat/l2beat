import { assertUnreachable } from '@l2beat/shared-pure'
import React from 'react'

import { ProjectDetailsSection } from '../types'
import { ChartSection } from './ChartSection'
import { ContractsSection } from './ContractsSection'
import { DetailedDescriptionSection } from './DetailedDescriptionSection'
import { KnowledgeNuggetsSection } from './KnowledgeNuggetsSection'
import { MilestonesSection } from './MilestonesSection'
import { PermissionsSection } from './PermissionsSection'
import { RiskAnalysis } from './RiskAnalysis'
import { RiskSection } from './RiskSection'
import { StageSection } from './StageSection'
import { StateDerivationSection } from './StateDerivationSection'
import { StateValidationSection } from './StateValidationSection'
import { TechnologySection } from './TechnologySection'
import { UpcomingDisclaimer } from './UpcomingDisclaimer'
import { UpgradesAndGovernanceSection } from './UpgradesAndGovernanceSection'

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
          case 'MilestonesSection':
            return (
              <MilestonesSection
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
          case 'DetailedDescriptionSection':
            return (
              <DetailedDescriptionSection
                key={item.props.id}
                sectionOrder={sectionOrder}
                {...item.props}
              />
            )
          case 'RiskAnalysisSection':
            return (
              <RiskAnalysis
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
          case 'RiskSection':
            return (
              <RiskSection
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
          case 'UpgradesAndGovernanceSection':
            return (
              <UpgradesAndGovernanceSection
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
          case 'UpcomingDisclaimer':
            return <UpcomingDisclaimer key={`${item.type}${index}`} />
          default:
            assertUnreachable(item)
        }
      })}
    </div>
  )
}
