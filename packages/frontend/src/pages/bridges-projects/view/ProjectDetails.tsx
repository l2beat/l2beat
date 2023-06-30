import { assertUnreachable } from '@l2beat/shared-pure'
import React from 'react'

import { ChartSection } from '../../../components/project/ChartSection'
import { ContractsSection } from '../../../components/project/ContractsSection'
import { DescriptionSection } from '../../../components/project/DescriptionSection'
import { KnowledgeNuggetsSection } from '../../../components/project/KnowledgeNuggetsSection'
import { MilestonesSection } from '../../../components/project/MilestonesSection'
import { PermissionsSection } from '../../../components/project/PermissionsSection'
import { RiskSection } from '../../../components/project/RiskSection'
import {
  TechnologyIncomplete,
  TechnologyIncompleteProps,
} from '../../../components/project/TechnologyIncomplete'
import { TechnologySection } from '../../../components/project/TechnologySection'
import { BridgeDetailsItem } from '../props/getProjectDetails'
export interface ProjectDetailsProps {
  incomplete?: TechnologyIncompleteProps
  items: BridgeDetailsItem[]
}

export function ProjectDetails(props: ProjectDetailsProps) {
  return (
    <div className="px-4 md:px-0">
      {props.items.map((item, index) => {
        switch (item.type) {
          case 'ChartSection':
            return <ChartSection key={item.props.id} {...item.props} />
          case 'MilestonesSection':
            return <MilestonesSection key={item.props.id} {...item.props} />
          case 'KnowledgeNuggetsSection':
            return (
              <KnowledgeNuggetsSection key={item.props.id} {...item.props} />
            )
          case 'DescriptionSection':
            return <DescriptionSection key={item.props.id} {...item.props} />
          case 'RiskSection':
            return <RiskSection key={item.props.id} {...item.props} />
          case 'TechnologyIncompleteNote':
            return (
              <TechnologyIncomplete
                key={`${item.type}${index}`}
                {...item.props}
              />
            )
          case 'TechnologySection':
            return <TechnologySection key={item.props.id} {...item.props} />
          case 'PermissionsSection':
            return <PermissionsSection key={item.props.id} {...item.props} />
          case 'ContractsSection':
            return <ContractsSection key={item.props.id} {...item.props} />
          default:
            assertUnreachable(item)
        }
      })}
    </div>
  )
}
