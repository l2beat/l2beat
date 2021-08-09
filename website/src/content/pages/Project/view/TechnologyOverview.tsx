import { ContractsSection, ContractsSectionProps } from './ContractsSection'
import { ReferencesSection, ReferencesSectionProps } from './ReferencesSection'
import { TechnologyChoice, TechnologySection } from './TechnologySection'

export interface TechnologyOverviewProps {
  technologySection: TechnologySectionProps
  withdrawalsSection: WithdrawalSectionProps
  contractsSection: ContractsSectionProps
  referencesSection: ReferencesSectionProps
}

export interface TechnologySectionProps {
  items: TechnologyChoice[]
}

export interface WithdrawalSectionProps {
  items: TechnologyChoice[]
}

export function TechnologyOverview(props: TechnologyOverviewProps) {
  return (
    <>
      <TechnologySection
        title="Technology"
        id="technology"
        {...props.technologySection}
      />
      <TechnologySection
        title="Withdrawals"
        id="withdrawals"
        {...props.withdrawalsSection}
      />
      <ContractsSection {...props.contractsSection} />
      <ReferencesSection {...props.referencesSection} />
    </>
  )
}
