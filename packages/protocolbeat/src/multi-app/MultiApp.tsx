import clsx from 'clsx'
import { Fragment, ReactNode, useEffect, useRef, useState } from 'react'
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
  const setActivePanel = useStore((state) => state.setActivePanel)

  useEffect(() => {
    let left = 0
    let right = 0
    let resized: PanelId | undefined = undefined

    function getPanel(e: MouseEvent) {
      const container = panelContainerRef.current
      if (!container) {
        return {}
      }
      let toResize:
        | { panelId: PanelId; left: number; right: number }
        | undefined = undefined
      let hovered: PanelId | undefined
      for (let i = 0; i < container.children.length; i++) {
        // biome-ignore lint/style/noNonNullAssertion: It's there
        const panel = container.children[i]!
        const box = panel.getBoundingClientRect()
        if (
          i !== container.children.length - 1 &&
          e.clientY > box.top &&
          e.clientY < box.bottom &&
          e.clientX >= box.right - RESIZE_AREA / 2 &&
          e.clientX < box.right + RESIZE_AREA / 2
        ) {
          toResize = {
            panelId: panel.id.slice('panel-'.length) as PanelId,
            left: box.left,
            right:
              container.children[i + 1]?.getBoundingClientRect().right ?? 0,
          }
        }
        if (
          e.clientY > box.top &&
          e.clientY < box.bottom &&
          e.clientX >= box.left &&
          e.clientX < box.right
        ) {
          hovered = panel.id.slice('panel-'.length) as PanelId
        }
      }
      return { toResize, hovered }
    }

    function onMouseDown(e: MouseEvent) {
      const { toResize, hovered } = getPanel(e)
      if (toResize && e.button === 0) {
        left = toResize.left
        right = toResize.right
        resized = toResize.panelId
      } else if (!toResize) {
        resized = undefined
      }
      setActivePanel(hovered)
    }

    function onMouseUp() {
      resized = undefined
      drop()
    }

    function onMouseMove(e: MouseEvent) {
      mouseMove(e.clientX, e.clientY)

      const { hover } = useStore.getState()
      document.body.classList.toggle('select-none', !!hover)

      if (hover) {
        const container = panelContainerRef.current
        if (!container) {
          return
        }
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
        const { toResize } = getPanel(e)
        const container = panelContainerRef.current
        container?.classList.toggle('cursor-col-resize', !!toResize)
        container?.classList.toggle('select-none', !!toResize)
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
      <TopBar />
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
      <BottomBar />
    </div>
  )
}

function TopBar() {
  const layouts = useStore((state) => state.layouts)
  const selectedLayout = useStore((state) => state.selectedLayout)
  const loadLayout = useStore((state) => state.loadLayout)
  const saveLayout = useStore((state) => state.saveLayout)
  const addPanel = useStore((state) => state.addPanel)
  return (
    <div className="flex h-10 items-center justify-between px-2">
      <div>DISCOVERY</div>
      <div className="flex gap-2">
        <div className="grid grid-cols-6">
          {layouts.map((_, i) => (
            <button
              key={i}
              className={clsx('w-4', selectedLayout === i && 'bg-fuchsia-300')}
              onClick={() => loadLayout(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button onClick={() => saveLayout(selectedLayout)}>Save Layout</button>
        <button onClick={() => addPanel()}>Add Panel</button>
      </div>
    </div>
  )
}

function Keys(props: { keys: string[] }) {
  return (
    <span className="inline-flex gap-1">
      {props.keys.map((key, i) => (
        <kbd key={i} className="bg-black px-1 text-white">
          {key}
        </kbd>
      ))}
    </span>
  )
}

function BottomBar() {
  const [hintOpen, setHintOpen] = useState(false)
  const loadLayout = useStore((state) => state.loadLayout)
  const addPanel = useStore((state) => state.addPanel)
  const removePanel = useStore((state) => state.removePanel)
  const toggleFullScren = useStore((state) => state.toggleFullScren)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.code === 'F1') {
        setHintOpen((open) => !open)
      }
      for (let i = 0; i < 6; i++) {
        if (e.code === `Digit${i + 1}` && e.altKey) {
          loadLayout(i)
        }
      }
      if (e.code === 'Enter' && e.altKey) {
        addPanel()
      }
      if (e.code === 'KeyQ' && e.altKey) {
        removePanel()
      }
      if (e.code === 'KeyF' && e.altKey) {
        toggleFullScren()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const altKey = navigator.platform.includes('Mac') ? 'Opt' : 'Alt'

  return (
    <div className="flex h-6 items-center justify-between px-2">
      <div>Bottom Bar</div>
      <div className="flex gap-2">
        <button onClick={() => setHintOpen((open) => !open)}>
          Help <Keys keys={['F1']} />
        </button>
      </div>
      {hintOpen && (
        <div className="fixed right-2 bottom-8 bg-slate-100 p-4">
          <p>Keyboard Shortcuts</p>
          <ul>
            <li>
              <Keys keys={['F1']} /> - help
            </li>
            <li>
              <Keys keys={[altKey, '1']} /> to <Keys keys={['6']} /> - Select
              layout
            </li>
            <li>
              <Keys keys={[altKey, 'F']} /> - Fullscreen panel
            </li>
            <li>
              <Keys keys={[altKey, 'Q']} /> - Remove panel
            </li>
            <li>
              <Keys keys={[altKey, 'Enter']} /> - Add panel
            </li>
          </ul>
        </div>
      )}
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
      <div
        className={clsx('flex-1 px-2 py-1', isHover && 'hidden')}
        style={{ backgroundColor: info.color }}
      >
        {info.name} body
      </div>
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
  const isActive = useStore((state) => state.active === props.id)
  const changePanel = useStore((state) => state.changePanel)
  const pickUp = useStore((state) => state.pickUp)
  const toggleFullScren = useStore((state) => state.toggleFullScren)
  const removePanel = useStore((state) => state.removePanel)

  return (
    <div
      className={clsx(
        'flex h-[36px] select-none border border-black border-y-2 px-[7px] py-1',
        isActive ? 'bg-blue-200' : 'bg-slate-100',
      )}
    >
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
        <button className="w-4" onClick={() => removePanel(props.id)}>
          X
        </button>
      </div>
    </div>
  )
}
