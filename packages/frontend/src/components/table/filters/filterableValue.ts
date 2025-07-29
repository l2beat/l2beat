import { v } from '@l2beat/validate'

export interface FilterableEntry {
  filterable: FilterableValue[] | undefined
}
export type FilterableValue = {
  id: FilterableValueId
  value: string
}
export type FilterableValueId = v.infer<typeof FilterableValueId>
export const FilterableValueId = v.enum([
  'type',
  'stack',
  'stage',
  'purpose',
  'hostChain',
  'daLayer',
  'raas',
  'validatedBy',
  'infrastructure',
  'vm',
  'other',
  'techStack',
])

export const filterIdToLabel: Record<FilterableValueId, string> = {
  type: 'Type',
  stack: 'Stack',
  stage: 'Stage',
  purpose: 'Purpose',
  hostChain: 'Host Chain',
  daLayer: 'DA Layer',
  raas: 'RaaS',
  validatedBy: 'Validated by',
  infrastructure: 'Infrastructure',
  vm: 'VM',
  other: 'Other properties',
  techStack: 'Tech Stack',
}

export const filterIdToValues: Record<FilterableValueId, string> = {
  type: 'types',
  stack: 'stacks',
  stage: 'stages',
  purpose: 'purposes',
  hostChain: 'chains',
  daLayer: 'layers',
  raas: 'providers',
  validatedBy: 'validators',
  infrastructure: 'infras',
  vm: 'VMs',
  other: 'other',
  techStack: 'tech stacks',
}

export const emptyStateLabel = (filterId: FilterableValueId | undefined) => {
  return filterId
    ? `No ${filterIdToValues[filterId]} found.`
    : 'No filters found.'
}

export const inputPlaceholder = (filterId: FilterableValueId | undefined) => {
  return filterId
    ? `Search ${filterIdToValues[filterId]}...`
    : 'Search filters...'
}

const ALWAYS_FIRST_VALUES = [
  'No stack',
  'Ethereum',
  'Not applicable',
  'No infrastructure',
  'No VM',
  'No RaaS',
]
export function filterValuesSortFn(a: string, b: string) {
  if (ALWAYS_FIRST_VALUES.includes(a)) return -1
  if (ALWAYS_FIRST_VALUES.includes(b)) return 1
  return a.localeCompare(b)
}
