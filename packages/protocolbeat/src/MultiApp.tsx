import { create } from 'zustand'

const PANEL_IDS = ['list', 'values', 'nodes', 'code', 'preview'] as const
type PanelId = (typeof PANEL_IDS)[number]

type State = {
  panels: { id: PanelId; size: number }[]
  fullScreen: PanelId | undefined
}

type Action = {
  changePanel: (from: PanelId, to: PanelId) => void
  splitPanel: (id: PanelId) => void
  removePanel: (id: PanelId) => void
  toggleFullScren: (id: PanelId) => void
}

const useStore = create<State & Action>((set) => ({
  panels: [
    { id: 'list', size: 1 },
    { id: 'values', size: 2 },
    { id: 'nodes', size: 2 },
  ],
  fullScreen: undefined,
  changePanel: (from, to) =>
    set((state) => {
      const fromPanel = state.panels.find((x) => x.id === from)
      if (!fromPanel) {
        return state
      }
      const toPanel = state.panels.find((x) => x.id === to) || {
        id: to,
        size: fromPanel.size,
      }
      return {
        panels: state.panels.map((panel) =>
          panel.id === from ? toPanel : panel.id === to ? fromPanel : panel,
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
}))

const PANEL_INFO = {
  list: { color: '#ff003b', name: 'List' },
  values: { color: '#feff00', name: 'Values' },
  nodes: { color: '#01ffb1', name: 'Nodes' },
  code: { color: '#00c1ff', name: 'Code' },
  preview: { color: '#ff019c', name: 'Preview' },
}

export function MultiApp() {
  const panels = useStore((state) => state.panels)
  const fullScreen = useStore((state) => state.fullScreen)

  return (
    <div className="flex h-full w-full flex-col">
      <div className="h-10">TOP BAR</div>
      <div
        className="grid flex-1"
        style={{
          gridTemplateColumns: fullScreen
            ? '1fr'
            : panels.map((x) => x.size + 'fr').join(' '),
        }}
      >
        {panels
          .filter(
            (panel) => fullScreen === undefined || panel.id === fullScreen,
          )
          .map((panel) => {
            return <Panel key={panel.id} id={panel.id} />
          })}
      </div>
    </div>
  )
}

function Panel(props: { id: PanelId }) {
  const isFullScreen = useStore((state) => state.fullScreen === props.id)
  const changePanel = useStore((state) => state.changePanel)
  const toggleFullScren = useStore((state) => state.toggleFullScren)
  const splitPanel = useStore((state) => state.splitPanel)
  const removePanel = useStore((state) => state.removePanel)

  const info = PANEL_INFO[props.id]

  return (
    <div className="flex flex-col" id={`panel-${props.id}`}>
      <div className="flex h-[36px] select-none justify-between border border-black border-y-2 bg-slate-100 px-[7px] py-1">
        <select
          value={props.id}
          onChange={(e) => changePanel(props.id, e.target.value as PanelId)}
        >
          {Object.entries(PANEL_INFO).map(([key, value]) => (
            <option value={key}>{value.name}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <button onClick={() => toggleFullScren(props.id)}>F</button>
          {!isFullScreen && (
            <button onClick={() => splitPanel(props.id)}>S</button>
          )}
          {!isFullScreen && (
            <button onClick={() => removePanel(props.id)}>X</button>
          )}
        </div>
      </div>
      <div className="flex-1 px-2 py-1" style={{ backgroundColor: info.color }}>
        {info.name} body
      </div>
    </div>
  )
}
