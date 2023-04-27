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
import { KnowledgeNuggetsSection } from '../../../components/project/KnowledgeNuggetsSection'
import {
  LinkSection,
  LinkSectionProps,
} from '../../../components/project/links/LinkSection'
import { MilestonesSection } from '../../../components/project/Milestones'
import {
  PermissionsSection,
  PermissionsSectionProps,
} from '../../../components/project/PermissionsSection'
import {
  RiskSection,
  RiskSectionProps,
} from '../../../components/project/RiskSection'
import {
  TechnologyIncomplete,
  TechnologyIncompleteProps,
} from '../../../components/project/TechnologyIncomplete'
import {
  TechnologySection,
  TechnologySectionProps,
} from '../../../components/project/TechnologySection'
export interface ProjectDetailsProps {
  linkSection: LinkSectionProps
  descriptionSection: DescriptionSectionProps
  riskSection: RiskSectionProps
  incomplete?: TechnologyIncompleteProps
  sections: TechnologySectionProps[]
  permissionsSection?: PermissionsSectionProps
  contractsSection: ContractsSectionProps
  milestones?: Milestone[]
  knowledgeNuggets?: KnowledgeNugget[]
}

export function ProjectDetails(props: ProjectDetailsProps) {
  return (
    <main className="ProjectDetails">
      <div className="ProjectDetails-Content px-4 md:px-0">
        <DescriptionSection {...props.descriptionSection} />
        <RiskSection {...props.riskSection} />
        {props.incomplete && <TechnologyIncomplete {...props.incomplete} />}
        {props.sections.map((section) => (
          <TechnologySection key={section.id} {...section} />
        ))}
        {props.permissionsSection && (
          <PermissionsSection {...props.permissionsSection} />
        )}
        <ContractsSection {...props.contractsSection} />
      </div>
      <div className="ProjectDetails-Side flex flex-col">
        <LinkSection {...props.linkSection} />
        <div className="flex flex-col gap-12 bg-gray-100 py-12 dark:bg-gray-900 md:!bg-transparent">
          {props.milestones && (
            <MilestonesSection
              id="milestones"
              title="Milestones"
              milestones={props.milestones}
            />
          )}
          {!isEmpty(props.knowledgeNuggets) && (
            <div className="px-4 md:hidden">
              <HorizontalSeparator />
            </div>
          )}
          {props.knowledgeNuggets && (
            <KnowledgeNuggetsSection
              id="knowledge-nuggets"
              title="Knowledge Nuggets"
              knowledgeNuggets={props.knowledgeNuggets}
            />
          )}
        </div>
      </div>
    </main>
  )
}
