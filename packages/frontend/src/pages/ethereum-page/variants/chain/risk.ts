import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { RosetteValue } from '~/components/rosette/types'
import type { EthereumProjectPageEntry } from '~/server/features/data-availability/project/getEthereumProjectEntry'

type SectionOf<T extends ProjectDetailsSection['type']> = Extract<
  ProjectDetailsSection,
  { type: T }
>

export function findSection<T extends ProjectDetailsSection['type']>(
  entry: EthereumProjectPageEntry,
  type: T,
): SectionOf<T> | undefined {
  return entry.sections.find((s): s is SectionOf<T> => s.type === type)
}

/**
 * The assessment's own verdicts, layer then bridge, exactly as the risk
 * analysis shows them: the page summarizes them, it never writes new ones.
 */
export function riskVerdicts(entry: EthereumProjectPageEntry): RosetteValue[] {
  const analysis = findSection(entry, 'GrissiniRiskAnalysisSection')
  if (!analysis) return []
  return [
    ...(analysis.props.layerGrissiniValues ?? []),
    ...(analysis.props.bridgeGrissiniValues ?? []),
  ]
}
