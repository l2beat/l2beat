import { Project, ProjectRisk, ProjectRiskCategory } from '@l2beat/config'
import { RiskSectionProps } from '../view/RiskSection'

export function getRiskSection(project: Project): RiskSectionProps | undefined {
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
  for (const risk of technology?.contracts.risks ?? []) {
    risks.push({ ...risk, referencedId: 'contracts' })
  }

  if (risks.length === 0) {
    return undefined
  }

  const categories: ProjectRiskCategory[] = [
    'Funds can be stolen if',
    'Funds can be lost if',
    'Funds can be frozen if',
    'Users can be censored if',
  ]

  let nextStart = 1
  const riskGroups = categories
    .map((name) => {
      const start = nextStart
      const items = risks
        .filter((x) => x.category === name)
        .map((x) => ({
          text: normalizeText(x.text),
          referencedId: x.referencedId,
        }))
      nextStart += items.length
      return { start, name, items }
    })
    .filter((x) => x.items.length > 0)

  return { riskGroups }
}

function normalizeText(text: string) {
  const capitalized = text[0].toUpperCase() + text.slice(1)
  return capitalized.endsWith('.') ? capitalized.slice(0, -1) : capitalized
}
