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
