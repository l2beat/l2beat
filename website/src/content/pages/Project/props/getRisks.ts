import { Project, ProjectRisk, ProjectRiskCategory } from '@l2beat/config'

export interface RisksProps {
  riskGroups: RiskGroup[]
}

export interface RiskGroup {
  name: ProjectRiskCategory
  items: RiskItem[]
}

export interface RiskItem {
  text: string
  referencedId: string
}

export function getRisks(project: Project) {
  const technology = project.details.technology
  const exits =
    technology?.exitMechanisms.map((x, i) => ({
      id: `exit-mechanisms-${i + 1}`,
      value: x,
    })) ?? []
  const sections = [
    { id: 'state-correctness', value: technology?.stateCorrectness },
    { id: 'data-availability', value: technology?.dataAvailability },
    { id: 'new-cryptography', value: technology?.newCryptography },
    { id: 'mass-exit', value: technology?.massExit },
    { id: 'additional-privacy', value: technology?.additionalPrivacy },
    { id: 'smart-contracts', value: technology?.smartContracts },
    { id: 'operator', value: technology?.operator },
    { id: 'force-transactions', value: technology?.forceTransactions },
    ...exits,
  ]

  const risks: (ProjectRisk & { referencedId: string })[] = []
  for (const { id, value } of sections) {
    if (value) {
      risks.push(...value.risks.map((x) => ({ ...x, referencedId: id })))
    }
  }

  const riskGroups: RiskGroup[] = [
    {
      name: 'Funds can be stolen if',
      items: [],
    },
    {
      name: 'Funds can be lost if',
      items: [],
    },
    {
      name: 'Funds can be frozen if',
      items: [],
    },
    {
      name: 'Users can be censored if',
      items: [],
    },
  ]
  for (const group of riskGroups) {
    group.items = risks
      .filter((x) => x.category === group.name)
      .map((x) => ({ text: x.text, referencedId: x.referencedId }))
  }

  return { riskGroups }
}
