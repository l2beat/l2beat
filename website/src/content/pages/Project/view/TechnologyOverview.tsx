import { ContractsSection, ContractsSectionProps } from './ContractsSection'
import { ReferencesSection, ReferencesSectionProps } from './ReferencesSection'
import { TechnologySection, TechnologySectionProps } from './TechnologySection'

export interface TechnologyOverviewProps {
  sections: TechnologySectionProps[]
  contractsSection: ContractsSectionProps
  referencesSection: ReferencesSectionProps
}

export function TechnologyOverview(props: TechnologyOverviewProps) {
  return (
    <>
      {props.sections.map((section) => (
        <TechnologySection key={section.id} {...section} />
      ))}
      <ContractsSection {...props.contractsSection} />
      <ReferencesSection {...props.referencesSection} />
    </>
  )
}
