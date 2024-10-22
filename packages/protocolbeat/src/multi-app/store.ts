import { z } from 'zod'
import { create } from 'zustand'

export const PANEL_IDS = ['list', 'values', 'nodes', 'code', 'preview'] as const
export type PanelId = (typeof PANEL_IDS)[number]

export type Panel = { id: PanelId; size: number }

export type State = {
  mouse: { x: number; y: number }
  panels: Panel[]
  layouts: Panel[][]
  selectedLayout: number
  active: PanelId | undefined
  fullScreen: PanelId | undefined
  hover: PanelId | undefined
}

export type Action = {
  changePanel: (from: PanelId, to: PanelId) => void
  addPanel: () => void
  setActivePanel: (id: PanelId | undefined) => void
  removePanel: (id: PanelId) => void
  toggleFullScren: (id: PanelId) => void
  resize: (id: PanelId, fraction: number) => void
  mouseMove: (x: number, y: number) => void
  pickUp: (id: PanelId) => void
  order: (id: PanelId, before: boolean) => void
  drop: () => void
  loadLayout: (n: number) => void
  saveLayout: (n: number) => void
}

const DEFAULT_LAYOUT: Panel[] = [
  { id: 'list', size: 0.5 },
  { id: 'values', size: 1 },
  { id: 'nodes', size: 1 },
]

const MAX_LAYOUTS = 6

function readStoredLayouts() {
  const zPanel = z.object({
    id: z.enum(PANEL_IDS),
    size: z.number().gt(0),
  })

  const layouts: Panel[][] = new Array(MAX_LAYOUTS).fill(DEFAULT_LAYOUT)
  const json = localStorage.getItem('multi-app/layouts') ?? '[]'
  try {
    const object = JSON.parse(json)
    const items = z.array(z.array(zPanel)).parse(object)
    for (let i = 0; i < layouts.length; i++) {
      layouts[i] = items[i] ?? DEFAULT_LAYOUT
    }
  } catch (e) {
    console.error(e)
  }
  return layouts
}

function readSelectedLayout() {
  const json = localStorage.getItem('multi-app/selectedLayout') ?? '0'
  try {
    const value = JSON.parse(json)
    if (
      typeof value === 'number' &&
      Number.isInteger(value) &&
      value >= 0 &&
      value < MAX_LAYOUTS
    ) {
      return value
    }
  } catch {}
  return 0
}

const storedLayouts = readStoredLayouts()
const selectedLayout = readSelectedLayout()
export const useStore = create<State & Action>((set) => ({
  mouse: { x: 0, y: 0 },
  // biome-ignore lint/style/noNonNullAssertion: We know it's there
  panels: storedLayouts[selectedLayout]!,
  layouts: storedLayouts,
  selectedLayout: selectedLayout,
  active: undefined,
  fullScreen: undefined,
  hover: undefined,
  changePanel: (from, to) =>
    set((state) => {
      const fromPanel = state.panels.find((x) => x.id === from)
      if (!fromPanel) {
        return state
      }
      const toPanel = state.panels.find((x) => x.id === to) || {
        id: to,
        size: fromPanel.size,
        hover: false,
      }
      return {
        panels: state.panels.map((panel) =>
          panel.id === from
            ? { ...toPanel, size: fromPanel.size }
            : panel.id === to
              ? { ...fromPanel, size: toPanel.size }
              : panel,
        ),
        fullScreen: state.fullScreen === from ? to : state.fullScreen,
      }
    }),
  addPanel: () =>
    set((state) => {
      const nextPanelId = PANEL_IDS.find(
        (id) => !state.panels.find((p) => p.id === id),
      )
      if (!nextPanelId) {
        return state
      }
      return { panels: state.panels.concat([{ id: nextPanelId, size: 1 }]) }
    }),
  removePanel: (id) =>
    set((state) => {
      if (state.panels.length === 1) {
        return state
      }
      return {
        fullScreen: state.fullScreen === id ? undefined : state.fullScreen,
        panels: state.panels.filter((panel) => panel.id !== id),
      }
    }),
  setActivePanel: (id) => set(() => ({ active: id })),
  toggleFullScren: (id) =>
    set((state) => ({
      fullScreen: state.fullScreen === id ? undefined : id,
    })),
  resize: (id, fraction) =>
    set((state) => {
      const index = state.panels.findIndex((panel) => panel.id === id)
      const panel = state.panels[index]
      const next = state.panels[index + 1]
      if (!panel || !next) {
        return state
      }

      const totalSize = panel.size + next.size
      const panelSize = totalSize * fraction
      const nextSize = totalSize * (1 - fraction)

      return {
        panels: state.panels.map((p) =>
          p === panel
            ? { ...p, size: panelSize }
            : p === next
              ? { ...p, size: nextSize }
              : p,
        ),
      }
    }),
  mouseMove: (x, y) => set(() => ({ mouse: { x, y } })),
  pickUp: (id) => set(() => ({ hover: id })),
  order: (id, before) =>
    set((state) => {
      const target = state.panels.find((f) => f.id === id && id !== state.hover)
      const hover = state.panels.find((f) => f.id === state.hover)
      if (!target || !hover) {
        return state
      }
      const panels = []
      for (const panel of state.panels) {
        if (panel === target) {
          if (before) {
            panels.push(hover, panel)
          } else {
            panels.push(panel, hover)
          }
        } else if (panel !== hover) {
          panels.push(panel)
        }
      }
      return { panels }
    }),
  drop: () => set(() => ({ hover: undefined })),
  loadLayout: (n) =>
    set((state) => {
      const layout = state.layouts[n]
      if (!layout) {
        return state
      }
      // SIDE EFFECT!
      localStorage.setItem('multi-app/selectedLayout', JSON.stringify(n))
      return { panels: layout, selectedLayout: n }
    }),
  saveLayout: (n) =>
    set((state) => {
      const layouts = state.layouts.map((layout, i) =>
        i === n ? state.panels : layout,
      )
      // SIDE EFFECT!
      localStorage.setItem('multi-app/layouts', JSON.stringify(layouts))
      return { layouts }
    }),
}))
