import { Layer2, Layer2Risk, Layer2RiskCategory } from '@l2beat/config'

import { RiskSectionProps } from '../../../components/project/RiskSection'

export function getRiskSection(project: Layer2): RiskSectionProps {
  const technology = project.details.technology
  const exits = technology.exitMechanisms.map((x, i) => ({
    id: `exit-mechanisms-${i + 1}`,
    value: x,
  }))
  const sections = [
    { id: 'state-correctness', value: technology.stateCorrectness },
    { id: 'data-availability', value: technology.dataAvailability },
    { id: 'new-cryptography', value: technology.newCryptography },
    { id: 'mass-exit', value: technology.massExit },
    { id: 'additional-privacy', value: technology.additionalPrivacy },
    { id: 'smart-contracts', value: technology.smartContracts },
    { id: 'operator', value: technology.operator },
    { id: 'force-transactions', value: technology.forceTransactions },
    ...exits,
  ]

  const risks: (Layer2Risk & { referencedId: string })[] = []
  for (const { id, value } of sections) {
    if (value) {
      risks.push(...value.risks.map((x) => ({ ...x, referencedId: id })))
    }
  }
  for (const risk of technology.contracts.risks) {
    risks.push({ ...risk, referencedId: 'contracts' })
  }

  const categories: Layer2RiskCategory[] = [
    'Funds can be stolen if',
    'Funds can be lost if',
    'Funds can be frozen if',
    'Users can be censored if',
    'MEV can be extracted if',
  ]

  let nextStart = 1
  const riskGroups = categories
    .map((name) => {
      const start = nextStart
      const items = risks
        .filter((x) => x.category === name)
        .map((x, i, a) => ({
          text: i !== a.length - 1 ? x.text.slice(0, -1) + ',' : x.text,
          referencedId: x.referencedId,
          isCritical: !!x.isCritical,
        }))
      nextStart += items.length
      return { start, name, items }
    })
    .filter((x) => x.items.length > 0)

  return { riskGroups }
}
