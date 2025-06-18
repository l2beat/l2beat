import { v } from '@l2beat/validate'
import { create } from 'zustand'

export const PANEL_IDS = [
  'list',
  'values',
  'nodes',
  'code',
  'preview',
  'terminal',
  'template',
] as const

export type PanelId = (typeof PANEL_IDS)[number]

export type Panel = { id: PanelId; size: number }

type State = {
  mouse: { x: number; y: number }
  panels: Panel[]
  layouts: Panel[][]
  selectedLayout: number
  active: PanelId | undefined
  fullScreen: PanelId | undefined
  pickedUp: PanelId | undefined
}

type Action = {
  changePanel: (from: PanelId, to: PanelId) => void
  addPanel: () => void
  ensurePanel: (panelId: PanelId) => void
  setActivePanel: (id: PanelId | undefined) => void
  removePanel: (id?: PanelId) => void
  toggleFullScreen: (id?: PanelId) => void
  resize: (id: PanelId, fraction: number) => void
  resizeAll: () => void
  mouseMove: (x: number, y: number) => void
  pickUp: (id: PanelId) => void
  order: (id: PanelId, before: boolean) => void
  drop: () => void
  loadLayout: (n: number) => void
}

const DEFAULT_LAYOUT: Panel[] = [
  { id: 'list', size: 0.5 },
  { id: 'values', size: 1 },
  { id: 'nodes', size: 1 },
]

const MAX_LAYOUTS = 6

function readStoredLayouts() {
  const zPanel = v.object({
    id: v.enum(PANEL_IDS),
    size: v.number().check((v) => v > 0),
  })

  const layouts: Panel[][] = new Array(MAX_LAYOUTS).fill(DEFAULT_LAYOUT)
  const json = localStorage.getItem('multi-app/layouts') ?? '[]'
  try {
    const object = JSON.parse(json)
    const items = v.array(v.array(zPanel)).parse(object)
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
export const useMultiViewStore = create<State & Action>((set) => ({
  mouse: { x: 0, y: 0 },
  // biome-ignore lint/style/noNonNullAssertion: We know it's there
  panels: storedLayouts[selectedLayout]!,
  layouts: storedLayouts,
  selectedLayout: selectedLayout,
  active: undefined,
  fullScreen: undefined,
  pickedUp: undefined,
  changePanel: (from, to) =>
    set((state) => {
      const fromPanel = state.panels.find((x) => x.id === from)
      if (!fromPanel) {
        return state
      }
      const toPanel: Panel = state.panels.find((x) => x.id === to) || {
        id: to,
        size: fromPanel.size,
      }
      const panels = state.panels.map((panel) =>
        panel.id === from
          ? { ...toPanel, size: fromPanel.size }
          : panel.id === to
            ? { ...fromPanel, size: toPanel.size }
            : panel,
      )
      return {
        ...withLayouts(state, panels),
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
      const panels = state.panels.concat([{ id: nextPanelId, size: 1 }])
      return {
        ...withLayouts(state, panels),
        active: nextPanelId,
      }
    }),
  ensurePanel: (panelId: PanelId) =>
    set((state) => {
      const demandedPanel = state.panels.find((p) => p.id === panelId)
      if (demandedPanel !== undefined) {
        return state
      }

      const panels = state.panels.concat([{ id: panelId, size: 1 }])
      return {
        ...withLayouts(state, panels),
        active: panelId,
      }
    }),
  removePanel: (id) =>
    set((state) => {
      const targetId = id ?? state.active
      if (state.panels.length === 1) {
        return state
      }
      const filtered = state.panels.filter((panel) => panel.id !== targetId)
      const minSize = Math.min(...filtered.map((x) => x.size))
      const panels = filtered.map((panel) => ({
        ...panel,
        size: panel.size / minSize,
      }))
      return {
        fullScreen:
          state.fullScreen === targetId ? undefined : state.fullScreen,
        ...withLayouts(state, panels),
        active:
          state.active === targetId
            ? panels[panels.length - 1]?.id
            : state.active,
      }
    }),
  setActivePanel: (id) => set(() => ({ active: id })),
  toggleFullScreen: (id) =>
    set((state) => {
      const targetId = id ?? state.active
      return {
        fullScreen: state.fullScreen === targetId ? undefined : targetId,
      }
    }),
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

      const panels = state.panels.map((p) =>
        p === panel
          ? { ...p, size: panelSize }
          : p === next
            ? { ...p, size: nextSize }
            : p,
      )
      return withLayouts(state, panels)
    }),
  resizeAll: () =>
    set((state) => {
      const panels = state.panels.map((panel) => ({
        ...panel,
        size: panel.id === 'list' ? 0.5 : 1,
      }))
      return withLayouts(state, panels)
    }),
  mouseMove: (x, y) => set(() => ({ mouse: { x, y } })),
  pickUp: (id) => set(() => ({ pickedUp: id })),
  order: (id, before) =>
    set((state) => {
      const target = state.panels.find(
        (f) => f.id === id && id !== state.pickedUp,
      )
      const pickedUp = state.panels.find((f) => f.id === state.pickedUp)
      if (!target || !pickedUp) {
        return state
      }
      const panels = []
      for (const panel of state.panels) {
        if (panel === target) {
          if (before) {
            panels.push(pickedUp, panel)
          } else {
            panels.push(panel, pickedUp)
          }
        } else if (panel !== pickedUp) {
          panels.push(panel)
        }
      }
      return withLayouts(state, panels)
    }),
  drop: () => set(() => ({ pickedUp: undefined })),
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
}))

function withLayouts(state: State, panels: State['panels']): Partial<State> {
  return {
    panels,
    layouts: state.layouts.map((layout, i) =>
      i === state.selectedLayout ? panels : layout,
    ),
  }
}

let timeout: ReturnType<typeof setTimeout>
useMultiViewStore.subscribe((state) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    localStorage.setItem('multi-app/layouts', JSON.stringify(state.layouts))
  }, 50)
})
