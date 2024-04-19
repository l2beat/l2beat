import { assertUnreachable } from '@l2beat/shared-pure'
import React from 'react'

import { ChartSection } from '../sections/ChartSection'
import { ContractsSection } from '../sections/ContractsSection/ContractsSection'
import { DetailedDescriptionSection } from '../sections/DetailedDescriptionSection'
import { KnowledgeNuggetsSection } from '../sections/KnowledgeNuggetsSection/KnowledgeNuggetsSection'
import { MilestonesSection } from '../sections/MilestonesSection/MilestonesSection'
import { PermissionsSection } from '../sections/PermissionsSection'
import { RiskAnalysisSection } from '../sections/RiskAnalysisSection'
import { RiskSection } from '../sections/RiskSection'
import { StageSection } from '../sections/StageSection'
import { StateDerivationSection } from '../sections/StateDerivationSection'
import { StateValidationSection } from '../sections/StateValidationSection'
import { TechnologySection } from '../sections/TechnologySection'
import { ProjectDetailsSection } from '../sections/types'
import { UpcomingDisclaimer } from '../sections/UpcomingDisclaimer'
import { UpgradesAndGovernanceSection } from '../sections/UpgradesAndGovernanceSection'

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
