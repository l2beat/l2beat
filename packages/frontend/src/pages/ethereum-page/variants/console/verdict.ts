import type { Sentiment } from '@l2beat/config'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { EthereumProjectPageEntry } from '~/server/features/data-availability/project/getEthereumProjectEntry'

export interface VerdictItem {
  name: string
  value: string
  sentiment: Sentiment
  description: string | undefined
}

/**
 * The verdict is read off the published risk analysis, never written here:
 * if the assessment changes, the strip at the top changes with it
 */
export function getVerdict(entry: EthereumProjectPageEntry) {
  const analysis = entry.sections.find(
    (
      s,
    ): s is Extract<
      ProjectDetailsSection,
      { type: 'GrissiniRiskAnalysisSection' }
    > => s.type === 'GrissiniRiskAnalysisSection',
  )
  const values = [
    ...(analysis?.props.layerGrissiniValues ?? []),
    ...(analysis?.props.bridgeGrissiniValues ?? []),
  ]
  const items: VerdictItem[] = values.map((v) => ({
    name: v.name,
    value: v.value,
    sentiment: v.sentiment ?? 'neutral',
    description: v.description,
  }))
  return {
    items,
    isUnderReview:
      !!analysis?.props.isUnderReview ||
      items.some((i) => i.sentiment === 'UnderReview'),
  }
}

export function sentimentDotClass(sentiment: Sentiment) {
  switch (sentiment) {
    case 'good':
      return 'bg-positive'
    case 'warning':
      return 'bg-warning'
    case 'bad':
      return 'bg-negative'
    case 'neutral':
    case 'UnderReview':
      return 'bg-secondary'
  }
}
