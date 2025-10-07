import type { Project, ProjectRisk } from '@l2beat/config'
import isArray from 'lodash/isArray'
import uniqBy from 'lodash/uniqBy'
import type { RiskSummarySectionProps } from '../../../components/projects/sections/RiskSummarySection'
import type { ProjectSectionProps } from '../../../components/projects/sections/types'
import { groupRisks } from './groupRisks'

export function getScalingRiskSummarySection(
  project: Project<'scalingTechnology', 'contracts'>,
  isVerified: boolean,
): Omit<RiskSummarySectionProps, keyof ProjectSectionProps> {
  const sections = [
    {
      id: 'data-availability',
      value: project.scalingTechnology.dataAvailability,
    },
    { id: 'operator', value: project.scalingTechnology.operator },
    {
      id: 'force-transactions',
      value: project.scalingTechnology.forceTransactions,
    },
    { id: 'withdrawals', value: project.scalingTechnology.exitMechanisms },
    { id: 'mass-exit', value: project.scalingTechnology.massExit },
    {
      id: 'other-considerations',
      value: project.scalingTechnology.otherConsiderations,
    },
    {
      id: 'sequencing',
      value: project.scalingTechnology.sequencing,
    },
  ]

  const risks: (ProjectRisk & { referencedId: string })[] = []
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

  for (const risk of project.scalingTechnology.stateValidation?.categories.flatMap(
    (c) => c.risks ?? [],
  ) ?? []) {
    risks.push({ ...risk, referencedId: 'state-validation' })
  }

  const uniqRisks = uniqBy(risks, (r) => `${r.category}-${r.text}`)

  return {
    riskGroups: groupRisks(uniqRisks),
    warning: project.scalingTechnology.warning,
    isVerified,
    redWarning: undefined,
  }
}
