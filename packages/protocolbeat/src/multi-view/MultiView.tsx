import { type ComponentType, useEffect, useRef, useState } from 'react'
import { BottomBar } from './BottomBar'
import { useBreakpoint } from './hooks/useBreakpoint'
import { Panel } from './Panel'
import { type PanelId, useMultiViewStore } from './store'
import { TopBar } from './TopBar'

const RESIZE_AREA = 8
const MIN_PANEL_WIDTH = 160

export interface MultiViewProps {
  project: string
  panelBodyElement: ComponentType<{ kind: PanelId }>
}

export function MultiView(props: MultiViewProps) {
  const panelContainerRef = useRef<HTMLDivElement>(null)
  const isMobileOrTablet = useBreakpoint()

  const panels = useMultiViewStore((state) => state.panels)
  const fullScreen = useMultiViewStore((state) => state.fullScreen)
  const resize = useMultiViewStore((state) => state.resize)
  const resizeAll = useMultiViewStore((state) => state.resizeAll)
  const mouseMove = useMultiViewStore((state) => state.mouseMove)
  const drop = useMultiViewStore((state) => state.drop)
  const order = useMultiViewStore((state) => state.order)
  const setActivePanel = useMultiViewStore((state) => state.setActivePanel)
  const toggleFullScreen = useMultiViewStore((state) => state.toggleFullScreen)
  const [sizes, setSizes] = useState<number[]>([])

  useEffect(() => {
    const nodesPanel = panels.find((panel) => panel.id === 'nodes')

    if (isMobileOrTablet && !fullScreen) {
      if (nodesPanel) {
        toggleFullScreen('nodes')
        setActivePanel('nodes')
      } else {
        const firstPanel = panels[0]
        if (firstPanel) {
          toggleFullScreen(firstPanel.id)
        }
      }
    }
  }, [isMobileOrTablet, fullScreen, panels, toggleFullScreen, setActivePanel])

  function getPanelElements() {
    const container = panelContainerRef.current
    if (!container) {
      return []
    }
    return [...container.children].filter((x) => x.id.startsWith('panel-'))
  }

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

      const panels = getPanelElements()
      for (const [i, panel] of panels.entries()) {
        const box = panel.getBoundingClientRect()
        if (
          i !== panels.length - 1 &&
          e.clientY > box.top &&
          e.clientY < box.bottom &&
          e.clientX >= box.right - RESIZE_AREA / 2 &&
          e.clientX < box.right + RESIZE_AREA / 2
        ) {
          toResize = {
            panelId: panel.id.slice('panel-'.length) as PanelId,
            left: box.left,
            right: panels[i + 1]?.getBoundingClientRect().right ?? 0,
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

      const { pickedUp } = useMultiViewStore.getState()
      document.body.classList.toggle('select-none', !!pickedUp)

      if (pickedUp) {
        const panels = getPanelElements()
        for (const panel of panels) {
          const box = panel.getBoundingClientRect()
          if (e.clientX >= box.left && e.clientX < box.right) {
            const panelId = panel.id.slice('panel-'.length) as PanelId
            if (panelId !== pickedUp) {
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

  useEffect(() => {
    onResize()
    function onResize() {
      const panels = getPanelElements()
      const sizes: number[] = []
      for (const panel of panels) {
        const { right } = panel.getBoundingClientRect()
        sizes.push(right)
      }
      sizes.pop()
      setSizes(sizes)
    }

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [panels])

  return (
    <div className="flex h-full w-full flex-col">
      <TopBar project={props.project} />
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
        {sizes.map((size, i) => (
          <div
            className="absolute top-0 z-20 h-full cursor-col-resize"
            style={{
              width: RESIZE_AREA,
              left: `${size - RESIZE_AREA / 2}px`,
            }}
            onMouseDown={(e) => e.preventDefault()}
            onDoubleClick={resizeAll}
            key={i}
          />
        ))}
        {panels.map((panel) => {
          return (
            <Panel key={panel.id} id={panel.id} body={props.panelBodyElement} />
          )
        })}
      </div>
      <BottomBar />
    </div>
  )
}
