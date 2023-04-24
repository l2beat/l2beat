import React from 'react'

import { Chart } from '../../../components'
import { ContractsSection } from '../../../components/project/ContractsSection'
import { DescriptionSection } from '../../../components/project/DescriptionSection'
import { KnowledgeNuggetsSection } from '../../../components/project/KnowledgeNuggetsSection'
import { MilestonesSection } from '../../../components/project/Milestones'
import { PermissionsSection } from '../../../components/project/PermissionsSection'
import { RiskAnalysis } from '../../../components/project/RiskAnalysis'
import { TechnologyIncompleteProps } from '../../../components/project/TechnologyIncomplete'
import { TechnologySection } from '../../../components/project/TechnologySection'
import { UpcomingDisclaimer } from '../../../components/project/UpcomingDisclaimer'
import { Section } from '../props/getProjectDetails'

export interface ProjectDetailsProps {
  isUpcoming?: boolean
  sections: Section[]
  incomplete?: TechnologyIncompleteProps
}

export function ProjectDetails(props: ProjectDetailsProps) {
  return (
    <div className="px-4 md:px-0">
      {props.sections.map((section) => {
        switch (section.type) {
          case 'ChartSection':
            return (
              <Chart
                key={section.type}
                {...section.props}
                mobileFull
                isUpcoming={props.isUpcoming}
              />
            )
          case 'MilestonesSection':
            return <MilestonesSection key={section.type} {...section.props} />
          case 'KnowledgeNuggetsSection':
            return (
              <KnowledgeNuggetsSection key={section.type} {...section.props} />
            )
          case 'DescriptionSection':
            return <DescriptionSection key={section.type} {...section.props} />
          case 'RiskAnalysisSection':
            return <RiskAnalysis key={section.type} {...section.props} />
          case 'TechnologySection':
            return <TechnologySection key={section.type} {...section.props} />
          case 'PermissionsSection':
            return <PermissionsSection key={section.type} {...section.props} />
          case 'ContractsSection':
            return <ContractsSection key={section.type} {...section.props} />
        }
      })}
      {props.isUpcoming && <UpcomingDisclaimer className="mt-6" />}
    </div>
  )
}
