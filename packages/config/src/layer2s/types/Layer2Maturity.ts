export type MaturityCategory = 'A' | 'B' | 'C' | 'D' | '-'
export type MaturityModifier = '--' | '-' | '+' | '++'

export interface Layer2Maturity {
  category: {
    score: MaturityCategory
    requirements: string[]
  }
  modifier?: {
    score: MaturityModifier
    items: string[]
  }
  thingsToImprove?: {
    improvedScore: MaturityCategory
    requirements: string[]
  }
}
