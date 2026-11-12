import { isEditableTarget } from '../../../../../utils/isEditableTarget'
import { useDockingStore } from '../../../multi-view/store'
import { useSearchStore } from '../../../search/store'
import { useStore } from '../../store/store'

type Props = {
  containerRef: React.RefObject<HTMLElement | null>
}

export type DesktopControls = {
  onWheel: (event: WheelEvent) => void
  onMouseDown: (event: MouseEvent) => void
  onMouseMove: (
    event: MouseEvent,
    opts?: { disableSelection?: boolean },
  ) => void
  onDoubleClick: (event: MouseEvent) => void
  onKeyDown: (event: KeyboardEvent) => void
  onKeyUp: (event: KeyboardEvent) => void
  onMouseUp: (event: MouseEvent) => void
  isResizing: boolean
}

export function useDesktopControls({ containerRef }: Props): DesktopControls {
  const currentPanel = useDockingStore((state) => state.activeLeaf)
  const searchOpened = useSearchStore((state) => state.opened)

  const onKeyDown = useStore((state) => state.onKeyDown)
  const onKeyUp = useStore((state) => state.onKeyUp)
  const onMouseDown = useStore((state) => state.onMouseDown)
  const onMouseMove = useStore((state) => state.onMouseMove)
  const onDoubleClick = useStore((state) => state.onDoubleClick)
  const onMouseUp = useStore((state) => state.onMouseUp)
  const onWheel = useStore((state) => state.onWheel)
  const isResizing = useStore((state) => state.resizingNode !== undefined)

  // Always capture if we're not in panel mode, or if we're in nodes panel
  const shouldCapture =
    (currentPanel === undefined || currentPanel === 'nodes') && !searchOpened

  function handleWheel(event: WheelEvent) {
    if (!containerRef.current) return
    onWheel(event, containerRef.current)
  }

  function handleMouseDown(event: MouseEvent) {
    if (!containerRef.current) return
    onMouseDown(event, containerRef.current)
  }

  function handleMouseMove(
    event: MouseEvent,
    opts?: { disableSelection?: boolean },
  ) {
    if (!containerRef.current) return
    onMouseMove(event, containerRef.current, opts)
  }

  function handleDoubleClick(event: MouseEvent) {
    if (!containerRef.current) return
    onDoubleClick(event, containerRef.current)
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (!shouldCapture) return

    if (isEditableTarget(event.target)) return

    onKeyDown(event)
  }

  return {
    onWheel: handleWheel,
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onDoubleClick: handleDoubleClick,
    onKeyDown: handleKeyDown,
    onKeyUp: onKeyUp,
    onMouseUp: onMouseUp,
    isResizing,
  }
}
