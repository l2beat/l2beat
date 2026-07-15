import type { Kibana, SavedObject } from './kibana'

/**
 * A Tile is one metric visualization of the Control Plane dashboard,
 * resolved to everything needed to evaluate it: the index it reads, its
 * queries, the metric column graph and the color thresholds. Tiles are
 * parsed from live Kibana state at runtime, so dashboard edits are picked
 * up automatically.
 */
export interface Tile {
  panelId: string
  title: string
  section: string
  index: string
  timeFrom: string
  timeTo: string
  /** Dashboard-level KQL of the lens object (state.query). */
  query?: string
  /** ES filter clauses from the dashboard's saved controls (e.g. environment). */
  controlFilters: Record<string, unknown>[]
  /**
   * Runtime fields defined on the tile's data view (e.g. `environment` is
   * scripted from the index name). Kibana sends these with every query;
   * without them, filters on runtime fields match nothing.
   */
  runtimeMappings?: Record<string, unknown>
  /** Column id of the primary metric. */
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
  /** Human-readable description of the applied controls, e.g. "environment: production". */
  controls: string[]
  tiles: Tile[]
  skipped: SkippedTile[]
}

interface PinnedControl {
  order?: number
  type?: string
  config?: {
    field_name?: string
    selected_options?: string[]
    exclude?: boolean
    exists_selected?: boolean
  }
}

/**
 * Converts the dashboard's saved controls (the selectors at the top, e.g.
 * the environment picker) into ES filter clauses applied to every tile —
 * the same filtering Kibana applies when the dashboard is opened.
 */
export function parseControls(pinnedPanels: unknown): {
  filters: Record<string, unknown>[]
  descriptions: string[]
  unsupported: string[]
} {
  const filters: Record<string, unknown>[] = []
  const descriptions: string[] = []
  const unsupported: string[] = []

  const panels = (pinnedPanels as { panels?: Record<string, PinnedControl> })
    ?.panels
  const controls = Object.values(panels ?? {}).sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  )
  for (const control of controls) {
    const config = control.config
    if (control.type !== 'options_list_control' || !config?.field_name) {
      unsupported.push(`dashboard control of type "${control.type}"`)
      continue
    }
    const field = config.field_name
    let clause: Record<string, unknown> | undefined
    let description: string | undefined
    if (config.exists_selected) {
      clause = { exists: { field } }
      description = `${field}: exists`
    } else if (config.selected_options && config.selected_options.length > 0) {
      const options = config.selected_options
      clause =
        options.length === 1
          ? { match_phrase: { [field]: options[0] } }
          : {
              bool: {
                should: options.map((option) => ({
                  match_phrase: { [field]: option },
                })),
                minimum_should_match: 1,
              },
            }
      description = `${field}: ${options.join(', ')}`
    } else {
      // No selection saved — the control filters nothing.
      continue
    }
    if (config.exclude) {
      clause = { bool: { must_not: [clause] } }
      description = `NOT ${description}`
    }
    filters.push(clause)
    descriptions.push(description)
  }

  return { filters, descriptions, unsupported }
}

interface Panel {
  type?: string
  panelIndex: string
  title?: string
  embeddableConfig?: {
    title?: string
    attributes?: Record<string, unknown>
    timeRange?: { from: string; to: string }
    time_range?: { from: string; to: string }
  }
  gridData?: { x?: number; y?: number; sectionId?: string }
}

export async function loadControlPlane(
  kibana: Kibana,
  dashboardId: string,
): Promise<ControlPlane> {
  const dashboard = await kibana.getSavedObject('dashboard', dashboardId)
  const attributes = dashboard.attributes as {
    title: string
    timeFrom?: string
    timeTo?: string
    panelsJSON: string
    pinned_panels?: unknown
    sections?: { title: string; gridData: { i: string; y?: number } }[]
  }

  const controls = parseControls(attributes.pinned_panels)

  const sectionTitles = new Map<string, string>()
  for (const section of attributes.sections ?? []) {
    sectionTitles.set(section.gridData.i, section.title)
  }

  const timeFrom = attributes.timeFrom ?? 'now-24h'
  const timeTo = attributes.timeTo ?? 'now'

  // Panel y coordinates restart inside every section, so order by the
  // section's position first — otherwise sections interleave in the report.
  const sectionOrder = new Map<string, number>()
  for (const section of attributes.sections ?? []) {
    sectionOrder.set(section.gridData.i, section.gridData.y ?? 0)
  }
  const panels = (JSON.parse(attributes.panelsJSON) as Panel[]).sort(
    (a, b) =>
      (sectionOrder.get(a.gridData?.sectionId ?? '') ?? -1) -
        (sectionOrder.get(b.gridData?.sectionId ?? '') ?? -1) ||
      (a.gridData?.y ?? 0) - (b.gridData?.y ?? 0) ||
      (a.gridData?.x ?? 0) - (b.gridData?.x ?? 0),
  )

  const indexPatternCache = new Map<string, Promise<DataView>>()
  const tiles: Tile[] = []
  const skipped: SkippedTile[] = controls.unsupported.map((reason) => ({
    title: 'Dashboard control',
    section: '',
    reason: `${reason} — its filter is NOT applied`,
  }))

  for (const panel of panels) {
    const section = sectionTitles.get(panel.gridData?.sectionId ?? '') ?? ''
    // Links panels are navigation, not health signals.
    if (panel.type === 'links') {
      continue
    }
    const fallbackTitle =
      panel.embeddableConfig?.title ?? panel.title ?? 'Untitled panel'
    try {
      const tile = await parsePanel(
        kibana,
        dashboard,
        panel,
        section,
        timeFrom,
        timeTo,
        indexPatternCache,
      )
      tiles.push({ ...tile, controlFilters: controls.filters })
    } catch (error) {
      skipped.push({
        title: fallbackTitle,
        section,
        reason: error instanceof Error ? error.message : String(error),
      })
    }
  }

  return {
    title: attributes.title,
    timeFrom,
    timeTo,
    controls: controls.descriptions,
    tiles,
    skipped,
  }
}

