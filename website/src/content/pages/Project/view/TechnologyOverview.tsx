import { ContractsSection, ContractsSectionProps } from './ContractsSection'
import { ReferencesSection, ReferencesSectionProps } from './ReferencesSection'
import { TechnologyIncomplete } from './TechnologyIncomplete'
import { TechnologySection, TechnologySectionProps } from './TechnologySection'

export interface TechnologyOverviewProps {
  isIncomplete: boolean
  editLink: string
  twitterLink: string | undefined
  sections: TechnologySectionProps[]
  contractsSection: ContractsSectionProps
  referencesSection: ReferencesSectionProps
}

export function TechnologyOverview(props: TechnologyOverviewProps) {
  return (
    <>
      {props.isIncomplete && (
        <TechnologyIncomplete
          editLink={props.editLink}
          twitterLink={props.twitterLink}
        />
      )}
      {props.sections.map((section) => (
        <TechnologySection key={section.id} {...section} />
      ))}
      <ContractsSection {...props.contractsSection} />
      <ReferencesSection {...props.referencesSection} />
    </>
  )
}
