export type MaturityStage = 'Stage 0' | 'Stage 1' | 'Stage 2'

export interface Layer2Maturity {
  stage: MaturityStage
  modifiers: {
    sentiment: 'bad' | 'warning'
    value: string
  }[]
}