interface DataView {
  title: string
  runtimeMappings?: Record<string, unknown>
}

async function parsePanel(
  kibana: Kibana,
  dashboard: SavedObject,
  panel: Panel,
  section: string,
  dashboardTimeFrom: string,
  dashboardTimeTo: string,
  indexPatternCache: Map<string, Promise<DataView>>,
): Promise<Tile> {
  if (panel.type !== 'vis' && panel.type !== 'lens') {
    throw new Error(`unsupported panel type "${panel.type}"`)
  }

  const lens = await resolveLens(kibana, dashboard, panel)
  const title =
    panel.embeddableConfig?.title ?? (lens.attributes.title as string)

  if (lens.attributes.visualizationType !== 'lnsMetric') {
    throw new Error(
      `unsupported visualization type "${lens.attributes.visualizationType}"`,
    )
  }

  const state = lens.attributes.state as {
    query?: { query: string; language: string }
    visualization: {
      layerId: string
      metricAccessor?: string
      breakdownByAccessor?: string
      palette?: Palette
    }
    datasourceStates: {
      formBased: {
        layers: Record<
          string,
          { columns: Record<string, LensColumn>; indexPatternId?: string }
        >
      }
    }
  }

  const viz = state.visualization
  const layer = state.datasourceStates.formBased.layers[viz.layerId]
  if (!layer || !viz.metricAccessor) {
    throw new Error('metric layer or metric accessor missing')
  }
  if (state.query && state.query.language !== 'kuery') {
    throw new Error(`unsupported query language "${state.query.language}"`)
  }

  const indexPatternId =
    layer.indexPatternId ??
    lens.references.find(
      (ref) =>
        ref.type === 'index-pattern' &&
        ref.name === `indexpattern-datasource-layer-${viz.layerId}`,
    )?.id
  if (!indexPatternId) {
    throw new Error('index pattern reference missing')
  }
  let dataViewPromise = indexPatternCache.get(indexPatternId)
  if (!dataViewPromise) {
    dataViewPromise = kibana
      .getSavedObject('index-pattern', indexPatternId)
      .then((pattern) => {
        const runtimeFieldMap = pattern.attributes.runtimeFieldMap
        return {
          title: pattern.attributes.title as string,
          runtimeMappings:
            typeof runtimeFieldMap === 'string' && runtimeFieldMap
              ? (JSON.parse(runtimeFieldMap) as Record<string, unknown>)
              : undefined,
        }
      })
    indexPatternCache.set(indexPatternId, dataViewPromise)
  }
  const dataView = await dataViewPromise

  let breakdown: Tile['breakdown']
  if (viz.breakdownByAccessor) {
    const column = layer.columns[viz.breakdownByAccessor]
    if (column?.operationType !== 'terms' || !column.sourceField) {
      throw new Error(
        `unsupported breakdown operation "${column?.operationType}"`,
      )
    }
    const orderBy = column.params?.orderBy
    breakdown = {
      field: column.sourceField,
      size: column.params?.size ?? 10,
      orderBy:
        orderBy?.type === 'column' && orderBy.columnId === viz.metricAccessor
          ? 'metric'
          : orderBy?.type === 'alphabetical'
            ? 'key'
            : undefined,
      orderDirection: column.params?.orderDirection ?? 'desc',
    }
  }

  const timeRange =
    panel.embeddableConfig?.timeRange ?? panel.embeddableConfig?.time_range

  return {
    panelId: panel.panelIndex,
    title,
    section,
    index: dataView.title,
    timeFrom: timeRange?.from ?? dashboardTimeFrom,
    timeTo: timeRange?.to ?? dashboardTimeTo,
    query: state.query?.query || undefined,
    controlFilters: [],
    runtimeMappings: dataView.runtimeMappings,
    metricColumnId: viz.metricAccessor,
    columns: layer.columns,
    breakdown,
    palette: viz.palette,
  }
}

async function resolveLens(
  kibana: Kibana,
  dashboard: SavedObject,
  panel: Panel,
): Promise<{
  attributes: Record<string, unknown>
  references: SavedObject['references']
}> {
  // By-value panel: the lens attributes are embedded in the dashboard.
  const embedded = panel.embeddableConfig?.attributes
  if (embedded?.state) {
    return {
      attributes: embedded,
      references:
        (embedded.references as SavedObject['references'] | undefined) ??
        dashboard.references.filter((ref) =>
          ref.name.startsWith(`${panel.panelIndex}:`),
        ),
    }
  }
  // By-reference panel: resolve through the dashboard's references.
  const ref = dashboard.references.find(
    (reference) => reference.name === `${panel.panelIndex}:savedObjectRef`,
  )
  if (!ref) {
    throw new Error('panel has no embedded state and no saved object ref')
  }
  const saved = await kibana.getSavedObject(ref.type, ref.id)
  return { attributes: saved.attributes, references: saved.references }
}
