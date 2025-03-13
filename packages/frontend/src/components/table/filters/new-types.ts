export interface FilterableEntry {
  filterable: FilterableValue[]
}

export type FilterableValue = {
  id: FilterableValueId
  value: string
}

export type FilterableValueId = keyof typeof filterIdToLabel

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
