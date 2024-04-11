import { CONTRACTS, Layer2, Layer3, ScalingProjectRisk } from '@l2beat/config'
import { VerificationStatus } from '@l2beat/shared-pure'
import isArray from 'lodash/isArray'

import { RiskSectionProps } from '../../components/project/RiskSection'
import { groupRisks } from './groupRisks'

export function getRiskSection(
  project: Layer2 | Layer3,
  verificationStatus: VerificationStatus,
): Omit<RiskSectionProps, 'sectionOrder'> {
  const sections = [
    {
      id: 'state-correctness',
      value: project.technology.stateCorrectness,
    },
    { id: 'new-cryptography', value: project.technology.newCryptography },
    { id: 'data-availability', value: project.technology.dataAvailability },
    { id: 'operator', value: project.technology.operator },
    { id: 'force-transactions', value: project.technology.forceTransactions },
    { id: 'exit-mechanisms', value: project.technology.exitMechanisms },
    { id: 'mass-exit', value: project.technology.massExit },
    {
      id: 'other-considerations',
      value: project.technology.otherConsiderations,
    },
  ]

  const risks: (ScalingProjectRisk & { referencedId: string })[] = []
  for (const { id, value } of sections) {
    if (value) {
      if (isArray(value)) {
        for (const val of value) {
          if (val) {
            risks.push(...val.risks.map((x) => ({ ...x, referencedId: id })))
          }
        }
      } else {
        risks.push(...value.risks.map((x) => ({ ...x, referencedId: id })))
      }
    }
  }
  for (const risk of project.contracts?.risks ?? []) {
    risks.push({ ...risk, referencedId: 'contracts' })
  }
  // Explicit comparison to false because project might not exists in verification map at all.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
  if (verificationStatus.projects[project.id.toString()] === false) {
    if (!risks.find((r) => r.text === CONTRACTS.UNVERIFIED_RISK.text)) {
      risks.push({ ...CONTRACTS.UNVERIFIED_RISK, referencedId: 'contracts' })
    }
  }

  return {
    id: 'risk-summary',
    title: 'Risk summary',
    riskGroups: groupRisks(risks),
    warning: project.display.warning,
    isVerified: verificationStatus.projects[project.id.toString()],
    redWarning: undefined,
  }
}
