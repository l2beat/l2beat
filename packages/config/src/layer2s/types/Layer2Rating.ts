export type RatingCategory = 'A' | 'B' | 'C' | 'D' | '-'
export type RatingModifier = '--' | '-' | '+' | '++'

export interface Layer2Rating {
  category: {
    score: RatingCategory
    requirements: string[]
  }
  modifier?: {
    score: RatingModifier
    items: string[]
  }
  thingsToImprove?: {
    improvedScore: RatingCategory
    requirements: string[]
  }
}
