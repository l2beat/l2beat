import { ProjectDetails } from '@l2beat/config'
import { config } from '../../../config'
import { ContractsSection, ContractsSectionProps } from './ContractsSection'
import { NewsSection, NewsSectionProps } from './NewsSection'
import { BridgesSectionProps } from './old/BridgesSection'
import { OldProjectDetails } from './old/OldProjectDetails'
import { OverviewSection, OverviewSectionProps } from './old/OverviewSection'
import { ReferencesSection, ReferencesSectionProps } from './ReferencesSection'
import { RiskSection, RiskSectionProps } from './RiskSection'
import {
  TechnologyIncomplete,
  TechnologyIncompleteProps,
} from './TechnologyIncomplete'
import { TechnologySection, TechnologySectionProps } from './TechnologySection'

export interface ProjectDetailsProps {
  details: ProjectDetails
  riskSection: RiskSectionProps
  technologyOverview: TechnologyOverviewProps
  bridgesSection: BridgesSectionProps
  newsSection: NewsSectionProps
  overviewSection: OverviewSectionProps
}

export interface TechnologyOverviewProps {
  incomplete?: TechnologyIncompleteProps
  sections: TechnologySectionProps[]
  contractsSection: ContractsSectionProps
  referencesSection: ReferencesSectionProps
}

export function ProjectDetails(props: ProjectDetailsProps) {
  if (!config.__DEV__showNewDetails) {
    return <OldProjectDetails {...props} />
  }
  return (
    <main className="ProjectDetails">
      <OverviewSection {...props.overviewSection} />
      <NewsSection {...props.newsSection} />
      <div className="ProjectDetails-Content">
        <RiskSection {...props.riskSection} />
        {props.technologyOverview.incomplete && (
          <TechnologyIncomplete {...props.technologyOverview.incomplete} />
        )}
        {props.technologyOverview.sections.map((section) => (
          <TechnologySection key={section.id} {...section} />
        ))}
        <ContractsSection {...props.technologyOverview.contractsSection} />
      </div>
      <ReferencesSection {...props.technologyOverview.referencesSection} />
    </main>
  )
}
