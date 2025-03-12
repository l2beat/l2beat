export type FilterableValue = {
  id: FilterableValueId
  value: string
}

export type FilterableValueId =
  | 'type'
  | 'stack'
  | 'stage'
  | 'purpose'
  | 'hostChain'
  | 'daLayer'
  | 'raas'

export const filterIdToLabel: Record<FilterableValueId, string> = {
  type: 'Type',
  stack: 'Stack',
  stage: 'Stage',
  purpose: 'Purpose',
  hostChain: 'Host Chain',
  daLayer: 'DA Layer',
  raas: 'RaaS',
}
