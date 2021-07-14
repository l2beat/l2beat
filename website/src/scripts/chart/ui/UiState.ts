export interface UiState {
  dateRange: string
  description: string
  labels: string[]
  points: Point[]
}

export interface Point {
  x: number
  y: number
  date: string
  valueA: string
  valueB: string
}
