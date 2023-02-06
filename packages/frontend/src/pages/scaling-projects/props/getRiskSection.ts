import { CONTRACTS, Layer2, ProjectRisk } from '@l2beat/config'
import { VerificationStatus } from '@l2beat/shared'

import { RiskSectionProps } from '../../../components/project/RiskSection'
import { groupRisks } from '../../../utils/project/groupRisks'

export function getRiskSection(
  project: Layer2,
  verificationStatus: VerificationStatus,
): RiskSectionProps {
  const technology = project.technology
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

  const risks: (ProjectRisk & { referencedId: string })[] = []
  for (const { id, value } of sections) {
    if (value) {
      risks.push(...value.risks.map((x) => ({ ...x, referencedId: id })))
    }
  }
  for (const risk of project.contracts.risks) {
    risks.push({ ...risk, referencedId: 'contracts' })
  }
  // Explicit comparison to false because project might not exists in verification map at all.
  if (verificationStatus.projects[project.id.toString()] === false) {
    if (!risks.find((r) => r.text === CONTRACTS.UNVERIFIED_RISK.text)) {
      risks.push({ ...CONTRACTS.UNVERIFIED_RISK, referencedId: 'contracts' })
    }
  }

  return { riskGroups: groupRisks(risks) }
}
