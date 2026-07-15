import type { KibanaClient, SavedObject } from '../clients/KibanaClient'
import type { LensColumn, Palette, Tile } from './types'

export interface Panel {
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

export interface KibanaDataView {
  title: string
  runtimeMappings?: Record<string, unknown>
}

export async function loadLensTile(
  kibana: KibanaClient,
  dashboard: SavedObject,
  panel: Panel,
  section: string,
  dashboardTimeFrom: string,
  dashboardTimeTo: string,
  indexPatternCache: Map<string, Promise<KibanaDataView>>,
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
  kibana: KibanaClient,
  dashboard: SavedObject,
  panel: Panel,
): Promise<{
  attributes: Record<string, unknown>
  references: SavedObject['references']
}> {
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
  const ref = dashboard.references.find(
    (reference) => reference.name === `${panel.panelIndex}:savedObjectRef`,
  )
  if (!ref) {
    throw new Error('panel has no embedded state and no saved object ref')
  }
  const saved = await kibana.getSavedObject(ref.type, ref.id)
  return { attributes: saved.attributes, references: saved.references }
}
