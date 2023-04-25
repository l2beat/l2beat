import { assertUnreachable } from '@l2beat/shared'
import React from 'react'

import { ChartSection } from '../../../components/project/ChartSection'
import { ContractsSection } from '../../../components/project/ContractsSection'
import { DescriptionSection } from '../../../components/project/DescriptionSection'
import { KnowledgeNuggetsSection } from '../../../components/project/KnowledgeNuggetsSection'
import { MilestonesSection } from '../../../components/project/Milestones'
import { PermissionsSection } from '../../../components/project/PermissionsSection'
import { RiskAnalysis } from '../../../components/project/RiskAnalysis'
import {
  TechnologyIncomplete,
  TechnologyIncompleteProps,
} from '../../../components/project/TechnologyIncomplete'
import { TechnologySection } from '../../../components/project/TechnologySection'
import { UpcomingDisclaimer } from '../../../components/project/UpcomingDisclaimer'
import { ProjectDetailsItem } from '../props/getProjectDetails'

export interface ProjectDetailsProps {
  isUpcoming?: boolean
  items: ProjectDetailsItem[]
  incomplete?: TechnologyIncompleteProps
}

export function ProjectDetails(props: ProjectDetailsProps) {
  return (
    <div className="px-4 md:px-0">
      {props.items.map((item) => {
        switch (item.type) {
          case 'ChartSection':
            return <ChartSection key={item.type} {...item.props} />
          case 'MilestonesSection':
            return <MilestonesSection key={item.type} {...item.props} />
          case 'KnowledgeNuggetsSection':
            return <KnowledgeNuggetsSection key={item.type} {...item.props} />
          case 'DescriptionSection':
            return <DescriptionSection key={item.type} {...item.props} />
          case 'RiskAnalysisSection':
            return <RiskAnalysis key={item.type} {...item.props} />
          case 'TechnologyIncompleteNote':
            return <TechnologyIncomplete key={item.type} {...item.props} />
          case 'TechnologySection':
            return <TechnologySection key={item.type} {...item.props} />
          case 'PermissionsSection':
            return <PermissionsSection key={item.type} {...item.props} />
          case 'ContractsSection':
            return <ContractsSection key={item.type} {...item.props} />
          case 'UpcomingDisclaimer':
            return <UpcomingDisclaimer key={item.type} className="mt-6" />
          default:
            assertUnreachable(item)
        }
      })}
    </div>
  )
}
