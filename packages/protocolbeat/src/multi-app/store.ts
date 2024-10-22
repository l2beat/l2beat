import { create } from 'zustand'

export const PANEL_IDS = ['list', 'values', 'nodes', 'code', 'preview'] as const
export type PanelId = (typeof PANEL_IDS)[number]

export type State = {
  mouse: { x: number; y: number }
  panels: { id: PanelId; size: number }[]
  fullScreen: PanelId | undefined
  hover: PanelId | undefined
}

export type Action = {
  changePanel: (from: PanelId, to: PanelId) => void
  splitPanel: (id: PanelId) => void
  removePanel: (id: PanelId) => void
  toggleFullScren: (id: PanelId) => void
  resize: (id: PanelId, fraction: number) => void
  mouseMove: (x: number, y: number) => void
  pickUp: (id: PanelId) => void
  order: (id: PanelId, before: boolean) => void
  drop: () => void
}

export const useStore = create<State & Action>((set) => ({
  mouse: { x: 0, y: 0 },
  panels: [
    { id: 'list', size: 1 },
    { id: 'values', size: 2 },
    { id: 'nodes', size: 2 },
  ],
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
  splitPanel: (id) =>
    set((state) => ({
      panels: state.panels.flatMap((panel) => {
        if (panel.id !== id) {
          return [panel]
        }
        const nextPanelId = PANEL_IDS.find(
          (id) => !state.panels.find((p) => p.id === id),
        )
        if (!nextPanelId) {
          return [panel]
        }
        return [
          { ...panel, size: panel.size / 2 },
          { id: nextPanelId, size: panel.size / 2 },
        ]
      }),
    })),
  removePanel: (id) =>
    set((state) => {
      if (state.panels.length === 1) {
        return state
      }
      const toRemove = state.panels.find((panel) => panel.id === id)
      if (!toRemove) {
        return state
      }
      const isLast = toRemove === state.panels[state.panels.length - 1]
      return {
        panels: state.panels
          .map((panel, i) =>
            state.panels[isLast ? i + 1 : i - 1] === toRemove
              ? { ...panel, size: panel.size + toRemove.size }
              : panel,
          )
          .filter((panel) => panel.id !== id),
      }
    }),
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
}))
