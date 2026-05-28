import {
  type Dispatch,
  type SetStateAction,
  useLayoutEffect,
  useState,
} from 'react'
import { useDockingHook } from './context'
import { findLeafByTab } from './tree'
import type { TabId } from './types'

interface Rect {
  left: number
  top: number
  width: number
  height: number
}

const OFFSCREEN: Rect = { left: -10000, top: -10000, width: 800, height: 600 }

export function PositionedBody(props: {
  tab: TabId
  rootRef: React.RefObject<HTMLElement | null>
}) {
  const useStore = useDockingHook()
  const tree = useStore((state) => state.tree)
  const fullScreenTab = useStore((state) => state.fullScreenTab)
  const config = useStore((state) => state.config)
  const [rect, setRect] = useState<Rect | null>(null)

  const isFullScreen = fullScreenTab === props.tab
  const isHiddenByFullScreen =
    fullScreenTab !== undefined && fullScreenTab !== props.tab

  useLayoutEffect(() => {
    const root = props.rootRef.current
    if (!root) return undefined
    const placeholder = isFullScreen
      ? null
      : document.querySelector<HTMLElement>(
          `[data-body-placeholder="${CSS.escape(props.tab)}"]`,
        )

    function measure() {
      if (!root) return
      const rootRect = root.getBoundingClientRect()
      if (isFullScreen) {
        setRectIfChanged(setRect, {
          left: 0,
          top: 0,
          width: rootRect.width,
          height: rootRect.height,
        })
        return
      }
      if (!placeholder) return
      const phRect = placeholder.getBoundingClientRect()
      setRectIfChanged(setRect, {
        left: phRect.left - rootRect.left,
        top: phRect.top - rootRect.top,
        width: phRect.width,
        height: phRect.height,
      })
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(root)
    if (placeholder) ro.observe(placeholder)
    return () => ro.disconnect()
  }, [props.tab, tree, isFullScreen, props.rootRef])

  const leaf = findLeafByTab(tree, props.tab)
  const effective = isHiddenByFullScreen ? OFFSCREEN : (rect ?? OFFSCREEN)

  return (
    <div
      data-leaf-body-id={leaf?.id}
      className="absolute overflow-auto"
      style={{
        left: effective.left,
        top: effective.top,
        width: effective.width,
        height: effective.height,
      }}
    >
      {config.renderBody(props.tab)}
    </div>
  )
}

function setRectIfChanged(
  setRect: Dispatch<SetStateAction<Rect | null>>,
  next: Rect,
): void {
  setRect((prev) => {
    if (
      prev &&
      prev.left === next.left &&
      prev.top === next.top &&
      prev.width === next.width &&
      prev.height === next.height
    ) {
      return prev
    }
    return next
  })
}
