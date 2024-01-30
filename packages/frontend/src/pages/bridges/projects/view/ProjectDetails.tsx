import { assertUnreachable } from '@l2beat/shared-pure'
import React from 'react'

import { ChartSection } from '../../../../components/project/ChartSection'
import { ContractsSection } from '../../../../components/project/ContractsSection'
import { DetailedDescriptionSection } from '../../../../components/project/DetailedDescriptionSection'
import { KnowledgeNuggetsSection } from '../../../../components/project/KnowledgeNuggetsSection'
import { MilestonesSection } from '../../../../components/project/MilestonesSection'
import { PermissionsSection } from '../../../../components/project/PermissionsSection'
import { RiskSection } from '../../../../components/project/RiskSection'
import {
  TechnologyIncomplete,
  TechnologyIncompleteProps,
} from '../../../../components/project/TechnologyIncomplete'
import { TechnologySection } from '../../../../components/project/TechnologySection'
import { WrongResearchCTA } from '../../../../components/project/WrongInformationCTA'
import { BridgeDetailsItem } from '../props/getProjectDetails'
export interface ProjectDetailsProps {
  items: BridgeDetailsItem[]
  issueLink: string
  editLink: string
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
          case 'DetailedDescriptionSection':
            return (
              <DetailedDescriptionSection
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
          default:
            assertUnreachable(item)
        }
      })}
      <WrongResearchCTA issueLink={props.issueLink} editLink={props.editLink} />
    </div>
  )
}
