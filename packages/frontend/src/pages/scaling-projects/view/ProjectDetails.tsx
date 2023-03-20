import { KnowledgeNugget, Milestone } from '@l2beat/config'
import { isEmpty } from 'lodash'
import React from 'react'

import { HorizontalSeparator } from '../../../components/HorizontalSeparator'
import {
  ContractsSection,
  ContractsSectionProps,
} from '../../../components/project/ContractsSection'
import {
  DescriptionSection,
  DescriptionSectionProps,
} from '../../../components/project/DescriptionSection'
import { KnowledgeNuggets } from '../../../components/project/KnowledgeNuggets'
import { LinkSectionProps } from '../../../components/project/links/LinkSection'
import { Milestones } from '../../../components/project/Milestones'
import {
  PermissionsSection,
  PermissionsSectionProps,
} from '../../../components/project/PermissionsSection'
import {
  RiskAnalysis,
  RiskAnalysisProps,
} from '../../../components/project/RiskAnalysis'
import {
  TechnologyIncomplete,
  TechnologyIncompleteProps,
} from '../../../components/project/TechnologyIncomplete'
import {
  TechnologySection,
  TechnologySectionProps,
} from '../../../components/project/TechnologySection'
import { UpcomingDisclaimer } from '../../../components/project/UpcomingDisclaimer'

export interface ProjectDetailsProps {
  linkSection: LinkSectionProps
  descriptionSection: DescriptionSectionProps
  riskAnalysis: RiskAnalysisProps
  incomplete?: TechnologyIncompleteProps
  sections: TechnologySectionProps[]
  permissionsSection?: PermissionsSectionProps
  contractsSection: ContractsSectionProps
  milestones?: Milestone[]
  knowledgeNuggets?: KnowledgeNugget[]
  isUpcoming?: boolean
}

export function ProjectDetails(props: ProjectDetailsProps) {
  return (
    <main className="ProjectDetails">
      <div className="ProjectDetails-Content px-4 md:px-0">
        <DescriptionSection {...props.descriptionSection} />
        {!props.isUpcoming && (
          <>
            <RiskAnalysis {...props.riskAnalysis} />
            {props.incomplete && <TechnologyIncomplete {...props.incomplete} />}
            {props.sections.map((section) => (
              <TechnologySection key={section.id} {...section} />
            ))}
            {props.permissionsSection && (
              <PermissionsSection {...props.permissionsSection} />
            )}
            <ContractsSection {...props.contractsSection} />
          </>
        )}
        {props.isUpcoming && <UpcomingDisclaimer className="mt-6" />}
      </div>
      <div className="ProjectDetails-Side flex flex-col gap-12 bg-gray-100 py-12 dark:bg-gray-900 md:!bg-transparent">
        <Milestones milestones={props.milestones} />
        {!isEmpty(props.knowledgeNuggets) && (
          <div className="px-4 md:hidden">
            <HorizontalSeparator />
          </div>
        )}
        <KnowledgeNuggets knowledgeNuggets={props.knowledgeNuggets} />
      </div>
    </main>
  )
}
