import { INTEROP_CHAINS } from '@l2beat/config'

export interface AbstractTokenSuggestion {
  chain: string
  address: string
  isInterop: boolean
}

const interopChainOrder = new Map<string, number>(
  INTEROP_CHAINS.map(({ id }, index) => [id, index]),
)

export function groupAbstractTokenSuggestions(
  suggestions: Omit<AbstractTokenSuggestion, 'isInterop'>[],
) {
  const interopSuggestions: AbstractTokenSuggestion[] = []
  const otherSuggestions: AbstractTokenSuggestion[] = []

  for (const suggestion of suggestions) {
    const groupedSuggestion = {
      ...suggestion,
      isInterop: interopChainOrder.has(suggestion.chain),
    }

    if (groupedSuggestion.isInterop) {
      interopSuggestions.push(groupedSuggestion)
    } else {
      otherSuggestions.push(groupedSuggestion)
    }
  }

  return {
    interopSuggestions,
    otherSuggestions,
  }
}
