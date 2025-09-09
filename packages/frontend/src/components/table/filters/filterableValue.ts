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
  'bridgingType',
  'category',
  'bridgedUsing',
  'isPartOfSuperchain',
  'hasTestnet',
  'Arithmetization',
  'curve',
  'Fflonk',
  'Field',
  'Groth16',
  'ISA',
  'Other',
  'PCS',
  'Plonk',
  'STARK',
  'project',
  'contentCategory',
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
  bridgingType: 'Bridging Type',
  category: 'Category',
  bridgedUsing: 'Bridged Using',
  isPartOfSuperchain: 'Is part of Superchain?',
  hasTestnet: 'Has testnet?',
  Arithmetization: 'Arithmetization',
  curve: 'Curve',
  Fflonk: 'Fflonk',
  Field: 'Field',
  Groth16: 'Groth16',
  ISA: 'ISA',
  Other: 'Other',
  PCS: 'PCS',
  Plonk: 'Plonk',
  STARK: 'STARK',
  project: 'Project',
  contentCategory: 'Content Category',
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
  bridgingType: 'bridging types',
  category: 'categories',
  bridgedUsing: 'bridged using',
  isPartOfSuperchain: 'options',
  hasTestnet: 'options',
  Arithmetization: 'arithmetizations',
  curve: 'Curves',
  Fflonk: 'Fflonks',
  Field: 'Fields',
  Groth16: 'Groth16s',
  ISA: 'ISAs',
  Other: 'Others',
  PCS: 'PCSs',
  Plonk: 'Plonks',
  STARK: 'STARKs',
  project: 'projects',
  contentCategory: 'content categories',
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
