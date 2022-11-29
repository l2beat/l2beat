import { Milestone } from '@l2beat/config'
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
import { Milestones } from '../../../components/project/Milestones'
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
}

export function ProjectDetails(props: ProjectDetailsProps) {
  return (
    <main className="ProjectDetails">
      <Milestones
        milestones={props.milestones}
        className="mt-12 px-4 md:px-0"
      />
      <LinkSection {...props.linkSection} />
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
    </main>
  )
}
