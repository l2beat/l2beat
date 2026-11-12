import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { RosetteValue } from '~/components/rosette/types'
import type { EthereumProjectPageEntry } from '~/server/features/data-availability/project/getEthereumProjectEntry'

/**
 * Our assessment, said in a sentence anyone can follow. It is assembled only
 * from the risk values the risk analysis section shows, so the two can never
 * disagree; a value without a plain reading is quoted as it stands.
 */
export interface Verdict {
  sentence: string
  values: RosetteValue[]
  isUnderReview: boolean
  /** Risks the risk summary lists, which the sentence does not cover */
  riskCount: number
}

const PLAIN: Record<string, string> = {
  'DA Layer/Self-verify':
    'every full node checks for itself that the data is there',
  'DA Bridge/Enshrined':
    'rollups read it straight from the protocol, with no committee in between',
}

export function getVerdict(entry: EthereumProjectPageEntry): Verdict {
  const analysis = findSection(entry.sections, 'GrissiniRiskAnalysisSection')
  const summary = findSection(entry.sections, 'DaRiskSummarySection')
  const values = [
    ...(analysis?.props.layerGrissiniValues ?? []),
    ...(analysis?.props.bridgeGrissiniValues ?? []),
  ]
  const riskCount = summary
    ? summary.props.layer.risks.length + summary.props.bridge.risks.length
    : 0
  const isUnderReview =
    entry.isUnderReview ||
    !!analysis?.props.isUnderReview ||
    values.some((v) => v.sentiment === 'UnderReview')
  const allGood =
    values.length > 0 && values.every((v) => v.sentiment === 'good')
  const clauses = values.map(plainReading)
  const lead = allGood
    ? "You trust Ethereum's own validators and nothing else"
    : 'What you trust depends on the values below'
  return {
    sentence:
      clauses.length > 0 ? `${lead}: ${joinClauses(clauses)}.` : `${lead}.`,
    values,
    isUnderReview,
    riskCount,
  }
}

export function plainReading(value: RosetteValue) {
  return (
    PLAIN[`${value.name}/${value.value}`] ?? `${value.name} is ${value.value}`
  )
}

function joinClauses(clauses: string[]) {
  if (clauses.length <= 1) return clauses.join('')
  return `${clauses.slice(0, -1).join(', ')}, and ${clauses.at(-1)}`
}

export function findSection<T extends ProjectDetailsSection['type']>(
  sections: ProjectDetailsSection[],
  type: T,
) {
  return sections.find(
    (s): s is Extract<ProjectDetailsSection, { type: T }> => s.type === type,
  )
}
