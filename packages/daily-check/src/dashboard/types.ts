/** Everything needed to evaluate one metric visualization. */
export interface Tile {
  panelId: string
  title: string
  section: string
  index: string
  timeFrom: string
  timeTo: string
  /** Dashboard-level KQL of the lens object (state.query). */
  query?: string
  /** ES filter clauses from the dashboard's saved controls. */
  controlFilters: Record<string, unknown>[]
  /** Runtime fields defined on the tile's data view. */
  runtimeMappings?: Record<string, unknown>
  metricColumnId: string
  columns: Record<string, LensColumn>
  breakdown?: {
    field: string
    size: number
    orderBy?: 'metric' | 'key'
    orderDirection: 'asc' | 'desc'
  }
  palette?: Palette
}

export interface LensColumn {
  operationType: string
  sourceField?: string
  filter?: { query: string; language: string }
  references?: string[]
  /** Metric is computed over the trailing part of the window, e.g. "2h". */
  reducedTimeRange?: string
  params?: {
    percentile?: number
    sortField?: string
    tinymathAst?: TinymathNode
    format?: { id: string; params?: { fromUnit?: string } }
    size?: number
    orderBy?: { type: string; columnId?: string }
    orderDirection?: 'asc' | 'desc'
  }
}

export type TinymathNode =
  | number
  | string
  | { type: 'function'; name: string; args: TinymathNode[] }
  | { type: 'variable'; value: string }

export interface Palette {
  params?: {
    colorStops?: { color: string; stop: number | null }[]
    stops?: { color: string; stop: number | null }[]
    continuity?: 'above' | 'below' | 'all' | 'none'
    rangeMin?: number | null
    rangeMax?: number | null
  }
}

/** A panel that cannot be evaluated automatically — reported, never hidden. */
export interface SkippedTile {
  title: string
  section: string
  reason: string
}

export interface ControlPlane {
  title: string
  timeFrom: string
  timeTo: string
  controls: string[]
  tiles: Tile[]
  skipped: SkippedTile[]
}
