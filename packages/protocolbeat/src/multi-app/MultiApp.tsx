import clsx from 'clsx'
import { Fragment, ReactNode, useEffect, useRef } from 'react'
import { PanelId, useStore } from './store'

const RESIZE_AREA = 20
const MIN_PANEL_WIDTH = 160

const PANEL_INFO = {
  list: { color: '#ff003b', name: 'List' },
  values: { color: '#feff00', name: 'Values' },
  nodes: { color: '#01ffb1', name: 'Nodes' },
  code: { color: '#00c1ff', name: 'Code' },
  preview: { color: '#ff019c', name: 'Preview' },
}

export function MultiApp() {
  const panelContainerRef = useRef<HTMLDivElement>(null)

  const panels = useStore((state) => state.panels)
  const fullScreen = useStore((state) => state.fullScreen)
  const resize = useStore((state) => state.resize)
  const mouseMove = useStore((state) => state.mouseMove)
  const drop = useStore((state) => state.drop)
  const order = useStore((state) => state.order)

  useEffect(() => {
    let left = 0
    let right = 0
    let resized: PanelId | undefined = undefined

    function getSelectedPanel(e: MouseEvent) {
      const container = panelContainerRef.current
      if (!container) {
        return
      }

      for (let i = 0; i < container.children.length - 1; i++) {
        // biome-ignore lint/style/noNonNullAssertion: It's there
        const panel = container.children[i]!
        const box = panel.getBoundingClientRect()
        if (
          e.clientY > box.top &&
          e.clientX >= box.right - RESIZE_AREA / 2 &&
          e.clientX < box.right + RESIZE_AREA / 2
        ) {
          return {
            panelId: panel.id.slice('panel-'.length) as PanelId,
            left: box.left,
            right:
              container.children[i + 1]?.getBoundingClientRect().right ?? 0,
          }
        }
      }
    }

    function onMouseDown(e: MouseEvent) {
      const selection = getSelectedPanel(e)
      if (selection && e.button === 0) {
        left = selection.left
        right = selection.right
        resized = selection.panelId
      } else if (!selection) {
        resized = undefined
      }
    }

    function onMouseUp() {
      resized = undefined
      drop()
    }

    function onMouseMove(e: MouseEvent) {
      mouseMove(e.clientX, e.clientY)

      const container = panelContainerRef.current
      if (!container) {
        return
      }

      const { hover } = useStore.getState()
      container.classList.toggle('select-none', !!hover)

      if (hover) {
        const panels = [...container.children]
        for (const panel of panels) {
          const box = panel.getBoundingClientRect()
          if (e.clientX >= box.left && e.clientX < box.right) {
            const panelId = panel.id.slice('panel-'.length) as PanelId
            if (panelId !== hover) {
              order(panelId, e.clientX < (box.left + box.right) / 2)
            }
            break
          }
        }
      } else if (!resized) {
        const selection = getSelectedPanel(e)
        const container = panelContainerRef.current
        container?.classList.toggle('cursor-col-resize', !!selection)
        container?.classList.toggle('select-none', !!selection)
      } else {
        const midpoint = (right + left) / 2
        const leftMin =
          midpoint - left > MIN_PANEL_WIDTH ? left + MIN_PANEL_WIDTH : midpoint
        const leftMax =
          right - midpoint > MIN_PANEL_WIDTH
            ? right - MIN_PANEL_WIDTH
            : midpoint

        const x = Math.min(leftMax, Math.max(leftMin, e.clientX))
        resize(resized, (x - left) / (right - left))
      }
    }

    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <div className="flex h-full w-full flex-col">
      <div className="h-10">TOP BAR</div>
      <div
        ref={panelContainerRef}
        className="grid flex-1"
        style={{
          gridTemplateColumns: fullScreen
            ? '1fr'
            : panels
                .map((x) => `minmax(${MIN_PANEL_WIDTH}px, ${x.size}fr)`)
                .join(' '),
        }}
      >
        {panels.map((panel) => {
          return <Panel key={panel.id} id={panel.id} />
        })}
      </div>
    </div>
  )
}

function Panel(props: { id: PanelId }) {
  const hidden = useStore(
    (state) => state.fullScreen !== undefined && state.fullScreen !== props.id,
  )
  const isHover = useStore((state) => state.hover === props.id)
  const info = PANEL_INFO[props.id]

  const HeaderWrapper = isHover ? HoverHeader : Fragment
  return (
    <div
      className={clsx('flex flex-col', hidden && 'hidden')}
      id={`panel-${props.id}`}
    >
      <HeaderWrapper>
        <PanelHeader id={props.id} />
      </HeaderWrapper>
      {!isHover && (
        <div
          className="flex-1 px-2 py-1"
          style={{ backgroundColor: info.color }}
        >
          {info.name} body
        </div>
      )}
      {isHover && <div className="flex-1 bg-slate-100" />}
    </div>
  )
}

function HoverHeader(props: { children: ReactNode }) {
  const mouse = useStore((state) => state.mouse)

  return (
    <div
      style={{ left: mouse.x - 100, top: mouse.y - 18 }}
      className="fixed h-[36px] w-[200px] cursor-move select-none"
    >
      {props.children}
    </div>
  )
}

function PanelHeader(props: { id: PanelId }) {
  const isFullScreen = useStore((state) => state.fullScreen === props.id)
  const changePanel = useStore((state) => state.changePanel)
  const pickUp = useStore((state) => state.pickUp)
  const toggleFullScren = useStore((state) => state.toggleFullScren)
  const splitPanel = useStore((state) => state.splitPanel)
  const removePanel = useStore((state) => state.removePanel)

  return (
    <div className="flex h-[36px] select-none border border-black border-y-2 bg-slate-100 px-[7px] py-1">
      <select
        value={props.id}
        onChange={(e) => changePanel(props.id, e.target.value as PanelId)}
      >
        {Object.entries(PANEL_INFO).map(([key, value]) => (
          <option key={key} value={key}>
            {value.name}
          </option>
        ))}
      </select>
      <div
        className={clsx('flex-1', !isFullScreen && 'cursor-move')}
        onMouseDown={
          !isFullScreen ? (e) => e.button === 0 && pickUp(props.id) : undefined
        }
      />
      <div className="flex gap-1">
        <button className="w-4" onClick={() => toggleFullScren(props.id)}>
          F
        </button>
        {!isFullScreen && (
          <button className="w-4" onClick={() => splitPanel(props.id)}>
            S
          </button>
        )}
        {!isFullScreen && (
          <button className="w-4" onClick={() => removePanel(props.id)}>
            X
          </button>
        )}
      </div>
    </div>
  )
}
