export interface Column {
  header: string
  rows: string[]
}

export interface FetchResult {
  sourcePretty: string
  names: string[]
  columns?: Column[]
}

export interface FetchProjects {
  fetch(): Promise<FetchResult>
}
