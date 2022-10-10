export interface UiState {
  dateRange: string
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
