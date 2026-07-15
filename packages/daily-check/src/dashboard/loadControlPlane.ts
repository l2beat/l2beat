import type { KibanaClient } from '../clients/KibanaClient'
import { getControls } from './getControls'
import { type KibanaDataView, loadLensTile, type Panel } from './loadLensTile'
import type { ControlPlane, SkippedTile, Tile } from './types'

export async function loadControlPlane(
  kibana: KibanaClient,
  dashboardId: string,
): Promise<ControlPlane> {
  const dashboard = await kibana.getSavedObject('dashboard', dashboardId)
  const attributes = dashboard.attributes as {
    title: string
    timeFrom?: string
    timeTo?: string
    panelsJSON: string
    sections?: { title: string; gridData: { i: string; y?: number } }[]
  }

  const controls = getControls()
  const sectionTitles = new Map<string, string>()
  const sectionOrder = new Map<string, number>()
  for (const section of attributes.sections ?? []) {
    sectionTitles.set(section.gridData.i, section.title)
    sectionOrder.set(section.gridData.i, section.gridData.y ?? 0)
  }

  const timeFrom = attributes.timeFrom ?? 'now-24h'
  const timeTo = attributes.timeTo ?? 'now'

  // Panel y coordinates restart inside every section.
  const panels = (JSON.parse(attributes.panelsJSON) as Panel[]).sort(
    (a, b) =>
      (sectionOrder.get(a.gridData?.sectionId ?? '') ?? -1) -
        (sectionOrder.get(b.gridData?.sectionId ?? '') ?? -1) ||
      (a.gridData?.y ?? 0) - (b.gridData?.y ?? 0) ||
      (a.gridData?.x ?? 0) - (b.gridData?.x ?? 0),
  )

  const indexPatternCache = new Map<string, Promise<KibanaDataView>>()
  const tiles: Tile[] = []
  const skipped: SkippedTile[] = []

  for (const panel of panels) {
    const section = sectionTitles.get(panel.gridData?.sectionId ?? '') ?? ''
    if (panel.type === 'links') {
      continue
    }
    const fallbackTitle =
      panel.embeddableConfig?.title ?? panel.title ?? 'Untitled panel'
    try {
      const tile = await loadLensTile(
        kibana,
        dashboard,
        panel,
        section,
        timeFrom,
        timeTo,
        indexPatternCache,
      )
      tiles.push({
        ...tile,
        controlFilters: controls.filters,
      })
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
