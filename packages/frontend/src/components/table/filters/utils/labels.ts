import type { FilterableValueId } from '../types'

export const filterIdToLabel = {
  type: 'Type',
  stack: 'Stack',
  stage: 'Stage',
  purpose: 'Purpose',
  hostChain: 'Host Chain',
  daLayer: 'DA Layer',
  raas: 'RaaS',
  validatedBy: 'Validated by',
}

export const filterIdToValues: Record<keyof typeof filterIdToLabel, string> = {
  type: 'types',
  stack: 'stacks',
  stage: 'stages',
  purpose: 'purposes',
  hostChain: 'chains',
  daLayer: 'layers',
  raas: 'providers',
  validatedBy: 'validators',
}

export const emptyStateLabel = (filterId: FilterableValueId | undefined) => {
  return filterId
    ? `No ${filterIdToValues[filterId].toLowerCase()} found.`
    : 'No filters found.'
}

export const inputPlaceholder = (filterId: FilterableValueId | undefined) => {
  return filterId
    ? `Search ${filterIdToValues[filterId].toLowerCase()}...`
    : 'Search filters...'
}
