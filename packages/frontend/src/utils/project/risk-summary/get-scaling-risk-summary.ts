import type { Layer2, Layer3, ScalingProjectRisk } from '@l2beat/config'
import { CONTRACTS } from '@l2beat/config'
import isArray from 'lodash/isArray'

import type { RiskSummarySectionProps } from '../../../components/projects/sections/risk-summary-section'
import type { ProjectSectionProps } from '../../../components/projects/sections/types'
import { groupRisks } from './group-risks'

export function getScalingRiskSummarySection(
  project: Layer2 | Layer3,
  isVerified: boolean,
): Omit<RiskSummarySectionProps, keyof ProjectSectionProps> {
  const sections = [
    {
      id: 'state-correctness',
      value: project.technology.stateCorrectness,
    },
    { id: 'new-cryptography', value: project.technology.newCryptography },
    { id: 'data-availability', value: project.technology.dataAvailability },
    { id: 'operator', value: project.technology.operator },
    { id: 'force-transactions', value: project.technology.forceTransactions },
    { id: 'withdrawals', value: project.technology.exitMechanisms },
    { id: 'mass-exit', value: project.technology.massExit },
    {
      id: 'other-considerations',
      value: project.technology.otherConsiderations,
    },
    {
      id: 'sequencing',
      value: project.technology.sequencing,
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
  if (!isVerified) {
    if (!risks.find((r) => r.text === CONTRACTS.UNVERIFIED_RISK.text)) {
      risks.push({ ...CONTRACTS.UNVERIFIED_RISK, referencedId: 'contracts' })
    }
  }

  for (const risk of project.stateValidation?.categories.flatMap(
    (c) => c.risks ?? [],
  ) ?? []) {
    risks.push({ ...risk, referencedId: 'state-validation' })
  }

  return {
    riskGroups: groupRisks(risks),
    warning: project.display.warning,
    isVerified,
    redWarning: undefined,
  }
}
