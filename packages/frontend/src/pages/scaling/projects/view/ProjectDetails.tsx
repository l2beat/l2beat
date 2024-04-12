import { assertUnreachable } from '@l2beat/shared-pure'
import React from 'react'

import { ChartSection } from '../../../../components/project/ChartSection'
import { ContractsSection } from '../../../../components/project/ContractsSection'
import { DetailedDescriptionSection } from '../../../../components/project/DetailedDescriptionSection'
import { KnowledgeNuggetsSection } from '../../../../components/project/KnowledgeNuggetsSection'
import { MilestonesSection } from '../../../../components/project/MilestonesSection'
import { PermissionsSection } from '../../../../components/project/PermissionsSection'
import { RiskAnalysis } from '../../../../components/project/RiskAnalysis'
import { RiskSection } from '../../../../components/project/RiskSection'
import { StageSection } from '../../../../components/project/StageSection'
import { StateDerivationSection } from '../../../../components/project/StateDerivationSection'
import { StateValidationSection } from '../../../../components/project/StateValidationSection'
import {
  TechnologyIncomplete,
  TechnologyIncompleteProps,
} from '../../../../components/project/TechnologyIncomplete'
import { TechnologySection } from '../../../../components/project/TechnologySection'
import { UpcomingDisclaimer } from '../../../../components/project/UpcomingDisclaimer'
import { UpgradesAndGovernanceSection } from '../../../../components/project/UpgradesAndGovernanceSection'
import { WrongResearchCTA } from '../../../../components/project/WrongInformationCTA'
import { ScalingDetailsItem } from '../props/getProjectDetails'

export interface ProjectDetailsProps {
  items: ScalingDetailsItem[]
  issueLink: string
  editLink: string
  isUpcoming?: boolean
  incomplete?: TechnologyIncompleteProps
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
          case 'TechnologyIncompleteNote':
            return (
              <TechnologyIncomplete
                key={`${item.type}${index}`}
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
            return (
              <UpcomingDisclaimer
                key={`${item.type}${index}`}
                className="mt-6"
              />
            )
          default:
            assertUnreachable(item)
        }
      })}
      <WrongResearchCTA issueLink={props.issueLink} editLink={props.editLink} />
    </div>
  )
}
