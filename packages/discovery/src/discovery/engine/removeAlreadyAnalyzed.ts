import type {
  AddressesWithTemplates,
  Analysis,
} from '../analysis/AddressAnalyzer'

export function removeAlreadyAnalyzed(
  toAnalyze: AddressesWithTemplates,
  resolved: Analysis[],
) {
  for (const analysis of resolved) {
    const address = analysis.address.toString()
    const suggestedTemplates = toAnalyze[address] ?? new Set()
    if (analysis.type === 'Reference') {
      delete toAnalyze[address]
    } else if (
      analysisCoveredSuggestedTemplates(analysis, suggestedTemplates)
    ) {
      delete toAnalyze[address]
    } else if (
      analysis.type !== 'EOA' &&
      analysis.extendedTemplate !== undefined
    ) {
      analysis.errors['@template'] = `Conflicting templates: ${Array.from(
        suggestedTemplates,
      ).join(', ')}`
      delete toAnalyze[address]
    }
    // If analysis used no template but toAnalyze suggest a template,
    // it will be kept to be analyzed again.
  }
}

function analysisCoveredSuggestedTemplates(
  analysis: Analysis,
  suggestedTemplates: Set<string>,
): boolean {
  return (
    analysis.type === 'Reference' || // Templates suggestions don't make sense for References
    analysis.type === 'EOA' || // Templates suggestions don't make sense for EOAs
    analysis.extendedTemplate?.reason === 'byExtends' || // Explicit template was set
    suggestedTemplates.size === 0 || // We have nothing new to suggest
    (suggestedTemplates.size === 1 &&
      analysis.extendedTemplate?.template === Array.from(suggestedTemplates)[0]) // Exactly the same template was analyzed
  )
}
