import { config } from '../../../config'
import { ContractsSection, ContractsSectionProps } from './ContractsSection'
import {
  DescriptionSection,
  DescriptionSectionProps,
} from './DescriptionSection'
import { NewsSection, NewsSectionProps } from './NewsSection'
import {
  OldProjectDetails,
  OldProjectDetailsProps,
} from './old/OldProjectDetails'
import { OverviewSection, OverviewSectionProps } from './old/OverviewSection'
import { ReferencesSection, ReferencesSectionProps } from './ReferencesSection'
import { RiskSection, RiskSectionProps } from './RiskSection'
import {
  TechnologyIncomplete,
  TechnologyIncompleteProps,
} from './TechnologyIncomplete'
import { TechnologySection, TechnologySectionProps } from './TechnologySection'

export interface ProjectDetailsProps {
  old: OldProjectDetailsProps
  overviewSection: OverviewSectionProps
  newsSection: NewsSectionProps
  descriptionSection: DescriptionSectionProps
  riskSection: RiskSectionProps
  incomplete?: TechnologyIncompleteProps
  sections: TechnologySectionProps[]
  contractsSection: ContractsSectionProps
  referencesSection: ReferencesSectionProps
}

export function ProjectDetails(props: ProjectDetailsProps) {
  if (!config.__DEV__showNewDetails) {
    return <OldProjectDetails {...props.old} />
  }
  return (
    <main className="ProjectDetails">
      <OverviewSection {...props.overviewSection} />
      <NewsSection {...props.newsSection} />
      <div className="ProjectDetails-Content">
        <DescriptionSection {...props.descriptionSection} />
        <RiskSection {...props.riskSection} />
        {props.incomplete && <TechnologyIncomplete {...props.incomplete} />}
        {props.sections.map((section) => (
          <TechnologySection key={section.id} {...section} />
        ))}
        <ContractsSection {...props.contractsSection} />
      </div>
      <ReferencesSection {...props.referencesSection} />
    </main>
  )
}
