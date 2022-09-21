import React from 'react'

import {
  ContractsSection,
  ContractsSectionProps,
} from '../../../components/project/ContractsSection'
import {
  DescriptionSection,
  DescriptionSectionProps,
} from '../../../components/project/DescriptionSection'
import {
  LinkSection,
  LinkSectionProps,
} from '../../../components/project/links/LinkSection'
import {
  NewsSection,
  NewsSectionProps,
} from '../../../components/project/NewsSection'
import {
  TechnologyIncomplete,
  TechnologyIncompleteProps,
} from '../../../components/project/TechnologyIncomplete'
import {
  PermissionsSection,
  PermissionsSectionProps,
} from './PermissionsSection'
import { RiskSection, RiskSectionProps } from './RiskSection'
import { TechnologySection, TechnologySectionProps } from './TechnologySection'

export interface ProjectDetailsProps {
  linkSection: LinkSectionProps
  newsSection: NewsSectionProps
  descriptionSection: DescriptionSectionProps
  riskSection: RiskSectionProps
  incomplete?: TechnologyIncompleteProps
  sections: TechnologySectionProps[]
  permissionsSection?: PermissionsSectionProps
  contractsSection: ContractsSectionProps
}

export function ProjectDetails(props: ProjectDetailsProps) {
  return (
    <main className="ProjectDetails">
      <LinkSection {...props.linkSection} />
      <NewsSection {...props.newsSection} />
      <div className="ProjectDetails-Content">
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
    </main>
  )
}
